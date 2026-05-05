import { HeroSearch } from '@/components/home/HeroSearch';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedPlaces } from '@/components/home/FeaturedPlaces';

export default function HomePage() {
  return (
    <>
      <HeroSearch />
      <CategoryGrid />
      <FeaturedPlaces />
    </>
  );
}
