import { Star } from 'lucide-react';
import clsx from 'clsx';

interface RatingProps {
  value: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export function Rating({ value, count, size = 'md', showCount = true, className }: RatingProps) {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={clsx('inline-flex items-center gap-1.5', className)}>
      <Star className={clsx(sizeClasses[size], 'fill-accent-500 text-accent-500')} />
      <span className={clsx(textSize[size], 'font-semibold text-gray-800')}>
        {value.toFixed(1)}
      </span>
      {showCount && count !== undefined && (
        <span className={clsx(textSize[size], 'text-gray-500')}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}

interface PriceRangeProps {
  value: 1 | 2 | 3 | 4;
  className?: string;
}

export function PriceRange({ value, className }: PriceRangeProps) {
  return (
    <span className={clsx('inline-flex font-semibold text-emerald-600', className)}>
      {Array.from({ length: 4 }).map((_, i) => (
        <span key={i} className={i < value ? 'text-emerald-600' : 'text-gray-300'}>
          $
        </span>
      ))}
    </span>
  );
}
