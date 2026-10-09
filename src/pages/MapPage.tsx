import { useState, useMemo } from 'react';
import { punePlaces } from '@/data/places';
import { useApp } from '@/context/AppContext';
import MapView from '@/components/MapView';
import SectionHeader from '@/components/SectionHeader';
import EmptyState from '@/components/EmptyState';
import type { Category } from '@/types';
import { Map, ExternalLink, MapPin, Filter, List, X } from 'lucide-react';
import Badge from '@/components/Badge';

const categories: (Category | 'All')[] = [
  'All',
  'Heritage',
  'Food',
  'Shopping',
  'Park',
  'Museum',
  'Nightlife',
  'Transport',
];

export default function MapPage() {
  const { allReports, setSelectedPlaceId } = useApp();
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [showListFallback, setShowListFallback] = useState(false);

  const filteredPlaces = useMemo(() => {
    if (activeCategory === 'All') return punePlaces;
    return punePlaces.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const reportsWithCoords = useMemo(
    () => allReports.filter((r) => r.lat && r.lng),
    [allReports]
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Explore Map"
        subtitle="Pune places and safety reports on an interactive OpenStreetMap map."
        icon={<Map size={28} />}
        action={
          <button
            onClick={() => setShowListFallback((v) => !v)}
            className="btn-ghost flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium"
          >
            <List size={16} />
            {showListFallback ? 'Show Map' : 'Show List'}
          </button>
        }
      />

      <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-4 ring-1 ring-amber-200">
        <Badge variant="warning">Note</Badge>
        <p className="text-xs text-amber-800">
          Map tiles load from OpenStreetMap if your network permits. Incident markers show
          approximate locations only — never exact coordinates. If tiles fail to load, use
          the list view or external map links.
        </p>
      </div>

      {!showListFallback ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={16} className="text-navy-400" />
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

          <MapView
            places={filteredPlaces}
            reports={reportsWithCoords}
            showFilters
            height="550px"
            onPlaceClick={(place) => setSelectedPlaceId(place.id)}
          />
        </>
      ) : (
        <div className="space-y-4">
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

          {filteredPlaces.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPlaces.map((place) => (
                <button
                  key={place.id}
                  onClick={() => setSelectedPlaceId(place.id)}
                  className="flex items-start gap-3 rounded-xl bg-sand-50 p-4 text-left shadow-sm ring-1 ring-navy-100/60 transition-all hover:shadow-md"
                >
                  <MapPin size={20} className="mt-0.5 shrink-0 text-teal-600" />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-navy-800">{place.name}</h4>
                    <p className="text-xs text-navy-400">{place.category} · {place.budget}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-navy-600">
                      {place.address}
                    </p>
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lng}#map=16/${place.lat}/${place.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700"
                    >
                      <ExternalLink size={12} />
                      Open in external map
                    </a>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="map"
              title="No places in this category"
              description="Try selecting a different category filter."
            />
          )}
        </div>
      )}
    </div>
  );
}
