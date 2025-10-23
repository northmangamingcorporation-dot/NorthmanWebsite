// api/webhook.js
// Vercel Serverless Webhook with persistent storage via Vercel KV

import { kv } from '@vercel/kv';

// Default auth token
const VALID_TOKEN = process.env.WEBHOOK_AUTH_TOKEN || '200206';

// Helper: Validate incoming payload
function validatePayload(payload) {
  if (!payload.action) return { valid: false, error: 'Missing action field' };
  if (!payload.auth_token) return { valid: false, error: 'Missing auth_token field' };
  if (!payload.data) return { valid: false, error: 'Missing data field' };

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

// Helper: Format PHP currency
function formatCurrency(amount) {
  return `₱${Number(amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Helper: Log data summary
function logDataSummary(action, data) {
  const timestamp = new Date().toISOString();

  switch (action) {
    case 'comprehensive_stats':
      console.log(`📊 [${timestamp}] Comprehensive Stats Received:`);
      console.log(`   📅 Date: ${data.date}`);
      console.log(`   💰 Daily Payout: ${formatCurrency(data.payouts.daily_total)}`);
      console.log(`   💎 All-Time Payout: ${formatCurrency(data.payouts.all_time_total)}`);
      break;
    case 'daily_report':
      console.log(`📋 [${timestamp}] Daily Report Received:`);
      console.log(`   📅 Date: ${data.date}`);
      console.log(`   💰 Daily Total: ${formatCurrency(data.daily_payout_total)}`);
      console.log(`   ⏳ Pending: ${data.daily_cancellations.pending}`);
      console.log(`   ✅ Approved: ${data.daily_cancellations.approved}`);
      console.log(`   ❌ Denied: ${data.daily_cancellations.denied}`);
      console.log(`   📋 Pending Tickets: ${data.pending_cancellations.length}`);
      break;
    case 'historical_data':
      console.log(`📚 [${timestamp}] Historical Data Received:`);
      console.log(`   📜 Total Cancellations: ${data.cancellations.length}`);
      console.log(`   💰 Total Payouts: ${data.payouts.length}`);
      break;
    default:
      console.log(`✅ [${timestamp}] Received: ${action}`);
  }
}

// POST Handler
async function handlePost(req, res) {
  try {
    const payload = req.body;

    if (payload.auth_token !== VALID_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const validation = validatePayload(payload);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Retrieve existing store or initialize
    let dataStore = (await kv.get('webhook_data')) || {
      comprehensive_stats: null,
      daily_report: null,
      historical_data: null,
      metadata: { last_updated: null, update_count: 0, first_sync: null }
    };

    const now = new Date().toISOString();
    if (!dataStore.metadata.first_sync) dataStore.metadata.first_sync = now;
    dataStore.metadata.last_updated = now;
    dataStore.metadata.update_count++;

    // Store the payload
    dataStore[payload.action] = {
      data: payload.data,
      received_at: now,
      python_timestamp: payload.timestamp
    };

    // Save to Vercel KV
    await kv.set('webhook_data', JSON.stringify(dataStore));

    // Log summary
    logDataSummary(payload.action, payload.data);

    return res.status(200).json({
      success: true,
      action: payload.action,
      received_at: now,
      update_count: dataStore.metadata.update_count
    });

  } catch (err) {
    console.error('❌ Error processing webhook:', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
}

// GET Handler
async function handleGet(req, res) {
  try {
    const { auth_token, type } = req.query;
    const authHeader = req.headers.authorization?.replace('Bearer ', '');

    if (authHeader !== VALID_TOKEN && auth_token !== VALID_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const rawStore = await kv.get('webhook_data');
    if (!rawStore) return res.status(404).json({ message: 'No data available yet. Waiting for first sync.' });

    const dataStore = JSON.parse(rawStore);

    if (type) {
      const requestedData = dataStore[type];
      if (!requestedData) {
        return res.status(404).json({
          error: `No data available for type: ${type}`,
          available_types: Object.keys(dataStore).filter(k => k !== 'metadata' && dataStore[k])
        });
      }
      return res.status(200).json({ action: type, ...requestedData, metadata: dataStore.metadata });
    }

    // Return summary
    let latestType = null;
    let latestTime = null;

    ['comprehensive_stats', 'daily_report', 'historical_data'].forEach(t => {
      if (dataStore[t]) {
        const time = new Date(dataStore[t].received_at);
        if (!latestTime || time > latestTime) {
          latestTime = time;
          latestType = t;
        }
      }
    });

    return res.status(200).json({
      metadata: dataStore.metadata,
      available_data: {
        comprehensive_stats: !!dataStore.comprehensive_stats,
        daily_report: !!dataStore.daily_report,
        historical_data: !!dataStore.historical_data
      },
      latest_update: latestType ? {
        type: latestType,
        received_at: dataStore[latestType].received_at,
        data: dataStore[latestType].data
      } : null
    });

  } catch (err) {
    console.error('❌ Error retrieving data:', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
}

// Main handler
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'POST') return handlePost(req, res);
  if (req.method === 'GET') return handleGet(req, res);
  return res.status(405).json({ error: 'Method not allowed' });
}
