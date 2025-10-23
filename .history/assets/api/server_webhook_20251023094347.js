export async function POST(request) {
  const payload = await request.json();
  
  if (payload.auth_token !== '200206') {
    return new Response('Unauthorized', { status: 401 });
  }
  
  switch (payload.action) {
    case 'comprehensive_stats':
      // payload.data contains all stats
      console.log('Daily payout:', payload.data.payouts.daily_total);
      console.log('All-time payout:', payload.data.payouts.all_time_total);
      console.log('Pending cancellations:', payload.data.cancellations.daily.pending);
      console.log('Per-draw breakdown:', payload.data.payouts.by_draw);
      break;
      
    case 'daily_report':
      // payload.data contains today's summary
      break;
      
    case 'historical_data':
      // payload.data.cancellations = all cancellations
      // payload.data.payouts = all payouts
      break;
  }
  
  return new Response('OK', { status: 200 });
}