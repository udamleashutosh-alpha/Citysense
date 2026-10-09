import type { DataProvenance } from '@/types';
import Badge from './Badge';
import { Star } from 'lucide-react';

interface RatingDisplayProps {
  rating: number;
  count?: number;
  provenance: DataProvenance;
  size?: 'sm' | 'md' | 'lg';
}

const provenanceLabel: Record<DataProvenance, string> = {
  sample: 'Sample rating',
  community: 'Community rating',
  verified: 'Verified rating',
};

export default function RatingDisplay({
  rating,
  count,
  provenance,
  size = 'md',
}: RatingDisplayProps) {
  const starSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < fullStars;
          const half = i === fullStars && hasHalf;
          return (
            <Star
              key={i}
              size={starSize}
              className={
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : half
                  ? 'fill-amber-200 text-amber-400'
                  : 'fill-transparent text-navy-200'
              }
            />
          );
        })}
      </div>
      <span
        className={`font-semibold text-navy-800 ${
          size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
        }`}
      >
        {rating.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className="text-sm text-navy-400">
          ({count.toLocaleString()})
        </span>
      )}
      <Badge variant={provenance === 'sample' ? 'sample' : 'community'}>
        {provenanceLabel[provenance]}
      </Badge>
    </div>
  );
}
