/**
 * MEDMOST - Node.js Serverless API Endpoint for Supabase
 * Runtime: Node.js (Vercel Serverless Function)
 * Route: /api/consultation
 * Hardened with:
 * - Strict CORS whitelist
 * - IP Sliding-window Rate Limiting
 * - Bot honeypot protection
 * - Strict input validation & sanitization
 * - Safe generic error handling (no DB error disclosure)
 */

const { createClient } = require('@supabase/supabase-js');

const DEFAULT_SUPABASE_URL = 'https://kpzgkhicelbfjuairebt.supabase.co';

// In-memory sliding window rate limiter for submissions
const submissionRateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_SUBMISSIONS_PER_WINDOW = 6;

function checkSubmissionRateLimit(ip) {
  const now = Date.now();
  const clientData = submissionRateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + RATE_LIMIT_WINDOW_MS;
  } else {
    clientData.count += 1;
  }
  submissionRateLimitMap.set(ip, clientData);

  // Prune map if too large
  if (submissionRateLimitMap.size > 5000) {
    for (const [key, val] of submissionRateLimitMap.entries()) {
      if (now > val.resetTime) submissionRateLimitMap.delete(key);
    }
  }

  return clientData.count <= MAX_SUBMISSIONS_PER_WINDOW;
}

function cleanSupabaseUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return DEFAULT_SUPABASE_URL;
  let url = rawUrl.trim().replace(/^["']|["']$/g, '');
  if (!url) return DEFAULT_SUPABASE_URL;

  url = url.replace('kpzghkicelbfjuairebt', 'kpzgkhicelbfjuairebt');

  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  try {
    const parsed = new URL(url);
    return parsed.origin;
  } catch (e) {
    return url.replace(/\/rest\/v1\/?.*$/i, '').replace(/\/+$/, '');
  }
}

function cleanApiKey(rawKey) {
  if (!rawKey || typeof rawKey !== 'string') return '';
  return rawKey.trim().replace(/^["']|["']$/g, '');
}

function sanitizeText(str, maxLength = 200) {
  if (!str || typeof str !== 'string') return '';
  // Strip null bytes and non-printable control characters (except newline/tab)
  const cleaned = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
  return cleaned.slice(0, maxLength);
}

function isOriginAllowed(origin) {
  if (!origin) return true; // Same-origin request
  const allowed = [
    'https://www.medmost.in',
    'https://medmost.in'
  ];
  if (allowed.includes(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) return true;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) return true;
  return false;
}

module.exports = async function handler(req, res) {
  const reqOrigin = req.headers && req.headers.origin ? req.headers.origin : '';
  const originHeader = isOriginAllowed(reqOrigin) ? (reqOrigin || 'https://www.medmost.in') : 'https://www.medmost.in';

  res.setHeader('Access-Control-Allow-Origin', originHeader);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Requested-With');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Health check on GET
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'online',
      service: 'MEDMOST Node.js Consultation API',
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  // Extract client IP
  const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown')
    .split(',')[0].trim();

  // Rate Limiting
  if (!checkSubmissionRateLimit(clientIp)) {
    return res.status(429).json({
      success: false,
      error: 'Submission limit reached. Please wait a few minutes before submitting another consultation.'
    });
  }

  try {
    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (parseErr) {
        return res.status(400).json({ success: false, error: 'Invalid JSON payload format.' });
      }
    }
    payload = payload || {};

    // Anti-bot honeypot check (hidden fields that users will not fill)
    if (payload._hp || payload.website_hp || payload.company_hp) {
      console.warn(`[BOT DETECTED] Honeypot triggered from IP ${clientIp}`);
      // Silently return fake success so bots do not retry with alternate vectors
      return res.status(200).json({
        success: true,
        referenceId: 'MM-HP-' + Math.floor(100000 + Math.random() * 900000),
        message: 'Enquiry received.'
      });
    }

    const rawName = payload.full_name || payload.name || '';
    const rawPhone = payload.phone || '';
    const rawEmail = payload.email || '';
    const rawCountry = payload.country || '';
    const rawTreatment = payload.treatment || '';
    const rawCity = payload.city || '';
    const rawMessage = payload.message || '';
    const rawSource = payload.source || '';

    // Sanitize inputs
    const patientName = sanitizeText(rawName, 100);
    const patientPhone = sanitizeText(rawPhone, 30);
    const patientEmail = sanitizeText(rawEmail, 150);
    const patientCountry = sanitizeText(rawCountry, 80) || 'Unspecified';
    const patientTreatment = sanitizeText(rawTreatment, 120);
    const patientCity = sanitizeText(rawCity, 80);
    const patientMessage = sanitizeText(rawMessage, 2500);
    const patientSource = sanitizeText(rawSource, 60);

    // Validation
    if (!patientName || patientName.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid patient name (at least 2 characters).'
      });
    }

    // Phone validation (numbers, spaces, +, -, parentheses; between 6 and 25 characters)
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{5,20}$/;
    if (!patientPhone || !phoneRegex.test(patientPhone.replace(/\s+/g, ''))) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid contact telephone number.'
      });
    }

    // Email format validation if provided
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (patientEmail && !emailRegex.test(patientEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.'
      });
    }

    // Supabase credentials
    const supabaseUrl = cleanSupabaseUrl(process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL);
    const supabaseKey = cleanApiKey(
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.SUPABASE_KEY
    );

    if (!supabaseKey) {
      console.warn('SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY is not configured yet in Vercel.');
      return res.status(200).json({
        success: true,
        referenceId: 'DEMO-' + Math.floor(100000 + Math.random() * 900000),
        message: 'Enquiry received in Node.js backend. (Configure Supabase keys in Vercel to save to live database)'
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });

    const messageParts = [];
    if (patientTreatment) {
      messageParts.push(`Treatment: ${patientTreatment}`);
    }
    if (patientCity && patientCity.toLowerCase() !== 'unspecified') {
      messageParts.push(`Preferred City: ${patientCity}`);
    }
    if (patientSource && patientSource.toLowerCase() !== 'website') {
      messageParts.push(`Lead Source: ${patientSource}`);
    }
    if (patientMessage) {
      messageParts.push(`Notes: ${patientMessage}`);
    }

    const compiledMessage = messageParts.length > 0 
      ? messageParts.join(' | ') 
      : (patientMessage || 'Website consultation enquiry');

    const consultationRecord = {
      name: patientName,
      email: patientEmail || 'not-provided@medmost.org',
      phone: patientPhone,
      country: patientCountry,
      message: compiledMessage
    };

    let { error } = await supabase
      .from('consultations')
      .insert([consultationRecord]);

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
      error = retryResult.error;
    }

    if (error) {
      // Secure logging server-side; NEVER leak internal DB errors or hints to the client
      console.error('Supabase insert error details:', {
        code: error.code,
        message: error.message
      });

      return res.status(500).json({
        success: false,
        error: 'Unable to save consultation record. Please try again or reach out directly on WhatsApp.'
      });
    }

    const referenceId = 'MED-' + Date.now().toString().slice(-6);

    return res.status(200).json({
      success: true,
      referenceId: referenceId,
      message: 'Consultation enquiry saved successfully!'
    });
  } catch (err) {
    console.error('Unexpected server error processing consultation:', err);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred. Please try again later.'
    });
  }
};
