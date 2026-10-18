/**
 * MEDMOST - Node.js Serverless API Endpoint for Supabase
 * Runtime: Node.js (Vercel Serverless Function)
 * Route: /api/consultation
 */

const { createClient } = require('@supabase/supabase-js');

// Default project URL from user's Supabase dashboard
const DEFAULT_SUPABASE_URL = 'https://kpzgkhicelbfjuairebt.supabase.co';

/**
 * Normalizes and validates the Supabase Project URL.
 * Ensures it is the base origin ending in .supabase.co (e.g. https://xyz.supabase.co)
 * and strips any accidentally included path segments (such as /rest/v1 or trailing slashes)
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
    // Project URL must only be protocol + host (origin), without /rest/v1 path
    return parsed.origin;
  } catch (e) {
    return url.replace(/\/rest\/v1\/?.*$/i, '').replace(/\/+$/, '');
  }
}

/**
 * Cleans and trims the Supabase API Key, removing accidental quotes or spaces
 */
function cleanApiKey(rawKey) {
  if (!rawKey || typeof rawKey !== 'string') return '';
  return rawKey.trim().replace(/^["']|["']$/g, '');
}

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Health check on GET
  if (req.method === 'GET') {
    const activeUrl = cleanSupabaseUrl(process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL);
    return res.status(200).json({
      status: 'online',
      service: 'MEDMOST Node.js Supabase API',
      configuredProjectUrl: activeUrl,
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    // Parse body safely whether parsed by Vercel or raw string
    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (parseErr) {
        payload = {};
      }
    }
    payload = payload || {};

    const {
      full_name,
      country,
      phone,
      email,
      treatment,
      city,
      message,
      source
    } = payload;

    const patientName = (full_name || payload.name || '').toString().trim();
    const patientPhone = (phone || '').toString().trim();

    // Basic validation
    if (!patientName || !patientPhone) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name and phone are mandatory.'
      });
    }

    // Clean and validate Supabase URL & Key
    const supabaseUrl = cleanSupabaseUrl(process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL);
    // Prioritize SUPABASE_SERVICE_ROLE_KEY (server-side only on Vercel, safely bypasses RLS)
    // Fall back to SUPABASE_ANON_KEY (evaluated against the narrow INSERT RLS policy)
    const supabaseKey = cleanApiKey(
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.SUPABASE_KEY
    );

    // Check if Supabase key is configured in Vercel
    if (!supabaseKey) {
      console.warn('SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY environment variable is not configured yet in Vercel.');
      return res.status(200).json({
        success: true,
        referenceId: 'DEMO-' + Math.floor(100000 + Math.random() * 900000),
        message: 'Enquiry received in Node.js backend. (Configure Supabase keys in Vercel to save to live database)',
        data: { name: patientName, phone: patientPhone, treatment, country }
      });
    }

    // Initialize Supabase Client with normalized base URL
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });

    // Compile clinical details (treatment, preferred city, source) into the message column
    // so no submitted patient detail is lost while strictly matching existing database columns
    const messageParts = [];
    if (treatment && treatment.toString().trim()) {
      messageParts.push(`Treatment: ${treatment.toString().trim()}`);
    }
    if (city && city.toString().trim() && city.toString().trim().toLowerCase() !== 'unspecified') {
      messageParts.push(`Preferred City: ${city.toString().trim()}`);
    }
    if (source && source.toString().trim() && source.toString().trim().toLowerCase() !== 'website') {
      messageParts.push(`Lead Source: ${source.toString().trim()}`);
    }
    if (message && message.toString().trim()) {
      messageParts.push(`Notes: ${message.toString().trim()}`);
    }

    const compiledMessage = messageParts.length > 0 
      ? messageParts.join(' | ') 
      : ((message && message.toString().trim()) || 'Website consultation enquiry');

    // Construct consultation record matching the existing public.consultations table:
    // Columns: name, email, phone, country, message (id and created_at are generated by DB)
    // NOTE: Non-existent columns (city, treatment, source, status) are omitted to avoid PGRST204 errors.
    const consultationRecord = {
      name: patientName,
      email: (email || '').toString().trim() || 'not-provided@medmost.org',
      phone: patientPhone,
      country: (country || '').toString().trim() || 'Unspecified',
      message: compiledMessage
    };

    // Insert consultation record into public.consultations table
    // NOTE: We intentionally omit .select()!
    // Chaining .select() sends "Prefer: return=representation", which requires a SELECT RLS policy.
    // For anonymous consultation submissions, public SELECT is forbidden to protect patient privacy.
    // Without .select(), Supabase performs a minimal return ("return=minimal"), requiring ONLY the INSERT RLS policy.
    let { error } = await supabase
      .from('consultations')
      .insert([consultationRecord]);

    // Fallback: If 'name' is reported missing in the schema cache, retry once with 'full_name'
    if (error && error.code === 'PGRST204' && typeof error.message === 'string' && error.message.includes("'name'")) {
      const fallbackRecord = {
        full_name: patientName,
        email: consultationRecord.email,
        phone: consultationRecord.phone,
        country: consultationRecord.country,
        message: consultationRecord.message
      };
      const retryResult = await supabase
        .from('consultations')
        .insert([fallbackRecord]);
      if (!retryResult.error) {
        error = null;
      } else {
        error = retryResult.error;
      }
    }

    if (error) {
      console.error('Supabase insert error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });

      return res.status(500).json({
        success: false,
        code: error.code || 'PGRST_ERROR',
        error: error.message,
        details: error.details || null,
        hint: error.hint || 'Verify table exists in Supabase public schema and RLS INSERT policy is configured.'
      });
    }

    const referenceId = 'MED-' + Date.now().toString().slice(-6);

    return res.status(200).json({
      success: true,
      referenceId: referenceId,
      message: 'Consultation enquiry saved successfully to Supabase database!',
      record: consultationRecord
    });
  } catch (err) {
    console.error('Unexpected server error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
};
