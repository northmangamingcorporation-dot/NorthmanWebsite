// api/webhook.js (Vercel Pages Router - ADVANCED with monitoring & analytics)

const AUTH_TOKEN = process.env.WEBHOOK_AUTH_TOKEN || '200206';

// PostgreSQL API fallback configuration
const POSTGRES_API_URL = 'https://api.northman-gaming-corporation.site';
const POSTGRES_API_KEY = process.env.API_KEY || '';

// Failover settings
const MAX_WEBHOOK_FAILURES = 3;
const COOLDOWN_PERIOD = 300000; // 5 minutes

// Failover state
let webhookFailureCount = 0;
let lastWebhookFailure = null;

// ✅ In-memory storage for latest data (resets on serverless cold start)
let latestData = {
  combined_report: null,
  daily_report: null,
  comprehensive_stats: null,
  historical_data: null,
  last_updated: null
};

// 🚀 ADVANCED FEATURES

// Request tracking and analytics
const analytics = {
  requests: {
    total: 0,
    successful: 0,
    failed: 0,
    unauthorized: 0,
    byAction: {}
  },
  performance: {
    avgResponseTime: 0,
    slowestRequest: 0,
    fastestRequest: Infinity
  },
  dataMetrics: {
    totalPayoutValue: 0,
    totalCancellations: 0,
    lastPayoutAmount: 0,
    dailyTrend: [],
    byDrawToday: {}
  },
  failover: {
    webhookFailures: 0,
    databaseFallbacks: 0,
    lastFailover: null
  }
};

// Rate limiting (per IP)
const rateLimiter = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100;

// Request history for debugging (keep last 50)
const requestHistory = [];
const MAX_HISTORY = 50;

// Data validation schemas
const validActions = ['combined_report', 'daily_report', 'comprehensive_stats', 'historical_data'];

// ============================================
// DATABASE FALLBACK FUNCTION
// ============================================

async function fetchFromDatabase(action) {
  if (!POSTGRES_API_KEY) {
    throw new Error('POSTGRES_API_KEY not configured');
  }

  console.log(`📊 [Fallback] Fetching ${action} from database...`);
  
  let endpoint, params;
  
  switch (action) {
    case 'combined_report':
      endpoint = '/analytics/v2/summary';
      params = '?days=1';
      break;
    case 'daily_report':
      endpoint = '/analytics/v2/summary';
      params = '?days=1';
      break;
    case 'comprehensive_stats':
      endpoint = '/analytics/v2/cancellations';
      params = '?days=365&include_details=false';
      break;
    case 'historical_data':
      endpoint = '/data/v1/cancellations';
      params = '?page=1&page_size=1000&sort_by=timestamp&sort_direction=desc';
      break;
    default:
      throw new Error(`Unknown action: ${action}`);
  }

  const response = await fetch(`${POSTGRES_API_URL}${endpoint}${params}`, {
    headers: {
      'X-API-Key': POSTGRES_API_KEY,
      'Content-Type': 'application/json'
    },
    signal: AbortSignal.timeout(15000)
  });

  if (!response.ok) {
    throw new Error(`Database API error: ${response.status}`);
  }

  const data = await response.json();
  console.log(`✅ [Fallback] Successfully fetched from database`);
  
  analytics.failover.databaseFallbacks++;
  return data;
}

// ============================================
// MAIN HANDLER
// ============================================

