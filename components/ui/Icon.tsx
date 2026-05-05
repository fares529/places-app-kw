import {
  Landmark,
  UtensilsCrossed,
  Coffee,
  Wrench,
  ShoppingBag,
  Wifi,
  Car,
  Users,
  Accessibility,
  Truck,
  Eye,
  Briefcase,
  Waves,
  Package,
  CalendarCheck,
  Clock,
  Film,
  Utensils,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Landmark,
  UtensilsCrossed,
  Coffee,
  Wrench,
  ShoppingBag,
  // features
  wifi: Wifi,
  parking: Car,
  family: Users,
  wheelchair: Accessibility,
  delivery: Truck,
  view: Eye,
  workspace: Briefcase,
  beach: Waves,
  pickup: Package,
  booking: CalendarCheck,
  '24h': Clock,
  cinema: Film,
  'food-court': Utensils,
};

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export function Icon({ name, className, size }: IconProps) {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;
  return <IconComponent className={className} size={size} />;
}
