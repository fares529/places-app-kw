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
  // Prefer service_role (bypasses RLS), fall back to anon if not configured.
  // Anon still works because RLS policies allow operations from anon.
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Missing Supabase env vars');
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

/**
 * Public client — uses anon key.
 * Use for: reading places + categories, inserting visits + app_visits.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!publicClient) publicClient = buildPublic();
    return Reflect.get(publicClient, prop, publicClient);
  },
});

/**
 * Admin client — uses service_role if available (bypasses RLS),
 * else falls back to anon (relies on RLS policies allowing anon).
 * Use ONLY in server-side API routes.
 */
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!adminClient) adminClient = buildAdmin();
    return Reflect.get(adminClient, prop, adminClient);
  },
});
