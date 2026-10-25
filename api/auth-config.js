/**
 * MEDMOST - Serverless Endpoint for Public Supabase Auth Configuration
 * Exposes ONLY the public project URL and public publishable/anon key.
 * Strictly cleans and normalizes the URL to origin-only (stripping /rest/v1).
 * Never exposes service_role key or database secrets!
 */

const DEFAULT_SUPABASE_URL = 'https://kpzgkhicelbfjuairebt.supabase.co';
const DEFAULT_ANON_KEY = '';

// In-memory sliding window rate limiter
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60;

function checkRateLimit(ip) {
  const now = Date.now();
  const clientData = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + RATE_LIMIT_WINDOW_MS;
  } else {
    clientData.count += 1;
  }
  rateLimitMap.set(ip, clientData);

  // Prune map if too large
  if (rateLimitMap.size > 5000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetTime) rateLimitMap.delete(key);
    }
  }

  return clientData.count <= MAX_REQUESTS_PER_WINDOW;
}

/**
 * Normalizes the Supabase URL to ensure it is the clean origin ending in .supabase.co
 * and removes any accidental path segments (such as /rest/v1 or trailing slashes)
 * that cause PostgREST PGRST125 ("Invalid path specified in request URL") errors.
 */
function cleanSupabaseUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return DEFAULT_SUPABASE_URL;
  let url = rawUrl.trim().replace(/^["']|["']$/g, '');
  if (!url) return DEFAULT_SUPABASE_URL;

  // Auto-correct common transposition typo (kpzghk -> kpzgkh)
  url = url.replace('kpzghkicelbfjuairebt', 'kpzgkhicelbfjuairebt');

  // Add protocol if missing
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  try {
    const parsed = new URL(url);
    // Project URL must only be origin (https://xyz.supabase.co), without /rest/v1 or paths
    return parsed.origin;
  } catch (e) {
    return url.replace(/\/rest\/v1\/?.*$/i, '').replace(/\/auth\/v1\/?.*$/i, '').replace(/\/+$/, '');
  }
}

function cleanApiKey(rawKey) {
  if (!rawKey || typeof rawKey !== 'string') return DEFAULT_ANON_KEY;
  const cleaned = rawKey.trim().replace(/^["']|["']$/g, '');
  return cleaned || DEFAULT_ANON_KEY;
}

function isOriginAllowed(origin) {
  if (!origin) return true; // Direct/same-origin navigation
  const allowed = [
    'https://www.medmost.in',
    'https://medmost.in'
  ];
  if (allowed.includes(origin)) return true;
  // Allow Vercel preview deploys
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) return true;
  // Allow local development
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) return true;
  return false;
}

module.exports = async function handler(req, res) {
  const reqOrigin = req.headers && req.headers.origin ? req.headers.origin : '';
  const originHeader = isOriginAllowed(reqOrigin) ? (reqOrigin || 'https://www.medmost.in') : 'https://www.medmost.in';

  res.setHeader('Access-Control-Allow-Origin', originHeader);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  // Rate limiting by client IP
  const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown')
    .split(',')[0].trim();
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
  }

  const supabaseUrl = cleanSupabaseUrl(process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL);
  const supabaseAnonKey = cleanApiKey(process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY);
  const siteUrl = (process.env.SITE_URL || 'https://www.medmost.in').replace(/\/+$/, '');

  return res.status(200).json({
    supabaseUrl: supabaseUrl,
    supabaseAnonKey: supabaseAnonKey,
    siteUrl: siteUrl,
    configured: Boolean(supabaseAnonKey && supabaseAnonKey.length > 20)
  });
};
