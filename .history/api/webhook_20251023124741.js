// app/api/webhook/route.js (Next.js App Router)
// or pages/api/webhook.js (Pages Router - export default function handler(req, res) {...})

import { kv } from '@vercel/kv'; // Optional: for Vercel KV storage

const AUTH_TOKEN = process.env.WEBHOOK_AUTH_TOKEN || '200206';

export async function POST(request) {
  try {
    // Parse incoming data
    const payload = await request.json();
    
    // Verify authentication
    if (payload.auth_token !== AUTH_TOKEN) {
      console.error('❌ Invalid auth token');
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
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
        return Response.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        );
    }
    
    console.log(`✅ Successfully processed ${action}`);
    
    return Response.json({
      success: true,
      action,
      timestamp: new Date().toISOString(),
      message: 'Data received and processed'
    });
    
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
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

// ============================================
// GET ENDPOINT - Retrieve stored data
// ============================================

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'daily';
    const date = searchParams.get('date');
    
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
          return Response.json({ last_sync: lastSync });
          
        default:
          return Response.json(
            { error: 'Invalid type parameter' },
            { status: 400 }
          );
      }
    }
    
    if (data) {
      return Response.json(typeof data === 'string' ? JSON.parse(data) : data);
    } else {
      return Response.json(
        { error: 'No data found', type, date },
        { status: 404 }
      );
    }
    
  } catch (error) {
    console.error('❌ GET error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}