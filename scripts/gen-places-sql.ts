import { mockPlaces } from '../lib/data/mockPlaces';

function esc(s: string | null | undefined): string {
  if (s === null || s === undefined || s === '') return 'NULL';
  return `'${String(s).replace(/'/g, "''")}'`;
}

function strEsc(s: string | null | undefined): string {
  if (s === null || s === undefined) return "''";
  return `'${String(s).replace(/'/g, "''")}'`;
}

function jsonEsc(arr: unknown): string {
  return `'${JSON.stringify(arr).replace(/'/g, "''")}'::jsonb`;
}

const rows = mockPlaces.map(p => `(
  ${strEsc(p.id)},
  ${strEsc(p.nameAr)},
  ${strEsc(p.nameEn)},
  ${strEsc(p.descriptionAr)},
  ${strEsc(p.descriptionEn)},
  ${strEsc(p.categoryId)},
  ${p.rating},
  ${p.reviewsCount},
  ${p.priceRange},
  ${strEsc(p.area)},
  ${strEsc(p.areaEn)},
  ${strEsc(p.address)},
  ${strEsc(p.addressEn)},
  ${esc(p.phone)},
  ${esc(p.website)},
  ${p.coordinates.lat},
  ${p.coordinates.lng},
  ${jsonEsc(p.images)},
  ${strEsc(p.openingHours)},
  ${strEsc(p.openingHoursEn)},
  ${jsonEsc(p.features)},
  ${p.isFeatured},
  '${p.createdAt}T00:00:00Z'::timestamptz
)`).join(',\n');

console.log(`INSERT INTO places (
  id, name_ar, name_en, description_ar, description_en, category_id,
  rating, reviews_count, price_range, area, area_en, address, address_en,
  phone, website, lat, lng, images, opening_hours, opening_hours_en,
  features, is_featured, created_at
) VALUES ${rows};`);
