import { useApp } from '@/context/AppContext';
import { punePlaces } from '@/data/places';
import {
  X,
  MapPin,
  Clock,
  Ticket,
  Sun,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  ArrowRight,
  Layers,
} from 'lucide-react';
import RatingDisplay from './RatingDisplay';
import Badge from './Badge';
import { useState, useEffect } from 'react';

interface PlaceDetailsModalProps {
  placeId: string | null;
  onClose: () => void;
}

export default function PlaceDetailsModal({ placeId, onClose }: PlaceDetailsModalProps) {
  const { toggleBookmark, isBookmarked, setPage, toggleCompare, isInCompare, compareIds } = useApp();
  const place = punePlaces.find((p) => p.id === placeId);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (place) {
      setImageUrl(undefined);
    }
  }, [placeId]);

  useEffect(() => {
    if (!place) return;
    let active = true;
    fetch(
      `https://www.pexels.com/v1/search?query=${encodeURIComponent(
        place.imageQuery
      )}&per_page=1`
    )
      .then(() => {})
      .catch(() => {});
    // Pexels doesn't have a free REST endpoint without API key;
    // we'll just show a gradient placeholder for the modal image
    void active;
  }, [place]);

  if (!place) return null;

  const bookmarked = isBookmarked(place.id);
  const inCompare = isInCompare(place.id);

  const infoItems = [
    { icon: Clock, label: 'Hours', value: place.hours },
    { icon: Ticket, label: 'Entry Fee', value: place.entryFee },
    { icon: Sun, label: 'Best Time', value: place.bestTimeToVisit },
    { icon: MapPin, label: 'Address', value: place.address },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/60 backdrop-blur-sm animate-fade-in sm:items-center"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-sand-50 shadow-2xl animate-slide-up sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-sand-50/90 p-2 backdrop-blur-sm transition-all hover:bg-sand-50 hover:shadow-md"
          aria-label="Close details"
        >
          <X size={20} className="text-navy-700" />
        </button>

        <div className="relative h-52 overflow-hidden bg-gradient-to-br from-navy-200 via-navy-300 to-teal-200 sm:h-64">
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin size={48} className="text-white/40" />
          </div>
          <div className="absolute left-4 top-4 flex gap-2">
            <span className="rounded-full bg-navy-900/80 px-3 py-1 text-xs font-semibold text-sand-50">
              {place.category}
            </span>
            {place.budget === 'Free' && (
              <span className="rounded-full bg-teal-500 px-3 py-1 text-xs font-semibold text-white">
                Free Entry
              </span>
            )}
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-bold text-navy-800">
                {place.name}
              </h2>
              <p className="mt-1 text-sm text-navy-400">{place.address}</p>
            </div>
            <button
              onClick={() => toggleBookmark(place.id)}
              className={`shrink-0 rounded-xl p-2.5 transition-all ${
                bookmarked
                  ? 'bg-teal-50 text-teal-600 ring-1 ring-teal-200'
                  : 'bg-navy-50 text-navy-400 ring-1 ring-navy-100 hover:bg-navy-100'
              }`}
              aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {bookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
            </button>
          </div>

          <div className="mt-3">
            <RatingDisplay
              rating={place.rating}
              count={place.ratingCount}
              provenance={place.ratingProvenance}
              size="lg"
            />
          </div>

          <p className="mt-4 text-sm leading-relaxed text-navy-600">
            {place.longDesc}
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {infoItems.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 rounded-xl bg-navy-50/60 p-3"
              >
                <item.icon size={18} className="mt-0.5 shrink-0 text-teal-600" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-navy-400">
                    {item.label}
                  </p>
                  <p className="text-sm text-navy-700">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {place.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-navy-50 px-3 py-1 text-xs font-medium text-navy-600"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Badge variant="sample">Sample record</Badge>
            <span className="text-xs text-navy-400">{place.source}</span>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 border-t border-navy-100 pt-5">
            <button
              onClick={() => {
                setPage('map');
                onClose();
              }}
              className="btn-primary flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium"
            >
              <MapPin size={16} />
              View on Map
            </button>
            {place.externalLink && (
              <a
                href={place.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium"
              >
                <ExternalLink size={16} />
                Learn More
              </a>
            )}
            {(compareIds.length < 3 || inCompare) && (
              <button
                onClick={() => toggleCompare(place.id)}
                className="btn-ghost flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium"
              >
                <Layers size={16} />
                {inCompare ? 'Remove from Compare' : 'Add to Compare'}
              </button>
            )}
            <button
              onClick={() => {
                setPage('compare');
                onClose();
              }}
              className="btn-ghost flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium"
            >
              Go to Compare
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
