import { createClient } from '@supabase/supabase-js';

// Dev-only TLS workaround for environments with HTTPS interception / missing root CAs.
// Enable with SUPABASE_DISABLE_TLS_VERIFY=true (NEVER use in production).
if (
  process.env.NODE_ENV !== 'production' &&
  process.env.SUPABASE_DISABLE_TLS_VERIFY === 'true'
) {
  // eslint-disable-next-line no-process-env
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  console.warn(
    'SUPABASE_DISABLE_TLS_VERIFY=true: TLS certificate verification is DISABLED for this dev process.'
  );
}

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Allow build to proceed without credentials (will fail at runtime if accessed)
  console.warn(
    'Missing Supabase environment variables. Database operations will not work.'
  );
}

// Create a single supabase client for interacting with your database
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Server-side client with service role key (for admin operations)
export function createServerClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables for server client');
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
