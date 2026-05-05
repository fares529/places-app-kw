import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

function buildClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel project settings → Environment Variables.'
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

// Lazy proxy: only initialize on first use, so build-time evaluation
// (which has no env vars) doesn't crash module-loading phase.
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!client) client = buildClient();
    return Reflect.get(client, prop, client);
  },
});
