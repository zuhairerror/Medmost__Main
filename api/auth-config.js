/**
 * MEDMOST - Serverless Endpoint for Public Supabase Auth Configuration
 * Exposes ONLY the public project URL and public publishable/anon key.
 * Strictly cleans and normalizes the URL to origin-only (stripping /rest/v1).
 * Never exposes service_role key or database secrets!
 */

const DEFAULT_SUPABASE_URL = 'https://kpzgkhicelbfjuairebt.supabase.co';
const DEFAULT_ANON_KEY = '';

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

module.exports = async function handler(req, res) {
  // CORS configuration that complies with strict browser security
  const origin = req.headers && req.headers.origin ? req.headers.origin : '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  const supabaseUrl = cleanSupabaseUrl(process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL);
  const supabaseAnonKey = cleanApiKey(process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY);

  return res.status(200).json({
    supabaseUrl: supabaseUrl,
    supabaseAnonKey: supabaseAnonKey,
    configured: Boolean(supabaseAnonKey && supabaseAnonKey.length > 20)
  });
};
