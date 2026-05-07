import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/db/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const [
    placesRes,
    categoriesRes,
    visitsRes,
    appVisitsRes,
    placesAggRes,
    featuredRes,
    visitsByPlace,
    visitsByCountry,
  ] = await Promise.all([
    supabase.from('places').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('visits').select('*', { count: 'exact', head: true }),
    supabase.from('app_visits').select('*', { count: 'exact', head: true }),
    supabase.from('places').select('rating'),
    supabase.from('places').select('*', { count: 'exact', head: true }).eq('is_featured', true),
    supabase.from('visits').select('place_id'),
    supabase.from('country_visits').select('country_code'),
  ]);

  const ratings = (placesAggRes.data || []).map((r) => r.rating as number);
  const avgRating =
    ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

  const placeCounts: Record<string, number> = {};
  for (const v of visitsByPlace.data || []) {
    placeCounts[v.place_id] = (placeCounts[v.place_id] || 0) + 1;
  }
  const topVisited = Object.entries(placeCounts)
    .map(([placeId, count]) => ({ placeId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const countryStats: Record<string, number> = {};
  for (const c of visitsByCountry.data || []) {
    countryStats[c.country_code] = (countryStats[c.country_code] || 0) + 1;
  }

  return NextResponse.json({
    totalPlaces: placesRes.count ?? 0,
    totalCategories: categoriesRes.count ?? 0,
    totalVisits: visitsRes.count ?? 0,
    appVisits: appVisitsRes.count ?? 0,
    avgRating,
    featuredCount: featuredRes.count ?? 0,
    topVisited,
    countryStats,
    totalCountryVisits: Object.values(countryStats).reduce((s, n) => s + n, 0),
  });
}
