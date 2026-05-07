import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/db/supabase';
import { serializePlace, placeToDbUpdate, DbPlaceRow } from '@/lib/db/serializers';
import { requireAdmin } from '@/lib/auth/admin';

export const dynamic = 'force-dynamic';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from('places')
    .select('*')
    .eq('id', params.id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(serializePlace(data as DbPlaceRow));
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const body = await req.json();
  const updates = placeToDbUpdate(body);

  const { data, error } = await supabase
    .from('places')
    .update(updates)
    .eq('id', params.id)
    .select('*')
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(serializePlace(data as DbPlaceRow));
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { error } = await supabase.from('places').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
