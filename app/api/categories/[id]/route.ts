import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/db/supabase';
import { serializeCategory, DbCategoryRow } from '@/lib/db/serializers';
import { requireAdmin } from '@/lib/auth/admin';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const body = await req.json();
  const updates: Record<string, unknown> = {};
  if (body.nameAr !== undefined) updates.name_ar = body.nameAr;
  if (body.nameEn !== undefined) updates.name_en = body.nameEn;
  if (body.icon !== undefined) updates.icon = body.icon;
  if (body.color !== undefined) updates.color = body.color;
  if (body.bgColor !== undefined) updates.bg_color = body.bgColor;

  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', params.id)
    .select('*')
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(serializeCategory(data as DbCategoryRow));
}
