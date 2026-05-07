import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/db/supabase';
import { mockPlaces } from '@/lib/data/mockPlaces';
import { placeToDbInsert } from '@/lib/db/serializers';
import { requireAdmin } from '@/lib/auth/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  await supabase.from('visits').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('places').delete().neq('id', '');

  const inserts = mockPlaces.map((p) =>
    placeToDbInsert({
      id: p.id,
      nameAr: p.nameAr,
      nameEn: p.nameEn,
      descriptionAr: p.descriptionAr,
      descriptionEn: p.descriptionEn,
      categoryId: p.categoryId,
      rating: p.rating,
      reviewsCount: p.reviewsCount,
      priceRange: p.priceRange,
      area: p.area,
      areaEn: p.areaEn,
      address: p.address,
      addressEn: p.addressEn,
      phone: p.phone,
      website: p.website,
      coordinates: p.coordinates,
      images: p.images,
      openingHours: p.openingHours,
      openingHoursEn: p.openingHoursEn,
      features: p.features,
      isFeatured: p.isFeatured,
    })
  );

  const { error } = await supabase.from('places').insert(inserts);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