export default async function handler(req, res) {
  const startTime = Date.now();
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  // Track request
  analytics.requests.total++;
  
  // Rate limiting check
  if (!checkRateLimit(clientIp)) {
    analytics.requests.failed++;
    return res.status(429).json({
      success: false,
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      retry_after: '60 seconds'
    });
  }
  
  try {
    // ============================================
    // GET - Fetch latest data with advanced filtering
    // ============================================
    if (req.method === 'GET') {
      const { auth_token, action, format, include_analytics } = req.query;
      
      // Verify auth
      if (auth_token !== AUTH_TOKEN) {
        analytics.requests.unauthorized++;
        logRequest(req, 401, 'Unauthorized GET attempt');
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
      }
      
      // Check if data is stale or missing - trigger fallback
      const dataAge = latestData.last_updated ? Date.now() - new Date(latestData.last_updated).getTime() : Infinity;
      const isStale = dataAge > 3600000; // 1 hour
      
      if (!latestData.last_updated || isStale) {
        console.log(`⚠️  Data is ${!latestData.last_updated ? 'missing' : 'stale'}, attempting database fallback...`);
        
        try {
          // Try to fetch from database
          if (action && validActions.includes(action)) {
            const dbData = await fetchFromDatabase(action);
            latestData[action] = dbData;
            latestData.last_updated = new Date().toISOString();
            console.log(`✅ Data refreshed from database`);
          } else {
            // Fetch all data
            for (const act of validActions) {
              try {
                const dbData = await fetchFromDatabase(act);
                latestData[act] = dbData;
              } catch (e) {
                console.error(`❌ Failed to fetch ${act}: ${e.message}`);
              }
            }
            latestData.last_updated = new Date().toISOString();
          }
        } catch (error) {
          console.error(`❌ Database fallback failed: ${error.message}`);
          if (!latestData.last_updated) {
            return res.status(503).json({
              success: false,
              error: 'Service temporarily unavailable',
              message: 'Both webhook and database sources are unavailable',
              server_status: 'degraded'
            });
          }
        }
      }
      
      console.log('✅ GET: Serving latest data');
      
      // Advanced filtering - specific action
      let responseData = latestData;
      if (action && validActions.includes(action)) {
        responseData = {
          [action]: latestData[action],
          last_updated: latestData.last_updated
        };
      }
      
      // Build response
      const response = {
        success: true,
        latest_update: responseData,
        timestamp: new Date().toISOString(),
        server_time: Date.now(),
        data_age_ms: dataAge === Infinity ? null : dataAge
      };
      
      // Include analytics if requested
      if (include_analytics === 'true') {
        response.analytics = getAnalyticsSummary();
      }
      
      // Format response (JSON is default, can add CSV/XML later)
      if (format === 'summary') {
        response.summary = generateDataSummary(latestData);
      }
      
      // Generate by_draw summary if requested
      if (format === 'by_draw' || format === 'summary') {
        response.by_draw_summary = generateByDrawSummary(latestData);
      }
      
      analytics.requests.successful++;
      logRequest(req, 200, 'Data retrieved successfully', Date.now() - startTime);
      
      return res.status(200).json(response);
    }
    
    // ============================================
    // POST - Receive and store data with validation
    // ============================================
    if (req.method === 'POST') {
      const payload = req.body;
      
      // Verify authentication
      if (payload.auth_token !== AUTH_TOKEN) {
        console.error('❌ Invalid auth token');
        analytics.requests.unauthorized++;
        logRequest(req, 401, 'Unauthorized POST attempt');
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
      }
      
      const { action, data, timestamp } = payload;
      
      // Validate payload structure
      if (!action || !data || !timestamp) {
        analytics.requests.failed++;
        return res.status(400).json({
          success: false,
          error: 'Invalid payload',
          message: 'Required fields: action, data, timestamp'
        });
      }
      
      // Validate action type
      if (!validActions.includes(action)) {
        analytics.requests.failed++;
        return res.status(400).json({
          success: false,
          error: 'Unknown action',
          valid_actions: validActions
        });
      }
      
      console.log(`📥 Received ${action} at ${timestamp}`);
      
      // Track action in analytics
      if (!analytics.requests.byAction[action]) {
        analytics.requests.byAction[action] = 0;
      }
      analytics.requests.byAction[action]++;
      
      // Reset webhook failure count on successful POST
      webhookFailureCount = 0;
      lastWebhookFailure = null;
      
      // ✅ Store the data based on action type
      switch (action) {
        case 'combined_report':
          latestData.combined_report = data;
          latestData.last_updated = timestamp;
          handleCombinedReport(data);
          updateMetrics(data);
          break;
          
        case 'daily_report':
          latestData.daily_report = data;
          latestData.last_updated = timestamp;
          handleDailyReport(data);
          updateDailyMetrics(data);
          break;
          
        case 'comprehensive_stats':
          latestData.comprehensive_stats = data;
          latestData.last_updated = timestamp;
          handleComprehensiveStats(data);
          updateComprehensiveMetrics(data);
          break;
          
        case 'historical_data':
          latestData.historical_data = data;
          latestData.last_updated = timestamp;
          handleHistoricalData(data);
          break;
          
        default:
          console.warn(`⚠️ Unknown action: ${action}`);
          return res.status(400).json({
            success: false,
            error: 'Unknown action'
          });
      }
      
      const processingTime = Date.now() - startTime;
      updatePerformanceMetrics(processingTime);
      
      console.log(`✅ Successfully stored and processed ${action} (${processingTime}ms)`);
      
      analytics.requests.successful++;
      logRequest(req, 200, `${action} processed successfully`, processingTime);
      
      return res.status(200).json({
        success: true,
        action,
        timestamp: new Date().toISOString(),
        message: 'Data received, stored, and logged',
        processing_time_ms: processingTime,
        data_size_bytes: JSON.stringify(data).length
      });
      
    }
    
    // ============================================
    // ADVANCED ENDPOINTS
    // ============================================
    
    // Health check endpoint
    if (req.method === 'HEAD') {
      return res.status(200).end();
    }
    
    // ============================================
    // Other methods not allowed
    // ============================================
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowed_methods: ['GET', 'POST', 'HEAD']
    });
    
  } catch (error) {
    console.error('❌ Webhook error:', error);
    analytics.requests.failed++;
    logRequest(req, 500, `Error: ${error.message}`);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

// ============================================
// DATA HANDLERS - Enhanced for by_draw data
// ============================================

function handleCombinedReport(data) {
  console.log('📊 Processing combined report...');
  
  const { comprehensive_stats, daily_report } = data;
  
  // Log summary
  console.log(`💰 Daily payout: ₱${daily_report?.daily_payout_total?.toLocaleString() || 0}`);
  console.log(`📋 Pending cancellations: ${daily_report?.daily_cancellations?.pending || 0}`);
  console.log(`💎 All-time payout: ₱${comprehensive_stats?.payouts?.all_time_total?.toLocaleString() || 0}`);
  
  // Log by_draw data
  if (comprehensive_stats?.payouts?.by_draw) {
    console.log('\n📊 BY DRAW BREAKDOWN:');
    Object.entries(comprehensive_stats.payouts.by_draw).forEach(([drawTime, drawData]) => {
      console.log(`  ⏰ ${drawTime}: ₱${drawData.total_amount?.toLocaleString() || 0} (${drawData.count || 0} payouts)`);
    });
  }
  
  if (comprehensive_stats?.cancellations?.by_draw) {
    console.log('\n📋 CANCELLATIONS BY DRAW:');
    Object.entries(comprehensive_stats.cancellations.by_draw).forEach(([drawTime, drawData]) => {
      console.log(`  ⏰ ${drawTime}: Pending: ${drawData.pending || 0}, Approved: ${drawData.approved || 0}, Denied: ${drawData.denied || 0}`);
    });
  }
}

function handleDailyReport(data) {
  console.log('📅 Processing daily report...');
  console.log(`💰 Payout: ₱${data.daily_payout_total?.toLocaleString() || 0}`);
  console.log(`📋 Cancellations: ${data.daily_cancellations?.total || 0}`);
}

function handleComprehensiveStats(data) {
  console.log('📊 Processing comprehensive stats...');
  console.log(`💰 All-time payout: ₱${data.payouts?.all_time_total?.toLocaleString() || 0}`);
  console.log(`📋 All-time cancellations: ${data.cancellations?.all_time?.total || 0}`);
}

function handleHistoricalData(data) {
  console.log('📚 Processing historical data...');
  console.log(`📚 Records: ${data.cancellations?.length || 0} cancellations, ${data.payouts?.length || 0} payouts`);
}

// ============================================
// 🚀 ADVANCED UTILITY FUNCTIONS
// ============================================

function checkRateLimit(ip) {
  const now = Date.now();
  const clientHistory = rateLimiter.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
  // Reset if window expired
  if (now > clientHistory.resetTime) {
    clientHistory.count = 0;
    clientHistory.resetTime = now + RATE_LIMIT_WINDOW;
  }
  
  clientHistory.count++;
  rateLimiter.set(ip, clientHistory);
  
  return clientHistory.count <= MAX_REQUESTS_PER_WINDOW;
}

function logRequest(req, statusCode, message, processingTime = 0) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.url,
    status: statusCode,
    message,
    processingTime,
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    userAgent: req.headers['user-agent']
  };
  
  requestHistory.unshift(logEntry);
  
  // Keep only last MAX_HISTORY entries
  if (requestHistory.length > MAX_HISTORY) {
    requestHistory.pop();
  }
  
  // Log to console with emoji based on status
  const emoji = statusCode < 300 ? '✅' : statusCode < 400 ? '⚠️' : '❌';
  console.log(`${emoji} [${statusCode}] ${req.method} ${req.url} - ${message} (${processingTime}ms)`);
}

