// api/webhook.js
// Enhanced webhook with better data management and error handling

// In-memory storage (use Vercel KV, Redis, or Database in production)
let dataStore = {
  comprehensive_stats: null,
  daily_report: null,
  historical_data: null,
  metadata: {
    last_updated: null,
    update_count: 0,
    first_sync: null
  }
};

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
    case 'comprehensive_stats':
      console.log(`\n📊 [${timestamp}] Comprehensive Stats Received:`);
      console.log(`   📅 Date: ${data.date}`);
      console.log(`   💰 Daily Payout: ${formatCurrency(data.payouts.daily_total)}`);
      console.log(`   💎 All-Time Payout: ${formatCurrency(data.payouts.all_time_total)}`);
      console.log(`   ⏳ Pending Cancellations: ${data.cancellations.daily.pending}`);
      console.log(`   ✅ Approved Today: ${data.cancellations.daily.approved}`);
      console.log(`   ❌ Denied Today: ${data.cancellations.daily.denied}`);
      console.log(`   🎯 Per-Draw Data: ${Object.keys(data.payouts.by_draw).length} draws`);
      
      // Log per-draw summary
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
      
      // Calculate totals from historical data
      const totalHistoricalPayout = data.payouts.reduce(
        (sum, p) => sum + (p.payout_amount || 0), 0
      );
      console.log(`   💎 Historical Payout Total: ${formatCurrency(totalHistoricalPayout)}`);
      break;
      
    default:
      console.log(`\n✅ [${timestamp}] Received: ${action}`);
  }
}

// POST endpoint to receive data from Python script
export async function POST(request) {
  try {
    const payload = await request.json();
    
    // Validate auth token
    if (payload.auth_token !== process.env.WEBHOOK_AUTH_TOKEN && payload.auth_token !== '200206') {
      console.error('❌ Unauthorized access attempt');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate payload structure
    const validation = validatePayload(payload);
    if (!validation.valid) {
      console.error(`❌ Invalid payload: ${validation.error}`);
      return new Response(JSON.stringify({ error: validation.error }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Update metadata
    const now = new Date().toISOString();
    if (!dataStore.metadata.first_sync) {
      dataStore.metadata.first_sync = now;
    }
    dataStore.metadata.last_updated = now;
    dataStore.metadata.update_count++;
    
    // Store the data
    dataStore[payload.action] = {
      data: payload.data,
      received_at: now,
      python_timestamp: payload.timestamp
    };
    
    // Log summary
    logDataSummary(payload.action, payload.data);
    
    // Return success with metadata
    return new Response(JSON.stringify({ 
      success: true,
      action: payload.action,
      received_at: now,
      update_count: dataStore.metadata.update_count
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// GET endpoint to retrieve latest data
export async function GET(request) {
  try {
    const url = new URL(request.url);
    
    // Check auth token
    const authHeader = request.headers.get('Authorization')?.replace('Bearer ', '');
    const authQuery = url.searchParams.get('auth_token');
    const validToken = process.env.WEBHOOK_AUTH_TOKEN || '200206';
    
    if (authHeader !== validToken && authQuery !== validToken) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get query parameters
    const dataType = url.searchParams.get('type');
    const format = url.searchParams.get('format') || 'json';
    
    // Check if any data exists
    const hasData = dataStore.comprehensive_stats || dataStore.daily_report || dataStore.historical_data;
    
    if (!hasData) {
      return new Response(JSON.stringify({ 
        message: 'No data available yet. Waiting for first sync from Python script.',
        waiting: true,
        metadata: dataStore.metadata
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Return specific data type if requested
    if (dataType) {
      const requestedData = dataStore[dataType];
      
      if (!requestedData) {
        return new Response(JSON.stringify({ 
          error: `No data available for type: ${dataType}`,
          available_types: Object.keys(dataStore).filter(k => k !== 'metadata' && dataStore[k])
        }), { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({
        action: dataType,
        ...requestedData,
        metadata: dataStore.metadata
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
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
    
    return new Response(JSON.stringify(summary), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ Error retrieving data:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}