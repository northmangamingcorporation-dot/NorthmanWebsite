// app/api/webhook/route.js
// Store data in memory (use Redis/Database in production)
let latestData = {
  comprehensive_stats: null,
  daily_report: null,
  historical_data: null,
  last_updated: null
};

export async function POST(request) {
  const payload = await request.json();
  
  if (payload.auth_token !== '200206') {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Store the data
  latestData[payload.action] = payload.data;
  latestData.last_updated = new Date().toISOString();
  
  switch (payload.action) {
    case 'comprehensive_stats':
      console.log('✅ Comprehensive stats received:');
      console.log('   Daily payout:', payload.data.payouts.daily_total);
      console.log('   All-time payout:', payload.data.payouts.all_time_total);
      console.log('   Pending cancellations:', payload.data.cancellations.daily.pending);
      console.log('   Approved cancellations:', payload.data.cancellations.daily.approved);
      console.log('   Denied cancellations:', payload.data.cancellations.daily.denied);
      console.log('   Per-draw breakdown:', Object.keys(payload.data.payouts.by_draw).length, 'draws');
      break;
      
    case 'daily_report':
      console.log('✅ Daily report received:');
      console.log('   Date:', payload.data.date);
      console.log('   Daily payout total:', payload.data.daily_payout_total);
      console.log('   Pending cancellations:', payload.data.daily_cancellations.pending);
      console.log('   Pending tickets:', payload.data.pending_cancellations.length);
      break;
      
    case 'historical_data':
      console.log('✅ Historical data received:');
      console.log('   Cancellations:', payload.data.cancellations.length);
      console.log('   Payouts:', payload.data.payouts.length);
      console.log('   Pending:', payload.data.pending_cancellations.length);
      break;
      
    default:
      console.log('✅ Received:', payload.action);
  }
  
  return new Response('OK', { status: 200 });
}

// GET endpoint to retrieve latest data
export async function GET(request) {
  // Check auth token in header or query param
  const authHeader = request.headers.get('Authorization');
  const url = new URL(request.url);
  const authQuery = url.searchParams.get('auth_token');
  
  if (authHeader !== '200206' && authQuery !== '200206') {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Get specific data type or all
  const dataType = url.searchParams.get('type'); // 'comprehensive_stats', 'daily_report', 'historical_data'
  
  if (dataType && latestData[dataType]) {
    return Response.json({
      action: dataType,
      data: latestData[dataType],
      last_updated: latestData.last_updated
    });
  }
  
  // Return all data if no specific type requested
  if (!latestData.comprehensive_stats && !latestData.daily_report && !latestData.historical_data) {
    return Response.json({ 
      message: 'No data available yet',
      waiting: true 
    }, { status: 404 });
  }
  
  // Return the most recent comprehensive stats or daily report
  const mainData = latestData.comprehensive_stats || latestData.daily_report;
  
  return Response.json({
    action: latestData.comprehensive_stats ? 'comprehensive_stats' : 'daily_report',
    data: mainData,
    last_updated: latestData.last_updated,
    available_data: {
      comprehensive_stats: !!latestData.comprehensive_stats,
      daily_report: !!latestData.daily_report,
      historical_data: !!latestData.historical_data
    }
  });
}