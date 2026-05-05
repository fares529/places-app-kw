import { Category } from '../types';

export const mockCategories: Category[] = [
  {
    id: 'tourist',
    nameAr: 'أماكن سياحية',
    nameEn: 'Tourist Places',
    icon: 'Landmark',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    id: 'restaurants',
    nameAr: 'مطاعم',
    nameEn: 'Restaurants',
    icon: 'UtensilsCrossed',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  {
    id: 'cafes',
    nameAr: 'كافيهات',
    nameEn: 'Cafes',
    icon: 'Coffee',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
  },
  {
    id: 'services',
    nameAr: 'خدمات',
    nameEn: 'Services',
    icon: 'Wrench',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    id: 'malls',
    nameAr: 'أسواق ومولات',
    nameEn: 'Malls & Markets',
    icon: 'ShoppingBag',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
];
