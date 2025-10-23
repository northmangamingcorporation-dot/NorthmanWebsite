// api/webhook.js (Vercel Pages Router - WITH in-memory storage)

const AUTH_TOKEN = process.env.WEBHOOK_AUTH_TOKEN || '200206';

// ✅ In-memory storage for latest data (resets on serverless cold start)
let latestData = {
  combined_report: null,
  daily_report: null,
  comprehensive_stats: null,
  historical_data: null,
  last_updated: null
};

export default async function handler(req, res) {
  
  // ============================================
  // GET - Fetch latest data
  // ============================================
  if (req.method === 'GET') {
    const { auth_token } = req.query;
    
    // Verify auth
    if (auth_token !== AUTH_TOKEN) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
    }
    
    // Return latest data
    if (!latestData.last_updated) {
      return res.status(404).json({
        success: false,
        error: 'No data available yet',
        message: 'Waiting for first webhook push'
      });
    }
    
    console.log('✅ GET: Serving latest data');
    
    return res.status(200).json({
      success: true,
      latest_update: latestData,
      timestamp: new Date().toISOString()
    });
  }
  
  // ============================================
  // POST - Receive and store data
  // ============================================
  if (req.method === 'POST') {
    try {
      const payload = req.body;
      
      // Verify authentication
      if (payload.auth_token !== AUTH_TOKEN) {
        console.error('❌ Invalid auth token');
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
      }
      
      const { action, data, timestamp } = payload;
      
      console.log(`📥 Received ${action} at ${timestamp}`);
      
      // ✅ Store the data based on action type
      switch (action) {
        case 'combined_report':
          latestData.combined_report = data;
          latestData.last_updated = timestamp;
          handleCombinedReport(data);
          break;
          
        case 'daily_report':
          latestData.daily_report = data;
          latestData.last_updated = timestamp;
          handleDailyReport(data);
          break;
          
        case 'comprehensive_stats':
          latestData.comprehensive_stats = data;
          latestData.last_updated = timestamp;
          handleComprehensiveStats(data);
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
      
      console.log(`✅ Successfully stored and processed ${action}`);
      
      return res.status(200).json({
        success: true,
        action,
        timestamp: new Date().toISOString(),
        message: 'Data received, stored, and logged'
      });
      
    } catch (error) {
      console.error('❌ Webhook error:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // ============================================
  // Other methods not allowed
  // ============================================
  return res.status(405).json({ error: 'Method not allowed' });
}

// ============================================
// DATA HANDLERS - Logging only
// ============================================

function handleCombinedReport(data) {
  console.log('📊 Processing combined report...');
  
  const { comprehensive_stats, daily_report, historical_data } = data;
  
  // Log summary
  console.log(`💰 Daily payout: ₱${daily_report?.daily_payout_total?.toLocaleString() || 0}`);
  console.log(`📋 Pending cancellations: ${daily_report?.daily_cancellations?.pending || 0}`);
  console.log(`💎 All-time payout: ₱${comprehensive_stats?.payouts?.all_time_total?.toLocaleString() || 0}`);
  
  if (historical_data) {
    console.log(`📚 Historical: ${historical_data.cancellations?.length || 0} cancellations, ${historical_data.payouts?.length || 0} payouts`);
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