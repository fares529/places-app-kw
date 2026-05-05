export interface Country {
  code: string;
  dial: string;
  flag: string;
  nameAr: string;
  nameEn: string;
  phoneLength: number;
}

export const gulfCountries: Country[] = [
  {
    code: 'KW',
    dial: '+965',
    flag: '🇰🇼',
    nameAr: 'الكويت',
    nameEn: 'Kuwait',
    phoneLength: 8,
  },
  {
    code: 'SA',
    dial: '+966',
    flag: '🇸🇦',
    nameAr: 'السعودية',
    nameEn: 'Saudi Arabia',
    phoneLength: 9,
  },
  {
    code: 'AE',
    dial: '+971',
    flag: '🇦🇪',
    nameAr: 'الإمارات',
    nameEn: 'UAE',
    phoneLength: 9,
  },
  {
    code: 'QA',
    dial: '+974',
    flag: '🇶🇦',
    nameAr: 'قطر',
    nameEn: 'Qatar',
    phoneLength: 8,
  },
  {
    code: 'BH',
    dial: '+973',
    flag: '🇧🇭',
    nameAr: 'البحرين',
    nameEn: 'Bahrain',
    phoneLength: 8,
  },
  {
    code: 'OM',
    dial: '+968',
    flag: '🇴🇲',
    nameAr: 'عُمان',
    nameEn: 'Oman',
    phoneLength: 8,
  },
];

export function getCountry(code: string): Country | undefined {
  return gulfCountries.find((c) => c.code === code);
}
