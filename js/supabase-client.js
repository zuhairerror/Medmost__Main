/**
 * MEDMOST - Supabase Client & Authentication Integration
 * Fully integrated with Supabase Auth, Row Level Security, and Consultations.
 */

(function(window) {
  // Default project credentials (can be overridden by /api/auth-config, window.__MEDMOST_SUPABASE_KEY__, or localStorage)
  const DEFAULT_URL = 'https://kpzgkhicelbfjuairebt.supabase.co';
  const DEFAULT_ANON_KEY = 'YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY';

  function isTrustedSupabaseUrl(urlStr) {
    if (!urlStr || typeof urlStr !== 'string') return false;
    try {
      const u = new URL(urlStr);
      return (u.protocol === 'https:' || u.protocol === 'http:') &&
        (u.hostname.endsWith('.supabase.co') || u.hostname === 'localhost' || u.hostname === '127.0.0.1');
    } catch (e) {
      return false;
    }
  }

  function normalizeUrl(rawUrl) {
    if (!rawUrl || typeof rawUrl !== 'string') return DEFAULT_URL;
    let url = rawUrl.trim().replace(/^["']|["']$/g, '');
    if (!url) return DEFAULT_URL;
    // Auto-correct common transposition typo (kpzghk -> kpzgkh)
    url = url.replace('kpzghkicelbfjuairebt', 'kpzgkhicelbfjuairebt');
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    try {
      const parsed = new URL(url);
      const origin = parsed.origin;
      return isTrustedSupabaseUrl(origin) ? origin : DEFAULT_URL;
    } catch (e) {
      return DEFAULT_URL;
    }
  }

  // Canonical live production site URL to prevent redirects falling back to localhost:3000
  const PRODUCTION_SITE_URL = 'https://www.medmost.in';

  /**
   * Resolves the production-ready redirect URL for email verification and password reset.
   * If running on live custom domain (www.medmost.in, medmost.in, or vercel.app), uses current window.location.origin.
   * If running locally or on file://, defaults to https://www.medmost.in so emails
   * sent to real users never redirect to http://localhost:3000.
   */
  function getAuthRedirectUrl(path = '') {
    let base = PRODUCTION_SITE_URL;
    if (typeof window !== 'undefined' && window.location) {
      const origin = window.location.origin;
      if (origin && origin.startsWith('http') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        base = origin;
      }
    }
    const cleanBase = base.replace(/\/+$/, '');
    const cleanPath = path ? '/' + path.replace(/^\/+/, '') : '';
    return cleanBase + cleanPath;
  }

  // Clear any corrupted localStorage entry from prior runs
  try {
    const cachedUrl = localStorage.getItem('MEDMOST_SUPABASE_URL');
    if (cachedUrl && cachedUrl.includes('kpzghk')) {
      localStorage.removeItem('MEDMOST_SUPABASE_URL');
    }
  } catch (e) {}

  const config = {
    url: normalizeUrl(window.__MEDMOST_SUPABASE_URL__ || localStorage.getItem('MEDMOST_SUPABASE_URL') || DEFAULT_URL),
    key: (window.__MEDMOST_SUPABASE_KEY__ || localStorage.getItem('MEDMOST_SUPABASE_KEY') || DEFAULT_ANON_KEY).trim()
  };

  function isKeyConfigured(k) {
    return Boolean(k && typeof k === 'string' && !k.startsWith('YOUR_') && k.length > 20);
  }

  let supabaseClient = null;

  function initSupabaseClient() {
    if (window.supabase && typeof window.supabase.createClient === 'function' && isKeyConfigured(config.key)) {
      try {
        supabaseClient = window.supabase.createClient(config.url, config.key, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        });
        console.log('✅ [MEDMOST] Supabase client initialized:', config.url);
        window.dispatchEvent(new CustomEvent('medmost:supabase-ready', {
          detail: { url: config.url, configured: true }
        }));
      } catch (err) {
        console.error('❌ [MEDMOST] Error initializing Supabase client:', err);
      }
    } else if (!isKeyConfigured(config.key)) {
      console.info('ℹ️ [MEDMOST] Supabase client awaiting Publishable / Anon Key from server environment or js/supabase-client.js.');
    }
  }

  // Auto-fetch public configuration from server environment variables (/api/auth-config)
  let configPromise = null;
  async function fetchServerConfig() {
    if (typeof window === 'undefined' || !window.location) return;
    if (window.location.protocol !== 'http:' && window.location.protocol !== 'https:') return;

    try {
      const res = await fetch('/api/auth-config', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        let updated = false;
        if (data.supabaseUrl && typeof data.supabaseUrl === 'string') {
          const cleanUrl = normalizeUrl(data.supabaseUrl);
          if (cleanUrl !== config.url) {
            config.url = cleanUrl;
            updated = true;
          }
        }
        if (data.supabaseAnonKey && isKeyConfigured(data.supabaseAnonKey) && data.supabaseAnonKey.trim() !== config.key) {
          config.key = data.supabaseAnonKey.trim();
          updated = true;
        }
        if (updated || (!supabaseClient && isKeyConfigured(config.key))) {
          initSupabaseClient();
        }
      }
    } catch (e) {
      // Quiet fallback when running offline or without serverless runtime
    }
  }

  configPromise = fetchServerConfig();

  // Try initial synchronous initialization if key is already locally available
  initSupabaseClient();

  function getClient() {
    if (!supabaseClient && window.supabase && typeof window.supabase.createClient === 'function' && isKeyConfigured(config.key)) {
      initSupabaseClient();
    }
    return supabaseClient;
  }

  const MedMostBackend = {
    getConfig: function() {
      return {
        url: config.url,
        hasKey: isKeyConfigured(config.key),
        isProductionReady: Boolean(config.url && isKeyConfigured(config.key))
      };
    },

    getClient: getClient,

    setCredentials: function(newUrl, newKey) {
      if (newUrl && typeof newUrl === 'string') {
        const normalized = normalizeUrl(newUrl);
        if (isTrustedSupabaseUrl(normalized)) {
          config.url = normalized;
          try { localStorage.setItem('MEDMOST_SUPABASE_URL', config.url); } catch (e) {}
        }
      }
      if (newKey && typeof newKey === 'string' && isKeyConfigured(newKey)) {
        config.key = newKey.trim();
        try { localStorage.setItem('MEDMOST_SUPABASE_KEY', config.key); } catch (e) {}
      }
      initSupabaseClient();
      return this.getConfig();
    },

    ready: async function() {
      if (configPromise) await configPromise;
      return getClient();
    },

    // ========================================================================
    // AUTHENTICATION METHODS
    // ========================================================================

    /**
     * Sign up a new patient with email, password, and optional full name.
     */
    signUp: async function(email, password, fullName) {
      if (configPromise) await configPromise;
      const client = getClient();
      if (!client) {
        throw new Error('Supabase publishable key is not configured yet. Please configure SUPABASE_ANON_KEY in your server environment variables or in js/supabase-client.js (line 9).');
      }

      const redirectUrl = getAuthRedirectUrl();

      try {
        const { data, error } = await client.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: (fullName || '').trim()
            }
          }
        });

        if (error) throw error;
        return data;
      } catch (err) {
        if (err.message && err.message.toLowerCase().includes('failed to fetch')) {
          console.error('Network fetch error contacting Supabase URL:', config.url, err);
          throw new Error(`Failed to fetch: Cannot reach Supabase at ${config.url}. Please ensure your Vercel SUPABASE_URL environment variable is set to https://kpzgkhicelbfjuairebt.supabase.co and that your anon key is valid.`);
        }
        throw err;
      }
    },

    /**
     * Log in an existing patient with email and password.
     */
    signIn: async function(email, password) {
      if (configPromise) await configPromise;
      const client = getClient();
      if (!client) {
        throw new Error('Supabase publishable key is not configured yet. Please configure SUPABASE_ANON_KEY in your server environment variables or in js/supabase-client.js (line 9).');
      }

      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: email.trim(),
          password: password
        });

        if (error) throw error;
        return data;
      } catch (err) {
        if (err.message && err.message.toLowerCase().includes('failed to fetch')) {
          console.error('Network fetch error contacting Supabase URL:', config.url, err);
          throw new Error(`Failed to fetch: Cannot reach Supabase at ${config.url}. Please ensure your Vercel SUPABASE_URL environment variable is set to https://kpzgkhicelbfjuairebt.supabase.co and that your anon key is valid.`);
        }
        throw err;
      }
    },

    /**
     * Log out current user and clear local session state.
     */
    signOut: async function() {
      const client = getClient();
      if (client) {
        try {
          await client.auth.signOut();
        } catch (e) {
          console.warn('Supabase signOut warning:', e);
        }
      }
      localStorage.removeItem('medmost_current_user');
      return { success: true };
    },

    /**
     * Send password reset email with production redirect URL
     */
    resetPassword: async function(email, customRedirectUrl) {
      if (configPromise) await configPromise;
      const client = getClient();
      if (!client) throw new Error('Supabase client unavailable.');
      // Point directly to dedicated recovery page on production domain https://www.medmost.in/reset-password.html
      const redirectUrl = customRedirectUrl || getAuthRedirectUrl('reset-password.html');
      console.log('Sending password reset email with redirectTo:', redirectUrl);
      const { data, error } = await client.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl
      });
      if (error) throw error;
      return data;
    },

    /**
     * Update current user's password (used in password recovery flow)
     */
    updatePassword: async function(newPassword) {
      if (configPromise) await configPromise;
      const client = getClient();
      if (!client) throw new Error('Supabase client unavailable.');
      const { data, error } = await client.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      return data;
    },

    /**
     * Returns the active production redirect URL
     */
    getRedirectUrl: function(path = '') {
      return getAuthRedirectUrl(path);
    },

    /**
     * Get the currently logged in user (from session or cached state)
     */
    getCurrentUser: async function() {
      if (configPromise) await configPromise;
      const client = getClient();
      if (!client) {
        const cached = localStorage.getItem('medmost_current_user');
        return cached ? JSON.parse(cached) : null;
      }

      try {
        const { data: { session } } = await client.auth.getSession();
        if (session && session.user) {
          localStorage.setItem('medmost_current_user', JSON.stringify(session.user));
          return session.user;
        }
      } catch (e) {
        console.warn('Error reading session:', e);
      }
      return null;
    },

    /**
     * Listen for authentication state changes (SIGNED_IN, SIGNED_OUT, etc.)
     */
    onAuthStateChange: function(callback) {
      let sub = null;
      const attach = function(c) {
        if (!c || sub) return;
        const res = c.auth.onAuthStateChange(function(event, session) {
          if (session && session.user) {
            localStorage.setItem('medmost_current_user', JSON.stringify(session.user));
          } else if (event === 'SIGNED_OUT') {
            localStorage.removeItem('medmost_current_user');
          }
          if (typeof callback === 'function') {
            callback(event, session);
          }
        });
        sub = res.data ? res.data.subscription : res;
      };

      const directClient = getClient();
      if (directClient) {
        attach(directClient);
      } else if (configPromise) {
        configPromise.then(() => {
          attach(getClient());
        });
      }

      window.addEventListener('medmost:supabase-ready', () => {
        attach(getClient());
      });

      return {
        unsubscribe: function() {
          if (sub && typeof sub.unsubscribe === 'function') {
            sub.unsubscribe();
          }
        }
      };
    },

    // ========================================================================
    // CONSULTATION / ENQUIRY METHODS
    // ========================================================================

    /**
     * Submit a consultation / enquiry.
     * Links authenticated user's ID and email, saves to Supabase and local cache.
     */
    submitEnquiry: async function(enquiryData) {
      const referenceId = 'MM-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
      const user = await this.getCurrentUser();

      const payload = {
        reference_id: referenceId,
        created_at: new Date().toISOString(),
        name: enquiryData.name || '',
        email: enquiryData.email || '',
        phone: enquiryData.phone || '',
        country: enquiryData.country || '',
        treatment: enquiryData.treatment || 'General Medical Inquiry',
        hospital: enquiryData.hospital || 'Any Recommended Hospital',
        message: enquiryData.message || '',
        consent: Boolean(enquiryData.consent),
        documents: enquiryData.documents || [],
        status: 'pending_review',
        user_id: user ? user.id : null
      };

      let serverSuccess = false;
      const client = getClient();

      // 1. If Supabase client is available, insert into public.consultations table
      if (client) {
        try {
          const { data, error } = await client
            .from('consultations')
            .insert([{
              name: payload.name,
              email: payload.email,
              phone: payload.phone,
              country: payload.country,
              message: `[Ref: ${referenceId}] [Treatment: ${payload.treatment}] [Hospital: ${payload.hospital}] ${payload.message}`.trim(),
              user_id: payload.user_id
            }]);

          if (!error) {
            serverSuccess = true;
            payload.status = 'synced_to_supabase';
            console.log('✅ Consultation saved directly to Supabase table:', referenceId);
          } else {
            console.warn('Supabase table insert notice (RLS policy check):', error.message);
          }
        } catch (dbErr) {
          console.warn('Direct Supabase insert attempt note:', dbErr);
        }
      }

      // 2. Try serverless endpoint (/api/consultation) if deployed
      if (!serverSuccess) {
        try {
          const response = await fetch('/api/consultation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (response.ok) {
            serverSuccess = true;
            payload.status = 'synced_to_server';
          }
        } catch (err) {
          // Normal when running locally as file://
        }
      }

      // 3. Store minimal non-sensitive reference metadata locally (NO confidential medical notes, phone numbers, or uploaded reports)
      try {
        const existing = JSON.parse(localStorage.getItem('medmost_enquiries') || '[]');
        const safeRecord = {
          reference_id: referenceId,
          created_at: payload.created_at,
          treatment: payload.treatment || 'Medical Consultation',
          hospital: payload.hospital || 'Top Accredited Hospital',
          status: payload.status
        };
        existing.unshift(safeRecord);
        // Keep at most 20 recent references
        if (existing.length > 20) existing.length = 20;
        localStorage.setItem('medmost_enquiries', JSON.stringify(existing));
      } catch (storageErr) {
        console.error('LocalStorage notice:', storageErr);
      }

      return {
        success: true,
        referenceId: referenceId,
        serverSynced: serverSuccess,
        data: {
          reference_id: referenceId,
          created_at: payload.created_at,
          treatment: payload.treatment,
          hospital: payload.hospital,
          status: payload.status
        }
      };
    },

    /**
     * Retrieve consultations for the current user (from Supabase or local reference tracking)
     */
    getUserConsultations: async function() {
      const user = await this.getCurrentUser();
      const client = getClient();
      let consultations = [];

      if (client && user) {
        try {
          // Select user's own consultations via Supabase RLS
          const { data, error } = await client
            .from('consultations')
            .select('id, created_at, name, country, message, user_id')
            .order('created_at', { ascending: false });

          if (!error && Array.isArray(data) && data.length > 0) {
            consultations = data;
          }
        } catch (e) {
          console.warn('Supabase query note:', e);
        }
      }

      // If database consultations are loaded, prioritize them
      if (consultations.length > 0) {
        return consultations;
      }

      // Otherwise fall back to local non-sensitive reference records
      try {
        const local = JSON.parse(localStorage.getItem('medmost_enquiries') || '[]');
        return Array.isArray(local) ? local : [];
      } catch (e) {
        return [];
      }
    }
  };

  window.MedMostBackend = MedMostBackend;
})(window);
