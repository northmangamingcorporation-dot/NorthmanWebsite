// api/webhook.js (Vercel Pages Router - No KV, just forwarding)

const AUTH_TOKEN = process.env.WEBHOOK_AUTH_TOKEN || '200206';

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    
    // Just log the data - don't store anything
    switch (action) {
      case 'combined_report':
        handleCombinedReport(data);
        break;
        
      case 'daily_report':
        handleDailyReport(data);
        break;
        
      case 'comprehensive_stats':
        handleComprehensiveStats(data);
        break;
        
      case 'historical_data':
        handleHistoricalData(data);
        break;
        
      default:
        console.warn(`⚠️ Unknown action: ${action}`);
        return res.status(400).json({
          success: false,
          error: 'Unknown action'
        });
    }
    
    console.log(`✅ Successfully processed ${action}`);
    
    return res.status(200).json({
      success: true,
      action,
      timestamp: new Date().toISOString(),
      message: 'Data received and logged'
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
// DATA HANDLERS - Just logging, no storage
// ============================================

function handleCombinedReport(data) {
  console.log('📊 Processing combined report...');
  
  const { comprehensive_stats, daily_report, historical_data } = data;
  
  // Log summary
  console.log(`💰 Daily payout: ₱${daily_report.daily_payout_total?.toLocaleString() || 0}`);
  console.log(`📋 Pending cancellations: ${daily_report.daily_cancellations?.pending || 0}`);
  console.log(`💎 All-time payout: ₱${comprehensive_stats.payouts?.all_time_total?.toLocaleString() || 0}`);
  
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