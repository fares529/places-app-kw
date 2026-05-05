import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';

export const dynamic = 'force-dynamic';
import { serializePlace, placeToDbInsert, DbPlaceRow } from '@/lib/db/serializers';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const q = searchParams.get('q');

  let query = supabase.from('places').select('*').order('rating', { ascending: false });
  if (category) query = query.eq('category_id', category);
  if (featured === 'true') query = query.eq('is_featured', true);
  if (q) {
    query = query.or(
      `name_ar.ilike.%${q}%,name_en.ilike.%${q}%,area.ilike.%${q}%,area_en.ilike.%${q}%`
    );
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data as DbPlaceRow[]).map(serializePlace));
}

export async function POST(req: Request) {
  const body = await req.json();
  const id = body.id || `p${String(Date.now()).slice(-6)}`;

  const insert = placeToDbInsert({
    id,
    nameAr: body.nameAr,
    nameEn: body.nameEn,
    descriptionAr: body.descriptionAr,
    descriptionEn: body.descriptionEn,
    categoryId: body.categoryId,
    rating: body.rating ?? 0,
    reviewsCount: body.reviewsCount ?? 0,
    priceRange: body.priceRange ?? 2,
    area: body.area,
    areaEn: body.areaEn,
    address: body.address ?? '',
    addressEn: body.addressEn ?? '',
    phone: body.phone || undefined,
    website: body.website || undefined,
    coordinates: body.coordinates ?? { lat: 0, lng: 0 },
    images: body.images ?? [],
    openingHours: body.openingHours ?? '',
    openingHoursEn: body.openingHoursEn ?? '',
    features: body.features ?? [],
    isFeatured: body.isFeatured ?? false,
  });

  const { data, error } = await supabase.from('places').insert(insert).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(serializePlace(data as DbPlaceRow), { status: 201 });
}
