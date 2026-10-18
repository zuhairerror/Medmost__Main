/**
 * MEDMOST - Supabase Client & Authentication Integration
 * Fully integrated with Supabase Auth, Row Level Security, and Consultations.
 */

(function(window) {
  // Default project credentials (can be overridden by window.__MEDMOST_SUPABASE_KEY__ or localStorage)
  const DEFAULT_URL = 'https://kpzgkhicelbfjuairebt.supabase.co';
  const DEFAULT_ANON_KEY = 'YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY';

  const config = {
    url: (window.__MEDMOST_SUPABASE_URL__ || localStorage.getItem('MEDMOST_SUPABASE_URL') || DEFAULT_URL).trim(),
    key: (window.__MEDMOST_SUPABASE_KEY__ || localStorage.getItem('MEDMOST_SUPABASE_KEY') || DEFAULT_ANON_KEY).trim()
  };

  function isKeyConfigured(k) {
    return Boolean(k && typeof k === 'string' && !k.startsWith('YOUR_') && k.length > 20);
  }

  // Initialize official Supabase client if SDK is loaded and key is set
  let supabaseClient = null;
  try {
    if (window.supabase && typeof window.supabase.createClient === 'function' && isKeyConfigured(config.key)) {
      supabaseClient = window.supabase.createClient(config.url, config.key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
      console.log('✅ [MEDMOST] Supabase client initialized successfully:', config.url);
    } else if (!isKeyConfigured(config.key)) {
      console.info('ℹ️ [MEDMOST] Supabase client awaiting Publishable / Anon Key in js/supabase-client.js.');
    }
  } catch (err) {
    console.error('❌ [MEDMOST] Error initializing Supabase client:', err);
  }

  function getClient() {
    if (!supabaseClient && window.supabase && typeof window.supabase.createClient === 'function' && isKeyConfigured(config.key)) {
      try {
        supabaseClient = window.supabase.createClient(config.url, config.key, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        });
      } catch (e) {
        console.error('❌ [MEDMOST] getClient initialization error:', e);
      }
    }
    return supabaseClient;
  }

  const MedMostBackend = {
    getConfig: function() {
      return {
        url: config.url,
        hasKey: Boolean(config.key),
        isProductionReady: Boolean(config.url && config.key)
      };
    },

    getClient: getClient,

    // ========================================================================
    // AUTHENTICATION METHODS
    // ========================================================================

    /**
     * Sign up a new patient with email, password, and optional full name.
     */
    signUp: async function(email, password, fullName) {
      const client = getClient();
      if (!client) {
        throw new Error('Supabase SDK not loaded. Please check your internet connection.');
      }

      const { data, error } = await client.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: (fullName || '').trim()
          }
        }
      });

      if (error) throw error;
      return data;
    },

    /**
     * Log in an existing patient with email and password.
     */
    signIn: async function(email, password) {
      const client = getClient();
      if (!client) {
        throw new Error('Supabase SDK not loaded. Please check your internet connection.');
      }

      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) throw error;
      return data;
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
     * Send password reset email
     */
    resetPassword: async function(email) {
      const client = getClient();
      if (!client) throw new Error('Supabase client unavailable.');
      const { data, error } = await client.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin
      });
      if (error) throw error;
      return data;
    },

    /**
     * Get the currently logged in user (from session or cached state)
     */
    getCurrentUser: async function() {
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
      const client = getClient();
      if (!client) return { unsubscribe: function() {} };
      const { data: { subscription } } = client.auth.onAuthStateChange(function(event, session) {
        if (session && session.user) {
          localStorage.setItem('medmost_current_user', JSON.stringify(session.user));
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('medmost_current_user');
        }
        if (typeof callback === 'function') {
          callback(event, session);
        }
      });
      return subscription;
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

      // 3. Always store in local storage for zero data loss & offline review
      try {
        const existing = JSON.parse(localStorage.getItem('medmost_enquiries') || '[]');
        existing.unshift(payload);
        localStorage.setItem('medmost_enquiries', JSON.stringify(existing));
      } catch (storageErr) {
        console.error('LocalStorage error:', storageErr);
      }

      return {
        success: true,
        referenceId: referenceId,
        serverSynced: serverSuccess,
        data: payload
      };
    },

    /**
     * Retrieve consultations for the current user (from Supabase or local storage)
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
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && Array.isArray(data) && data.length > 0) {
            consultations = data;
          }
        } catch (e) {
          console.warn('Supabase query note:', e);
        }
      }

      // Merge with local enquiries for complete continuity
      try {
        const local = JSON.parse(localStorage.getItem('medmost_enquiries') || '[]');
        if (user && user.email) {
          const matchedLocal = local.filter(l => l.email && l.email.toLowerCase() === user.email.toLowerCase());
          matchedLocal.forEach(item => {
            if (!consultations.some(c => c.reference_id === item.reference_id || (c.created_at && c.created_at === item.created_at))) {
              consultations.push(item);
            }
          });
        } else if (consultations.length === 0) {
          consultations = local;
        }
      } catch (e) {}

      return consultations;
    }
  };

  window.MedMostBackend = MedMostBackend;
})(window);
