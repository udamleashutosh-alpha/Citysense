import { useState, useMemo, useEffect } from 'react';
import { punePlaces } from '@/data/places';
import type { Category, Budget } from '@/types';
import { useApp } from '@/context/AppContext';
import PlaceCard from '@/components/PlaceCard';
import PlaceDetailsModal from '@/components/PlaceDetailsModal';
import EmptyState from '@/components/EmptyState';
import SectionHeader from '@/components/SectionHeader';
import { recommendPlaces, type RecommendCriteria } from '@/utils/recommend';
import {
  Search,
  Compass,
  SlidersHorizontal,
  Bookmark,
  Sparkles,
  X,
  ArrowRight,
} from 'lucide-react';
import Badge from '@/components/Badge';

const categories: (Category | 'All')[] = [
  'All',
  'Attraction',
  'Heritage',
  'Food',
  'Shopping',
  'Park',
  'Museum',
  'Nightlife',
  'Transport',
];

const budgets: (Budget | 'All')[] = ['All', 'Free', 'Budget', 'Mid-range', 'Premium'];

type SortOption = 'relevance' | 'rating' | 'budget' | 'name';

export default function DiscoverPage() {
  const { bookmarks, selectedPlaceId, setSelectedPlaceId, setPage, isInCompare, toggleCompare, compareIds } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [activeBudget, setActiveBudget] = useState<Budget | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [showRecs, setShowRecs] = useState(false);
  const [recCriteria, setRecCriteria] = useState<RecommendCriteria>({});
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  // Fetch stock images for visible places
  useEffect(() => {
    const fetchImages = async () => {
      const newUrls: Record<string, string> = {};
      for (const place of punePlaces) {
        if (imageUrls[place.id]) continue;
        try {
          const resp = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(
              place.imageQuery
            )}&per_page=1`,
            {
              headers: {
                Authorization: '',
              },
            }
          );
          if (resp.ok) {
            const data = await resp.json();
            if (data.photos?.[0]?.src?.medium) {
              newUrls[place.id] = data.photos[0].src.medium;
            }
          }
        } catch {
          // no API key; fallback to gradient
        }
      }
      if (Object.keys(newUrls).length > 0) {
        setImageUrls((prev) => ({ ...prev, ...newUrls }));
      }
    };
    // We don't have Pexels API key in browser, so skip fetching.
    // Cards will show gradient fallback with MapPin icon.
    void fetchImages;
  }, []);

  const filteredPlaces = useMemo(() => {
    let result = punePlaces;

    if (showBookmarksOnly) {
      result = result.filter((p) => bookmarks.includes(p.id));
    }

    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (activeBudget !== 'All') {
      if (activeBudget === 'Free') {
        result = result.filter((p) => p.budget === 'Free');
      } else {
        result = result.filter((p) => p.budget === activeBudget);
      }
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case 'budget': {
        const budgetOrder: Record<string, number> = {
          Free: 1,
          Budget: 2,
          'Mid-range': 3,
          Premium: 4,
        };
        result = [...result].sort(
          (a, b) => budgetOrder[a.budget] - budgetOrder[b.budget]
        );
        break;
      }
      case 'name':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [activeCategory, activeBudget, search, sortBy, showBookmarksOnly, bookmarks]);

  const recommendations = useMemo(() => {
    if (!showRecs) return [];
    return recommendPlaces(punePlaces, recCriteria);
  }, [showRecs, recCriteria]);

  const hasActiveFilters =
    activeCategory !== 'All' ||
    activeBudget !== 'All' ||
    search.trim() !== '' ||
    showBookmarksOnly;

  const clearFilters = () => {
    setActiveCategory('All');
    setActiveBudget('All');
    setSearch('');
    setShowBookmarksOnly(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 p-6 sm:p-10">
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-10">
          <Compass size={300} className="ml-auto -mt-10 text-teal-400" />
        </div>
        <div className="relative max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-teal-500/15 px-3 py-1 text-xs font-medium text-teal-300">
            <span className="h-2 w-2 animate-pulse-soft rounded-full bg-teal-400" />
            Demo City: Pune, Maharashtra, India
          </div>
          <h1 className="font-display text-3xl font-bold text-sand-50 sm:text-4xl">
            Discover Pune through the eyes of a local
          </h1>
          <p className="mt-3 text-sm text-navy-200 sm:text-base">
            Explore heritage, food, parks, and culture. Filter by budget, find accessible
            spots, and compare neighbourhoods — all with transparent, clearly-labelled data.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => setShowRecs((v) => !v)}
              className="flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-teal-600 hover:shadow-lg hover:shadow-teal-500/20"
            >
              <Sparkles size={16} />
              {showRecs ? 'Hide Recommendations' : 'Get Recommendations'}
            </button>
            <button
              onClick={() => setShowBookmarksOnly((v) => !v)}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                showBookmarksOnly
                  ? 'bg-sand-50 text-navy-800'
                  : 'bg-navy-700/50 text-sand-50 hover:bg-navy-700'
              }`}
            >
              <Bookmark
                size={16}
                className={showBookmarksOnly ? 'fill-navy-800' : ''}
              />
              My Bookmarks ({bookmarks.length})
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations Panel */}
      {showRecs && (
        <div className="rounded-2xl bg-navy-800/40 p-5 ring-1 ring-navy-700/50 animate-slide-down">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-sand-50">
            <Sparkles size={18} className="text-teal-400" />
            Smart Recommendations
          </h3>
          <p className="mt-1 text-sm text-navy-300">
            Set your preferences and we'll suggest places using transparent scoring logic —
            no black-box AI, just clear rules.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="block">
              <span className="text-xs font-medium text-navy-300">Max Budget</span>
              <select
                value={recCriteria.maxBudget ?? ''}
                onChange={(e) =>
                  setRecCriteria((c) => ({
                    ...c,
                    maxBudget: (e.target.value || undefined) as Budget | undefined,
                  }))
                }
                className="mt-1 w-full rounded-lg border border-navy-600 bg-navy-900 px-3 py-2 text-sm text-sand-50 outline-none focus:border-teal-500"
              >
                <option value="">Any budget</option>
                <option value="Free">Free only</option>
                <option value="Budget">Budget or less</option>
                <option value="Mid-range">Mid-range or less</option>
                <option value="Premium">Any (Premium ok)</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-navy-300">Category</span>
              <select
                value={recCriteria.preferredCategory ?? ''}
                onChange={(e) =>
                  setRecCriteria((c) => ({
                    ...c,
                    preferredCategory: e.target.value || undefined,
                  }))
                }
                className="mt-1 w-full rounded-lg border border-navy-600 bg-navy-900 px-3 py-2 text-sm text-sand-50 outline-none focus:border-teal-500"
              >
                <option value="">All categories</option>
                {categories.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col">
              <span className="text-xs font-medium text-navy-300">
                Min Rating: {recCriteria.minRating?.toFixed(1) ?? 'None'}
              </span>
              <input
                type="range"
                min={0}
                max={5}
                step={0.5}
                value={recCriteria.minRating ?? 0}
                onChange={(e) =>
                  setRecCriteria((c) => ({
                    ...c,
                    minRating: parseFloat(e.target.value) || undefined,
                  }))
                }
                className="mt-3 accent-teal-500"
              />
            </label>
          </div>
          <label className="mt-3 flex items-center gap-2">
            <input
              type="checkbox"
              checked={recCriteria.requireAccessibility ?? false}
              onChange={(e) =>
                setRecCriteria((c) => ({
                  ...c,
                  requireAccessibility: e.target.checked || undefined,
                }))
              }
              className="accent-teal-500"
            />
            <span className="text-sm text-navy-300">
              Require good accessibility (4+ rating)
            </span>
          </label>

          {recommendations.length > 0 && (
            <div className="mt-5 space-y-3">
              {recommendations.map((rec, idx) => (
                <div
                  key={rec.place.id}
                  className="flex items-center gap-4 rounded-xl bg-navy-900/60 p-4 ring-1 ring-navy-700/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-500/20 text-sm font-bold text-teal-300">
                    {idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sand-50">{rec.place.name}</h4>
                      <span className="text-xs text-navy-400">
                        Score: {rec.score}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {rec.reasons.map((reason) => (
                        <span
                          key={reason}
                          className="rounded-md bg-teal-500/10 px-2 py-0.5 text-xs text-teal-300"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPlaceId(rec.place.id)}
                    className="shrink-0 rounded-lg bg-teal-500/20 p-2 text-teal-300 transition-colors hover:bg-teal-500/30"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {showRecs && recommendations.length === 0 && (
            <div className="mt-4 rounded-xl bg-navy-900/60 p-4 text-center text-sm text-navy-400">
              No places match your criteria. Try relaxing the filters.
            </div>
          )}
        </div>
      )}

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search places, tags, or categories..."
              className="w-full rounded-xl border border-navy-200 bg-sand-50 py-2.5 pl-10 pr-4 text-sm text-navy-800 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-navy-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-xl border border-navy-200 bg-sand-50 px-3 py-2.5 text-sm text-navy-800 outline-none focus:border-teal-500"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="rating">Sort: Rating</option>
              <option value="budget">Sort: Budget</option>
              <option value="name">Sort: Name</option>
            </select>
          </div>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`chip ${
                activeCategory === cat ? 'chip-active' : 'chip-inactive'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Budget chips */}
        <div className="flex flex-wrap items-center gap-2">
          {budgets.map((b) => (
            <button
              key={b}
              onClick={() => setActiveBudget(b)}
              className={`chip ${
                activeBudget === b ? 'chip-active' : 'chip-inactive'
              }`}
            >
              {b === 'All' ? 'Any Budget' : b}
            </button>
          ))}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto flex items-center gap-1 text-xs font-medium text-navy-400 hover:text-navy-600"
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-navy-400">
          {filteredPlaces.length} place{filteredPlaces.length !== 1 ? 's' : ''} found
          {showBookmarksOnly && ' in bookmarks'}
        </p>
        <Badge variant="sample">All records are sample data</Badge>
      </div>

      {/* Place grid */}
      {filteredPlaces.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              imageUrl={imageUrls[place.id]}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={showBookmarksOnly ? 'inbox' : 'search'}
          title={showBookmarksOnly ? 'No bookmarks yet' : 'No places found'}
          description={
            showBookmarksOnly
              ? 'Tap the bookmark icon on any place card to save it for later.'
              : 'Try adjusting your search or filters to find what you\u2019re looking for.'
          }
          action={
            hasActiveFilters ? (
              <button
                onClick={clearFilters}
                className="btn-primary rounded-xl px-5 py-2.5 text-sm font-medium"
              >
                Clear all filters
              </button>
            ) : undefined
          }
        />
      )}

      {/* Details modal */}
      {selectedPlaceId && (
        <PlaceDetailsModal
          placeId={selectedPlaceId}
          onClose={() => setSelectedPlaceId(null)}
        />
      )}
    </div>
  );
}