function updatePerformanceMetrics(processingTime) {
  const { performance } = analytics;
  
  // Update averages
  const totalRequests = analytics.requests.total;
  performance.avgResponseTime = ((performance.avgResponseTime * (totalRequests - 1)) + processingTime) / totalRequests;
  
  // Update extremes
  if (processingTime > performance.slowestRequest) {
    performance.slowestRequest = processingTime;
  }
  if (processingTime < performance.fastestRequest) {
    performance.fastestRequest = processingTime;
  }
}

function updateMetrics(data) {
  const { comprehensive_stats, daily_report } = data;
  
  if (comprehensive_stats?.payouts?.all_time_total) {
    analytics.dataMetrics.totalPayoutValue = comprehensive_stats.payouts.all_time_total;
  }
  
  if (daily_report?.daily_payout_total) {
    analytics.dataMetrics.lastPayoutAmount = daily_report.daily_payout_total;
  }
  
  if (comprehensive_stats?.cancellations?.all_time?.total) {
    analytics.dataMetrics.totalCancellations = comprehensive_stats.cancellations.all_time.total;
  }
  
  // Track by_draw metrics
  if (comprehensive_stats?.payouts?.by_draw && comprehensive_stats?.cancellations?.by_draw) {
    analytics.dataMetrics.byDrawToday = generateByDrawMetrics(comprehensive_stats);
  }
}

