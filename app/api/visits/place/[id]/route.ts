import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/db/supabase';

export const dynamic = 'force-dynamic';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  await supabase.from('visits').insert({ place_id: params.id });
  const { count } = await supabase
    .from('visits')
    .select('*', { count: 'exact', head: true })
    .eq('place_id', params.id);
  return NextResponse.json({ ok: true, count: count ?? 0 });
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { count } = await supabase
    .from('visits')
    .select('*', { count: 'exact', head: true })
    .eq('place_id', params.id);
  return NextResponse.json({ count: count ?? 0 });
}
