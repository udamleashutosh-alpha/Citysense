import type { Place } from '@/types';
import { Bookmark, BookmarkCheck, ArrowUpRight, MapPin } from 'lucide-react';
import RatingDisplay from './RatingDisplay';
import { useApp } from '@/context/AppContext';

interface PlaceCardProps {
  place: Place;
  imageUrl?: string;
}

export default function PlaceCard({ place, imageUrl }: PlaceCardProps) {
  const { toggleBookmark, isBookmarked, setSelectedPlaceId, setPage } = useApp();
  const bookmarked = isBookmarked(place.id);
  const { toggleCompare, isInCompare, compareIds } = useApp();
  const inCompare = isInCompare(place.id);

  const handleCardClick = () => {
    setSelectedPlaceId(place.id);
    setPage('discover');
  };

  return (
    <article
      onClick={handleCardClick}
      className="group cursor-pointer overflow-hidden rounded-2xl bg-sand-50 shadow-sm ring-1 ring-navy-100/60 transition-all duration-200 hover:shadow-xl hover:ring-navy-200 animate-slide-up"
    >
      <div className="relative h-44 overflow-hidden bg-navy-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={place.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-100 to-navy-200">
            <MapPin size={36} className="text-navy-300" />
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-navy-900/75 px-3 py-1 text-xs font-semibold text-sand-50 backdrop-blur-sm">
            {place.category}
          </span>
          {place.budget === 'Free' && (
            <span className="rounded-full bg-teal-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              Free
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark(place.id);
          }}
          className="absolute right-3 top-3 rounded-full bg-sand-50/90 p-2 backdrop-blur-sm transition-all hover:bg-sand-50 hover:shadow-md"
          aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          {bookmarked ? (
            <BookmarkCheck size={18} className="text-teal-600" />
          ) : (
            <Bookmark size={18} className="text-navy-400" />
          )}
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-snug text-navy-800 group-hover:text-teal-700">
            {place.name}
          </h3>
          <ArrowUpRight
            size={18}
            className="mt-0.5 shrink-0 text-navy-300 transition-all group-hover:text-teal-600"
          />
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-navy-400">{place.shortDesc}</p>
        <div className="mt-3">
          <RatingDisplay
            rating={place.rating}
            count={place.ratingCount}
            provenance={place.ratingProvenance}
            size="sm"
          />
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-navy-100 pt-3">
          <span className="text-xs text-navy-400">
            <MapPin size={12} className="mr-1 inline" />
            {place.budget}
          </span>
          {compareIds.length < 3 || inCompare ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleCompare(place.id);
              }}
              className={`text-xs font-medium transition-colors ${
                inCompare
                  ? 'text-teal-600 hover:text-teal-700'
                  : 'text-navy-400 hover:text-navy-600'
              }`}
            >
              {inCompare ? 'In Compare' : '+ Compare'}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
