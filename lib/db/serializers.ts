import type { Place, Category, CategoryId } from '@/lib/types';

export interface DbPlaceRow {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  category_id: string;
  rating: number;
  reviews_count: number;
  price_range: number;
  area: string;
  area_en: string;
  address: string;
  address_en: string;
  phone: string | null;
  website: string | null;
  lat: number;
  lng: number;
  images: string[];
  opening_hours: string;
  opening_hours_en: string;
  features: string[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbCategoryRow {
  id: string;
  name_ar: string;
  name_en: string;
  icon: string;
  color: string;
  bg_color: string;
}

export function serializePlace(p: DbPlaceRow): Place {
  return {
    id: p.id,
    nameAr: p.name_ar,
    nameEn: p.name_en,
    descriptionAr: p.description_ar,
    descriptionEn: p.description_en,
    categoryId: p.category_id as CategoryId,
    rating: p.rating,
    reviewsCount: p.reviews_count,
    priceRange: p.price_range as 1 | 2 | 3 | 4,
    area: p.area,
    areaEn: p.area_en,
    address: p.address,
    addressEn: p.address_en,
    phone: p.phone || undefined,
    website: p.website || undefined,
    coordinates: { lat: p.lat, lng: p.lng },
    images: Array.isArray(p.images) ? p.images : [],
    openingHours: p.opening_hours,
    openingHoursEn: p.opening_hours_en,
    features: Array.isArray(p.features) ? p.features : [],
    isFeatured: p.is_featured,
    createdAt: new Date(p.created_at).toISOString().split('T')[0],
  };
}

export function serializeCategory(c: DbCategoryRow): Category {
  return {
    id: c.id as CategoryId,
    nameAr: c.name_ar,
    nameEn: c.name_en,
    icon: c.icon,
    color: c.color,
    bgColor: c.bg_color,
  };
}

export function placeToDbInsert(input: Omit<Place, 'id' | 'createdAt'> & { id: string }) {
  return {
    id: input.id,
    name_ar: input.nameAr,
    name_en: input.nameEn,
    description_ar: input.descriptionAr,
    description_en: input.descriptionEn,
    category_id: input.categoryId,
    rating: input.rating,
    reviews_count: input.reviewsCount,
    price_range: input.priceRange,
    area: input.area,
    area_en: input.areaEn,
    address: input.address,
    address_en: input.addressEn,
    phone: input.phone || null,
    website: input.website || null,
    lat: input.coordinates.lat,
    lng: input.coordinates.lng,
    images: input.images,
    opening_hours: input.openingHours,
    opening_hours_en: input.openingHoursEn,
    features: input.features,
    is_featured: input.isFeatured,
  };
}

export function placeToDbUpdate(input: Partial<Place>) {
  const out: Record<string, unknown> = {};
  if (input.nameAr !== undefined) out.name_ar = input.nameAr;
  if (input.nameEn !== undefined) out.name_en = input.nameEn;
  if (input.descriptionAr !== undefined) out.description_ar = input.descriptionAr;
  if (input.descriptionEn !== undefined) out.description_en = input.descriptionEn;
  if (input.categoryId !== undefined) out.category_id = input.categoryId;
  if (input.rating !== undefined) out.rating = input.rating;
  if (input.reviewsCount !== undefined) out.reviews_count = input.reviewsCount;
  if (input.priceRange !== undefined) out.price_range = input.priceRange;
  if (input.area !== undefined) out.area = input.area;
  if (input.areaEn !== undefined) out.area_en = input.areaEn;
  if (input.address !== undefined) out.address = input.address;
  if (input.addressEn !== undefined) out.address_en = input.addressEn;
  if (input.phone !== undefined) out.phone = input.phone || null;
  if (input.website !== undefined) out.website = input.website || null;
  if (input.coordinates) {
    out.lat = input.coordinates.lat;
    out.lng = input.coordinates.lng;
  }
  if (input.images !== undefined) out.images = input.images;
  if (input.openingHours !== undefined) out.opening_hours = input.openingHours;
  if (input.openingHoursEn !== undefined) out.opening_hours_en = input.openingHoursEn;
  if (input.features !== undefined) out.features = input.features;
  if (input.isFeatured !== undefined) out.is_featured = input.isFeatured;
  return out;
}
