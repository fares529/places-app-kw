import { createClient, SupabaseClient } from '@supabase/supabase-js';

let publicClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

function buildPublic(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

function buildAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY. Add it from Supabase Dashboard → Settings → API → service_role.'
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

/**
 * Public client — uses anon key, subject to RLS.
 * Use for: reading places + categories, inserting visits + app_visits.
 * SAFE TO EXPOSE in browser bundles.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!publicClient) publicClient = buildPublic();
    return Reflect.get(publicClient, prop, publicClient);
  },
});

/**
 * Admin client — uses service_role key, BYPASSES RLS.
 * Use ONLY in server-side API routes for: auth (otps/users), admin CRUD, stats.
 * NEVER import this in a client component or expose in browser code.
 */
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!adminClient) adminClient = buildAdmin();
    return Reflect.get(adminClient, prop, adminClient);
  },
});