function updateDailyMetrics(data) {
  if (data.daily_payout_total) {
    analytics.dataMetrics.lastPayoutAmount = data.daily_payout_total;
    
    // Track daily trend (keep last 30 days)
    analytics.dataMetrics.dailyTrend.unshift({
      date: new Date().toISOString().split('T')[0],
      payout: data.daily_payout_total,
      cancellations: data.daily_cancellations?.total || 0
    });
    
    if (analytics.dataMetrics.dailyTrend.length > 30) {
      analytics.dataMetrics.dailyTrend.pop();
    }
  }
}

function updateComprehensiveMetrics(data) {
  if (data.payouts?.all_time_total) {
    analytics.dataMetrics.totalPayoutValue = data.payouts.all_time_total;
  }
  
  if (data.cancellations?.all_time?.total) {
    analytics.dataMetrics.totalCancellations = data.cancellations.all_time.total;
  }
}

function generateByDrawMetrics(comprehensiveStats) {
  const byDrawData = {};
  const drawTimes = ['10:30', '14:00', '17:00', '20:00', '21:00'];
  
  drawTimes.forEach(drawTime => {
    const payoutData = comprehensiveStats.payouts?.by_draw?.[drawTime] || {};
    const cancelData = comprehensiveStats.cancellations?.by_draw?.[drawTime] || {};
    
    byDrawData[drawTime] = {
      pending: cancelData.pending || 0,
      approved: cancelData.approved || 0,
      denied: cancelData.denied || 0,
      payout: payoutData.total_amount || 0
    };
  });
  
  return byDrawData;
}

