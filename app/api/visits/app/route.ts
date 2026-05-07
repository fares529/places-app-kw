import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/db/supabase';

export const dynamic = 'force-dynamic';

export async function POST() {
  await supabase.from('app_visits').insert({});
  const { count } = await supabase
    .from('app_visits')
    .select('*', { count: 'exact', head: true });
  return NextResponse.json({ ok: true, count: count ?? 0 });
}

export async function GET() {
  const { count } = await supabase
    .from('app_visits')
    .select('*', { count: 'exact', head: true });
  return NextResponse.json({ count: count ?? 0 });
}
