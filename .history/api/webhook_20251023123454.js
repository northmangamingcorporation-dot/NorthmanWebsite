// api/webhook.js
// Enhanced webhook with JSONBin.io for persistent storage
// ✅ Now supports combined_report action

const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY || '$2a$10$94f359TVjq130gl0yNVSNuxkaxcSositdejr.3.fve1kgWbIS0E.u';
const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID || '68f9aeafd0ea881f40b4bcc2';
const JSONBIN_BASE_URL = 'https://api.jsonbin.io/v3';

// Helper function to fetch data from JSONBin
async function fetchFromStorage() {
  try {
    const response = await fetch(`${JSONBIN_BASE_URL}/b/${JSONBIN_BIN_ID}/latest`, {
      method: 'GET',
      headers: {
        'X-Master-Key': JSONBIN_API_KEY,
        'X-Bin-Meta': 'false'
      }
    });
    
    if (!response.ok) {
      console.error('Failed to fetch from storage:', response.status);
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching from storage:', error);
    return null;
  }
}

// Helper function to save data to JSONBin
async function saveToStorage(data) {
  try {
    const response = await fetch(`${JSONBIN_BASE_URL}/b/${JSONBIN_BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      console.error('Failed to save to storage:', response.status);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving to storage:', error);
    return false;
  }
}

// Initialize empty data structure
function getEmptyDataStore() {
  return {
    comprehensive_stats: null,
    daily_report: null,
    historical_data: null,
    metadata: {
      last_updated: null,
      update_count: 0,
      first_sync: null
    }
  };
}

// Helper function to validate payload structure
function validatePayload(payload) {
  if (!payload.action) {
    return { valid: false, error: 'Missing action field' };
  }
  
  if (!payload.auth_token) {
    return { valid: false, error: 'Missing auth_token field' };
  }
  
  if (!payload.data) {
    return { valid: false, error: 'Missing data field' };
  }
  
  // Validate specific action data structures
  switch (payload.action) {
    case 'comprehensive_stats':
      if (!payload.data.payouts || !payload.data.cancellations) {
        return { valid: false, error: 'Invalid comprehensive_stats structure' };
      }
      break;
      
    case 'daily_report':
      if (payload.data.daily_payout_total === undefined || !payload.data.daily_cancellations) {
        return { valid: false, error: 'Invalid daily_report structure' };
      }
      break;
      
    case 'historical_data':
      if (!Array.isArray(payload.data.cancellations) || !Array.isArray(payload.data.payouts)) {
        return { valid: false, error: 'Invalid historical_data structure' };
      }
      break;
    
    case 'combined_report':
      // Validate combined report has required sections
      if (!payload.data.comprehensive_stats || !payload.data.daily_report) {
        return { valid: false, error: 'Invalid combined_report structure (missing comprehensive_stats or daily_report)' };
      }
      break;
  }
  
  return { valid: true };
}

// Helper function to format currency
function formatCurrency(amount) {
  return `₱${Number(amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Helper function to log data summary
function logDataSummary(action, data) {
  const timestamp = new Date().toISOString();
  
  switch (action) {
    case 'combined_report':
      console.log(`\n🎯 [${timestamp}] Combined Report Received:`);
      const compStats = data.comprehensive_stats;
      const dailyRpt = data.daily_report;
      
      console.log(`   📅 Date: ${data.date}`);
      console.log(`   💰 Daily Payout: ${formatCurrency(compStats.payouts.daily_total)}`);
      console.log(`   💎 All-Time Payout: ${formatCurrency(compStats.payouts.all_time_total)}`);
      console.log(`   ⏳ Pending Cancellations: ${dailyRpt.daily_cancellations.pending}`);
      console.log(`   ✅ Approved Today: ${dailyRpt.daily_cancellations.approved}`);
      console.log(`   ❌ Denied Today: ${dailyRpt.daily_cancellations.denied}`);
      
      if (data.historical_data) {
        console.log(`   📚 Historical: ${data.historical_data.cancellations.length} cancellations, ${data.historical_data.payouts.length} payouts`);
      }
      break;
    
    case 'comprehensive_stats':
      console.log(`\n📊 [${timestamp}] Comprehensive Stats Received:`);
      console.log(`   📅 Date: ${data.date}`);
      console.log(`   💰 Daily Payout: ${formatCurrency(data.payouts.daily_total)}`);
      console.log(`   💎 All-Time Payout: ${formatCurrency(data.payouts.all_time_total)}`);
      console.log(`   ⏳ Pending Cancellations: ${data.cancellations.daily.pending}`);
      console.log(`   ✅ Approved Today: ${data.cancellations.daily.approved}`);
      console.log(`   ❌ Denied Today: ${data.cancellations.daily.denied}`);
      console.log(`   🎯 Per-Draw Data: ${Object.keys(data.payouts.by_draw).length} draws`);
      
      Object.entries(data.payouts.by_draw).forEach(([time, stats]) => {
        console.log(`      ${time}: ${formatCurrency(stats.total_amount)} (${stats.count} payouts)`);
      });
      break;
      
    case 'daily_report':
      console.log(`\n📋 [${timestamp}] Daily Report Received:`);
      console.log(`   📅 Date: ${data.date}`);
      console.log(`   💰 Daily Total: ${formatCurrency(data.daily_payout_total)}`);
      console.log(`   ⏳ Pending: ${data.daily_cancellations.pending}`);
      console.log(`   ✅ Approved: ${data.daily_cancellations.approved}`);
      console.log(`   ❌ Denied: ${data.daily_cancellations.denied}`);
      console.log(`   📋 Pending Tickets: ${data.pending_cancellations.length}`);
      break;
      
    case 'historical_data':
      console.log(`\n📚 [${timestamp}] Historical Data Received:`);
      console.log(`   📜 Total Cancellations: ${data.cancellations.length}`);
      console.log(`   💰 Total Payouts: ${data.payouts.length}`);
      console.log(`   ⏳ Pending Tickets: ${data.pending_cancellations.length}`);
      
      const totalHistoricalPayout = data.payouts.reduce(
        (sum, p) => sum + (p.payout_amount || 0), 0
      );
      console.log(`   💎 Historical Payout Total: ${formatCurrency(totalHistoricalPayout)}`);
      break;
      
    default:
      console.log(`\n✅ [${timestamp}] Received: ${action}`);
  }
}

// POST handler - receives data from Python script
async function handlePost(req, res) {
  try {
    const payload = req.body;
    
    // Validate auth token
    const validToken = process.env.WEBHOOK_AUTH_TOKEN || '200206';
    if (payload.auth_token !== validToken) {
      console.error('❌ Unauthorized access attempt');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Validate payload structure
    const validation = validatePayload(payload);
    if (!validation.valid) {
      console.error(`❌ Invalid payload: ${validation.error}`);
      return res.status(400).json({ error: validation.error });
    }
    
    // Fetch current data from storage
    let dataStore = await fetchFromStorage();
    if (!dataStore) {
      console.log('📦 Initializing new data store');
      dataStore = getEmptyDataStore();
    }
    
    // Update metadata
    const now = new Date().toISOString();
    if (!dataStore.metadata.first_sync) {
      dataStore.metadata.first_sync = now;
    }
    dataStore.metadata.last_updated = now;
    dataStore.metadata.update_count++;
    
    // Handle combined_report by extracting its components
    if (payload.action === 'combined_report') {
      const combinedData = payload.data;
      
      // Store comprehensive stats
      if (combinedData.comprehensive_stats) {
        dataStore.comprehensive_stats = {
          data: combinedData.comprehensive_stats,
          received_at: now,
          python_timestamp: payload.timestamp
        };
      }
      
      // Store daily report
      if (combinedData.daily_report) {
        dataStore.daily_report = {
          data: {
            date: combinedData.date,
            ...combinedData.daily_report
          },
          received_at: now,
          python_timestamp: payload.timestamp
        };
      }
      
      // Store historical data if present
      if (combinedData.historical_data) {
        dataStore.historical_data = {
          data: combinedData.historical_data,
          received_at: now,
          python_timestamp: payload.timestamp
        };
      }
    } else {
      // Store single action data
      dataStore[payload.action] = {
        data: payload.data,
        received_at: now,
        python_timestamp: payload.timestamp
      };
    }
    
    // Save to storage
    const saved = await saveToStorage(dataStore);
    
    if (!saved) {
      console.error('❌ Failed to save to storage');
      return res.status(500).json({ 
        error: 'Failed to persist data',
        success: false
      });
    }
    
    // Log summary
    logDataSummary(payload.action, payload.data);
    
    // Return success with metadata
    return res.status(200).json({ 
      success: true,
      action: payload.action,
      received_at: now,
      update_count: dataStore.metadata.update_count,
      stored: true
    });
    
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

// GET handler - retrieves latest data
async function handleGet(req, res) {
  try {
    const { auth_token, type } = req.query;
    const authHeader = req.headers.authorization?.replace('Bearer ', '');
    
    // Check auth token
    const validToken = process.env.WEBHOOK_AUTH_TOKEN || '200206';
    if (authHeader !== validToken && auth_token !== validToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Fetch data from storage
    const dataStore = await fetchFromStorage();
    
    if (!dataStore) {
      return res.status(503).json({ 
        error: 'Storage service unavailable',
        message: 'Could not connect to storage backend'
      });
    }
    
    // Check if any data exists
    const hasData = dataStore.comprehensive_stats || dataStore.daily_report || dataStore.historical_data;
    
    if (!hasData) {
      return res.status(404).json({ 
        message: 'No data available yet. Waiting for first sync from Python script.',
        waiting: true,
        metadata: dataStore.metadata
      });
    }
    
    // Return specific data type if requested
    if (type) {
      const requestedData = dataStore[type];
      
      if (!requestedData) {
        return res.status(404).json({ 
          error: `No data available for type: ${type}`,
          available_types: Object.keys(dataStore).filter(k => k !== 'metadata' && dataStore[k])
        });
      }
      
      return res.status(200).json({
        action: type,
        ...requestedData,
        metadata: dataStore.metadata
      });
    }
    
    // Return summary of all available data
    const summary = {
      metadata: dataStore.metadata,
      available_data: {
        comprehensive_stats: !!dataStore.comprehensive_stats,
        daily_report: !!dataStore.daily_report,
        historical_data: !!dataStore.historical_data
      },
      latest_update: null
    };
    
    // Find most recent update
    let latestTime = null;
    let latestType = null;
    
    ['comprehensive_stats', 'daily_report', 'historical_data'].forEach(type => {
      if (dataStore[type]) {
        const time = new Date(dataStore[type].received_at);
        if (!latestTime || time > latestTime) {
          latestTime = time;
          latestType = type;
        }
      }
    });
    
    if (latestType) {
      summary.latest_update = {
        type: latestType,
        received_at: dataStore[latestType].received_at,
        data: dataStore[latestType].data
      };
    }
    
    return res.status(200).json(summary);
    
  } catch (error) {
    console.error('❌ Error retrieving data:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

// Main handler - Vercel serverless function format
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Route to appropriate handler
  if (req.method === 'POST') {
    return handlePost(req, res);
  } else if (req.method === 'GET') {
    return handleGet(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}