function generateByDrawSummary(data) {
  if (!data.combined_report?.comprehensive_stats) {
    return null;
  }
  
  const stats = data.combined_report.comprehensive_stats;
  const byDrawSummary = [];
  
  const drawTimes = ['10:30', '14:00', '17:00', '20:00', '21:00'];
  
  drawTimes.forEach(drawTime => {
    const payoutData = stats.payouts?.by_draw?.[drawTime] || {};
    const cancelData = stats.cancellations?.by_draw?.[drawTime] || {};
    
    byDrawSummary.push({
      draw_time: drawTime,
      pending_today: cancelData.pending || 0,
      approved_today: cancelData.approved || 0,
      denied_today: cancelData.denied || 0,
      payout: payoutData.total_amount || 0,
      payout_formatted: `₱${(payoutData.total_amount || 0).toLocaleString()}`
    });
  });
  
  return byDrawSummary;
}

function getAnalyticsSummary() {
  return {
    requests: {
      total: analytics.requests.total,
      successful: analytics.requests.successful,
      failed: analytics.requests.failed,
      unauthorized: analytics.requests.unauthorized,
      success_rate: analytics.requests.total > 0 
        ? ((analytics.requests.successful / analytics.requests.total) * 100).toFixed(2) + '%'
        : '0%',
      by_action: analytics.requests.byAction
    },
    performance: {
      avg_response_time_ms: Math.round(analytics.performance.avgResponseTime),
      slowest_request_ms: analytics.performance.slowestRequest,
      fastest_request_ms: analytics.performance.fastestRequest === Infinity ? 0 : analytics.performance.fastestRequest
    },
    data_insights: {
      total_payout_value: `₱${analytics.dataMetrics.totalPayoutValue.toLocaleString()}`,
      total_cancellations: analytics.dataMetrics.totalCancellations,
      last_payout: `₱${analytics.dataMetrics.lastPayoutAmount.toLocaleString()}`,
      trend_data_points: analytics.dataMetrics.dailyTrend.length,
      by_draw_today: analytics.dataMetrics.byDrawToday
    },
    failover: {
      webhook_failures: analytics.failover.webhookFailures,
      database_fallbacks: analytics.failover.databaseFallbacks,
      last_failover: analytics.failover.lastFailover
    },
    server: {
      uptime_seconds: Math.floor(process.uptime()),
      memory_usage: process.memoryUsage(),
      node_version: process.version
    }
  };
}

function generateDataSummary(data) {
  const summary = {
    overview: {},
    highlights: [],
    status: 'active'
  };
  
  // Daily report summary
  if (data.daily_report) {
    summary.overview.daily_payout = `₱${data.daily_report.daily_payout_total?.toLocaleString() || 0}`;
    summary.overview.daily_cancellations = data.daily_report.daily_cancellations?.total || 0;
    
    if (data.daily_report.daily_payout_total > 0) {
      summary.highlights.push(`Daily payout: ₱${data.daily_report.daily_payout_total.toLocaleString()}`);
    }
  }
  
  // Comprehensive stats summary
  if (data.comprehensive_stats) {
    summary.overview.all_time_payout = `₱${data.comprehensive_stats.payouts?.all_time_total?.toLocaleString() || 0}`;
    summary.overview.all_time_cancellations = data.comprehensive_stats.cancellations?.all_time?.total || 0;
  }
  
  // Historical data summary
  if (data.historical_data) {
    summary.overview.historical_records = {
      cancellations: data.historical_data.cancellations?.length || 0,
      payouts: data.historical_data.payouts?.length || 0
    };
  }
  
  summary.last_updated = data.last_updated;
  
  return summary;
}