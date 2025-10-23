// api/webhook.js (Vercel Pages Router)

import { kv } from '@vercel/kv'; // Optional: for Vercel KV storage

const AUTH_TOKEN = process.env.WEBHOOK_AUTH_TOKEN || '200206';

export default async function handler(req, res) {
  // Handle POST requests (receive data from Raspberry Pi)
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
      
      // Handle different actions
      switch (action) {
        case 'combined_report':
          await handleCombinedReport(data);
          break;
          
        case 'daily_report':
          await handleDailyReport(data);
          break;
          
        case 'comprehensive_stats':
          await handleComprehensiveStats(data);
          break;
          
        case 'historical_data':
          await handleHistoricalData(data);
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
        message: 'Data received and processed'
      });
      
    } catch (error) {
      console.error('❌ Webhook error:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // Handle GET requests (retrieve stored data)
  else if (req.method === 'GET') {
    try {
      const { type = 'daily', date } = req.query;
      
      let data = null;
      
      if (typeof kv !== 'undefined') {
        switch (type) {
          case 'comprehensive':
            data = await kv.get('stats:comprehensive');
            break;
            
          case 'daily':
            if (date) {
              data = await kv.get(`stats:daily:${date}`);
            } else {
              data = await kv.get('stats:daily:latest');
            }
            break;
            
          case 'historical':
            data = await kv.get('data:historical');
            break;
            
          case 'last_sync':
            const lastSync = await kv.get('sync:last_update');
            return res.status(200).json({ last_sync: lastSync });
            
          default:
            return res.status(400).json({ error: 'Invalid type parameter' });
        }
      }
      
      if (data) {
        return res.status(200).json(typeof data === 'string' ? JSON.parse(data) : data);
      } else {
        return res.status(404).json({
          error: 'No data found',
          type,
          date
        });
      }
      
    } catch (error) {
      console.error('❌ GET error:', error);
      return res.status(500).json({ error: error.message });
    }
  }
  
  // Method not allowed
  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

// ============================================
// DATA HANDLERS
// ============================================

async function handleCombinedReport(data) {
  console.log('📊 Processing combined report...');
  
  const { comprehensive_stats, daily_report, historical_data } = data;
  
  // Store in Vercel KV (or your preferred storage)
  if (typeof kv !== 'undefined') {
    // Store latest comprehensive stats
    await kv.set('stats:comprehensive', JSON.stringify(comprehensive_stats));
    
    // Store daily report
    await kv.set('stats:daily:latest', JSON.stringify(daily_report));
    await kv.set(`stats:daily:${data.date}`, JSON.stringify(daily_report));
    
    // Store historical data if included
    if (historical_data) {
      await kv.set('data:historical', JSON.stringify(historical_data));
    }
    
    // Update last sync timestamp
    await kv.set('sync:last_update', new Date().toISOString());
  }
  
  // Log summary
  console.log(`💰 Daily payout: ₱${daily_report.daily_payout_total.toLocaleString()}`);
  console.log(`📋 Pending cancellations: ${daily_report.daily_cancellations.pending}`);
  
  if (historical_data) {
    console.log(`📚 Historical: ${historical_data.cancellations.length} cancellations, ${historical_data.payouts.length} payouts`);
  }
}

async function handleDailyReport(data) {
  console.log('📅 Processing daily report...');
  
  if (typeof kv !== 'undefined') {
    await kv.set('stats:daily:latest', JSON.stringify(data));
    await kv.set(`stats:daily:${data.date || new Date().toISOString().split('T')[0]}`, JSON.stringify(data));
  }
  
  console.log(`💰 Payout: ₱${data.daily_payout_total?.toLocaleString() || 0}`);
  console.log(`📋 Cancellations: ${data.daily_cancellations?.total || 0}`);
}

async function handleComprehensiveStats(data) {
  console.log('📊 Processing comprehensive stats...');
  
  if (typeof kv !== 'undefined') {
    await kv.set('stats:comprehensive', JSON.stringify(data));
  }
  
  console.log(`💰 All-time payout: ₱${data.payouts?.all_time_total?.toLocaleString() || 0}`);
  console.log(`📋 All-time cancellations: ${data.cancellations?.all_time?.total || 0}`);
}

async function handleHistoricalData(data) {
  console.log('📚 Processing historical data...');
  
  if (typeof kv !== 'undefined') {
    await kv.set('data:historical', JSON.stringify(data));
  }
  
  console.log(`📚 Records: ${data.cancellations?.length || 0} cancellations, ${data.payouts?.length || 0} payouts`);
}