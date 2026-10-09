import { useMemo } from 'react';
import { punePlaces } from '@/data/places';
import { useApp } from '@/context/AppContext';
import SectionHeader from '@/components/SectionHeader';
import EmptyState from '@/components/EmptyState';
import Badge from '@/components/Badge';
import RatingDisplay from '@/components/RatingDisplay';
import { budgetScore } from '@/utils/format';
import {
  GitCompare,
  X,
  Star,
  Sparkles,
  Accessibility,
  Trash2,
  MapPin,
  IndianRupee,
  ShieldCheck,
} from 'lucide-react';

export default function ComparePage() {
  const { compareIds, toggleCompare, clearCompare, setPage, allReports } = useApp();

  const selectedPlaces = useMemo(
    () => punePlaces.filter((p) => compareIds.includes(p.id)),
    [compareIds]
  );

  const safetyInfoForPlace = (placeName: string) => {
    const matching = allReports.filter(
      (r) =>
        r.location.toLowerCase().includes(placeName.toLowerCase().split(' ')[0]) ||
        placeName.toLowerCase().includes(r.location.toLowerCase().split(' ')[0])
    );
    return {
      total: matching.length,
      verified: matching.filter((r) => r.status === 'Verified').length,
    };
  };

  const metrics = [
    {
      key: 'budget',
      label: 'Budget',
      icon: IndianRupee,
      getValue: (p: typeof punePlaces[0]) => p.budget,
      getScore: (p: typeof punePlaces[0]) => budgetScore(p.budget),
      maxScore: 5,
    },
    {
      key: 'rating',
      label: 'Rating',
      icon: Star,
      getValue: (p: typeof punePlaces[0]) => `${p.rating.toFixed(1)} / 5`,
      getScore: (p: typeof punePlaces[0]) => p.rating,
      maxScore: 5,
    },
    {
      key: 'cleanliness',
      label: 'Cleanliness',
      icon: Sparkles,
      getValue: (p: typeof punePlaces[0]) => `${p.cleanliness} / 5`,
      getScore: (p: typeof punePlaces[0]) => p.cleanliness,
      maxScore: 5,
    },
    {
      key: 'accessibility',
      label: 'Accessibility',
      icon: Accessibility,
      getValue: (p: typeof punePlaces[0]) => `${p.accessibility} / 5`,
      getScore: (p: typeof punePlaces[0]) => p.accessibility,
      maxScore: 5,
    },
    {
      key: 'safety',
      label: 'Safety Info',
      icon: ShieldCheck,
      getValue: (p: typeof punePlaces[0]) => {
        const s = safetyInfoForPlace(p.name);
        return `${s.total} report${s.total !== 1 ? 's' : ''} (${s.verified} verified)`;
      },
      getScore: (p: typeof punePlaces[0]) => {
        const s = safetyInfoForPlace(p.name);
        return Math.min(s.total, 5);
      },
      maxScore: 5,
    },
  ];

  if (selectedPlaces.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <SectionHeader
          title="Compare Places"
          subtitle="Compare up to 3 places side-by-side on budget, rating, cleanliness, accessibility, and safety."
          icon={<GitCompare size={28} />}
        />
        <EmptyState
          icon="inbox"
          title="No places selected for comparison"
          description="Browse the Discover page and tap '+ Compare' on any place card to add it here."
          action={
            <button
              onClick={() => setPage('discover')}
              className="btn-primary rounded-xl px-5 py-2.5 text-sm font-medium"
            >
              Go to Discover
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Compare Places"
        subtitle={`${selectedPlaces.length} of 3 places selected for comparison.`}
        icon={<GitCompare size={28} />}
        action={
          <button
            onClick={clearCompare}
            className="btn-ghost flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium"
          >
            <Trash2 size={16} />
            Clear All
          </button>
        }
      />

      <div className="flex items-center gap-2 rounded-xl bg-teal-50 p-3 ring-1 ring-teal-200">
        <Badge variant="sample">Data note</Badge>
        <p className="text-xs text-teal-800">
          Ratings, cleanliness, and accessibility scores are sample values — not official
          ratings. Safety info counts come from community and sample reports.
        </p>
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto rounded-2xl bg-sand-50 shadow-sm ring-1 ring-navy-100/60">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-navy-100">
              <th className="p-4 text-left text-sm font-semibold text-navy-400">
                Metric
              </th>
              {selectedPlaces.map((place) => (
                <th key={place.id} className="p-4 text-left">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-display text-base font-semibold text-navy-800">
                        {place.name}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-navy-400">
                        <MapPin size={11} />
                        {place.category}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleCompare(place.id)}
                      className="rounded-lg p-1 text-navy-300 transition-colors hover:bg-navy-50 hover:text-red-500"
                      aria-label="Remove from compare"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Rating row with provenance */}
            <tr className="border-b border-navy-50">
              <td className="p-4 text-sm font-medium text-navy-600">Rating (with source)</td>
              {selectedPlaces.map((place) => (
                <td key={place.id} className="p-4">
                  <RatingDisplay
                    rating={place.rating}
                    count={place.ratingCount}
                    provenance={place.ratingProvenance}
                    size="sm"
                  />
                </td>
              ))}
            </tr>

            {metrics.map((metric) => {
              const maxScore = Math.max(
                ...selectedPlaces.map((p) => metric.getScore(p))
              );
              return (
                <tr key={metric.key} className="border-b border-navy-50">
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-navy-600">
                      <metric.icon size={16} className="text-teal-600" />
                      {metric.label}
                    </div>
                  </td>
                  {selectedPlaces.map((place) => {
                    const score = metric.getScore(place);
                    const isBest = score === maxScore && score > 0;
                    const barWidth = (score / metric.maxScore) * 100;
                    return (
                      <td key={place.id} className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-navy-700">
                            {metric.getValue(place)}
                          </span>
                          {isBest && selectedPlaces.length > 1 && (
                            <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-700">
                              Best
                            </span>
                          )}
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-navy-100">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isBest ? 'bg-teal-500' : 'bg-navy-300'
                            }`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {/* Entry fee */}
            <tr className="border-b border-navy-50">
              <td className="p-4 text-sm font-medium text-navy-600">Entry Fee</td>
              {selectedPlaces.map((place) => (
                <td key={place.id} className="p-4 text-sm text-navy-700">
                  {place.entryFee}
                </td>
              ))}
            </tr>

            {/* Hours */}
            <tr>
              <td className="p-4 text-sm font-medium text-navy-600">Hours</td>
              {selectedPlaces.map((place) => (
                <td key={place.id} className="p-4 text-sm text-navy-700">
                  {place.hours}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Add more suggestion */}
      {selectedPlaces.length < 3 && (
        <div className="rounded-2xl border-2 border-dashed border-navy-200 p-6 text-center">
          <p className="text-sm text-navy-400">
            You can add {3 - selectedPlaces.length} more place
            {3 - selectedPlaces.length > 1 ? 's' : ''} to compare.
          </p>
          <button
            onClick={() => setPage('discover')}
            className="btn-primary mt-3 rounded-xl px-5 py-2.5 text-sm font-medium"
          >
            Browse More Places
          </button>
        </div>
      )}
    </div>
  );
}
