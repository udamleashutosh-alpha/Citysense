import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { Place, SafetyReport } from '@/types';
import { MapPin, AlertTriangle, ExternalLink, MapPinOff } from 'lucide-react';

interface MapViewProps {
  places?: Place[];
  reports?: SafetyReport[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  showFilters?: boolean;
  onPlaceClick?: (place: Place) => void;
}

const placeIcon = L.divIcon({
  html: '<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:#0d867e;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);transform:rotate(-45deg);"></div>',
  className: 'citysense-place-marker',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

const reportIcon = L.divIcon({
  html: '<div style="width:24px;height:24px;border-radius:50%;background:#f87171;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:12px;color:#fff;font-weight:bold;">!</div>',
  className: 'citysense-report-marker',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export default function MapView({
  places = [],
  reports = [],
  center = [18.5204, 73.8567],
  zoom = 12,
  height = '500px',
  showFilters = false,
  onPlaceClick,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerLayer = useRef<L.LayerGroup | null>(null);
  const [mapFailed, setMapFailed] = useState(false);
  const [tilesLoaded, setTilesLoaded] = useState(false);
  const [showPlaces, setShowPlaces] = useState(true);
  const [showReports, setShowReports] = useState(true);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current || mapFailed) return;

    try {
      const map = L.map(mapRef.current, {
        center,
        zoom,
        scrollWheelZoom: true,
      });

      const tileLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }
      );

      tileLayer.on('tileerror', () => {
        setMapFailed(true);
      });

      tileLayer.on('load', () => {
        setTilesLoaded(true);
      });

      tileLayer.addTo(map);

      markerLayer.current = L.layerGroup().addTo(map);
      mapInstance.current = map;

      // Fallback timeout: if tiles haven't loaded in 8 seconds, show fallback
      const timeout = setTimeout(() => {
        if (!tilesLoaded) {
          // Don't hard-fail; the list fallback is shown alongside anyway
        }
      }, 8000);

      return () => {
        clearTimeout(timeout);
        map.remove();
        mapInstance.current = null;
      };
    } catch {
      setMapFailed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers when data or filters change
  useEffect(() => {
    if (!markerLayer.current) return;
    markerLayer.current.clearLayers();

    if (showPlaces) {
      places.forEach((place) => {
        const marker = L.marker([place.lat, place.lng], { icon: placeIcon });
        marker.bindPopup(`
          <div style="min-width:180px">
            <div style="font-weight:600;font-size:0.875rem;color:#13293d;margin-bottom:4px">${place.name}</div>
            <div style="font-size:0.75rem;color:#5376a3;margin-bottom:6px">${place.category} · ${place.budget}</div>
            <div style="font-size:0.75rem;color:#3a5a85">${place.shortDesc}</div>
          </div>
        `);
        if (onPlaceClick) {
          marker.on('click', () => onPlaceClick(place));
        }
        markerLayer.current!.addLayer(marker);
      });
    }

    if (showReports) {
      reports.forEach((report) => {
        if (report.lat && report.lng) {
          const marker = L.marker([report.lat, report.lng], { icon: reportIcon });
          marker.bindPopup(`
            <div style="min-width:180px">
              <div style="font-weight:600;font-size:0.875rem;color:#13293d;margin-bottom:4px">${report.category}</div>
              <div style="font-size:0.75rem;color:#5376a3;margin-bottom:4px">${report.location}</div>
              <div style="font-size:0.75rem;color:#3a5a85">${report.description}</div>
              <div style="margin-top:6px;font-size:0.7rem;color:#f87171;font-weight:500">${report.status}</div>
            </div>
          `);
          markerLayer.current!.addLayer(marker);
        }
      });
    }
  }, [places, reports, showPlaces, showReports, onPlaceClick]);

  if (mapFailed) {
    return (
      <div
        className="rounded-2xl bg-navy-50 p-6 text-center ring-1 ring-navy-100"
        style={{ height }}
      >
        <MapPinOff size={40} className="mx-auto mb-3 text-navy-300" />
        <h3 className="text-lg font-semibold text-navy-700">Map tiles unavailable</h3>
        <p className="mt-2 text-sm text-navy-400">
          The interactive map could not load. Use the list below or open an external map.
        </p>
        <a
          href={`https://www.openstreetmap.org/?mlat=${center[0]}&mlon=${center[1]}#map=14/${center[0]}/${center[1]}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium"
        >
          <ExternalLink size={16} />
          Open in OpenStreetMap
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {showFilters && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowPlaces((v) => !v)}
            className={`chip ${showPlaces ? 'chip-active' : 'chip-inactive'}`}
          >
            <MapPin size={14} className="mr-1 inline" />
            Places ({places.length})
          </button>
          <button
            onClick={() => setShowReports((v) => !v)}
            className={`chip ${showReports ? 'chip-active' : 'chip-inactive'}`}
          >
            <AlertTriangle size={14} className="mr-1 inline" />
            Reports ({reports.filter((r) => r.lat && r.lng).length})
          </button>
        </div>
      )}
      <div
        ref={mapRef}
        style={{ height }}
        className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-navy-100"
      />
      <p className="text-xs text-navy-400">
        Map data &copy; OpenStreetMap contributors · Tiles from OpenStreetMap.org
      </p>
    </div>
  );
}
