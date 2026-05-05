export type CategoryId = 'tourist' | 'restaurants' | 'cafes' | 'services' | 'malls';

export type Locale = 'ar' | 'en';

export interface Category {
  id: CategoryId;
  nameAr: string;
  nameEn: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface Place {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  categoryId: CategoryId;
  rating: number;
  reviewsCount: number;
  priceRange: 1 | 2 | 3 | 4;
  area: string;
  areaEn: string;
  address: string;
  addressEn: string;
  phone?: string;
  website?: string;
  coordinates: { lat: number; lng: number };
  images: string[];
  openingHours: string;
  openingHoursEn: string;
  features: string[];
  isFeatured: boolean;
  createdAt: string;
}
