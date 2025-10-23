export async function POST(request) {
  const payload = await request.json();
  
  // Verify auth token
  if (payload.auth_token !== '200206') {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Handle different actions
  switch (payload.action) {
    case 'pending_cancellations':
      console.log('Pending cancellations:', payload.data.count);
      // Store in your database or state
      break;
      
    case 'sync_messages':
      console.log('New messages:', payload.data.records.length);
      break;
      
    case 'database_stats':
      console.log('Stats:', payload.data.stats);
      break;
  }
  
  return new Response('OK', { status: 200 });
}