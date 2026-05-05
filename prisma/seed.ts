import { PrismaClient } from '@prisma/client';
import { mockPlaces } from '../lib/data/mockPlaces';
import { mockCategories } from '../lib/data/mockCategories';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Categories first (places depend on them)
  for (const cat of mockCategories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {
        nameAr: cat.nameAr,
        nameEn: cat.nameEn,
        icon: cat.icon,
        color: cat.color,
        bgColor: cat.bgColor,
      },
      create: {
        id: cat.id,
        nameAr: cat.nameAr,
        nameEn: cat.nameEn,
        icon: cat.icon,
        color: cat.color,
        bgColor: cat.bgColor,
      },
    });
  }
  console.log(`  ✓ ${mockCategories.length} categories`);

  // Places
  for (const p of mockPlaces) {
    await prisma.place.upsert({
      where: { id: p.id },
      update: {},
      create: {
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
        phone: p.phone || null,
        website: p.website || null,
        lat: p.coordinates.lat,
        lng: p.coordinates.lng,
        images: JSON.stringify(p.images),
        openingHours: p.openingHours,
        openingHoursEn: p.openingHoursEn,
        features: JSON.stringify(p.features),
        isFeatured: p.isFeatured,
        createdAt: new Date(p.createdAt),
      },
    });
  }
  console.log(`  ✓ ${mockPlaces.length} places`);

  console.log('✅ Seed complete');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
