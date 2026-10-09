import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { sampleSafetyReports } from '@/data/insights';
import type { IncidentCategory, IncidentStatus } from '@/types';
import SectionHeader from '@/components/SectionHeader';
import Badge from '@/components/Badge';
import EmptyState from '@/components/EmptyState';
import { timeAgo, formatDate } from '@/utils/format';
import {
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  Clock,
  MapPin,
  Filter,
  Navigation,
  ExternalLink,
  AlertTriangle,
  FileText,
} from 'lucide-react';

const categoryColors: Record<IncidentCategory, string> = {
  Theft: 'bg-red-100 text-red-700 border-red-200',
  Harassment: 'bg-purple-100 text-purple-700 border-purple-200',
  'Road Safety': 'bg-amber-100 text-amber-700 border-amber-200',
  'Public Nuisance': 'bg-orange-100 text-orange-700 border-orange-200',
  'Lighting Issue': 'bg-blue-100 text-blue-700 border-blue-200',
  Other: 'bg-navy-100 text-navy-700 border-navy-200',
};

const statusIcon: Record<IncidentStatus, typeof ShieldCheck> = {
  Unverified: ShieldQuestion,
  'Under Review': ShieldAlert,
  Verified: ShieldCheck,
};

const statusBadge: Record<IncidentStatus, 'error' | 'warning' | 'success'> = {
  Unverified: 'error',
  'Under Review': 'warning',
  Verified: 'success',
};

const allCategories: (IncidentCategory | 'All')[] = [
  'All',
  'Theft',
  'Harassment',
  'Road Safety',
  'Public Nuisance',
  'Lighting Issue',
  'Other',
];

const allStatuses: (IncidentStatus | 'All')[] = [
  'All',
  'Unverified',
  'Under Review',
  'Verified',
];

export default function SafetyPage() {
  const { allReports } = useApp();
  const [activeCategory, setActiveCategory] = useState<IncidentCategory | 'All'>('All');
  const [activeStatus, setActiveStatus] = useState<IncidentStatus | 'All'>('All');
  const [showDirections, setShowDirections] = useState(false);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');

  const filteredReports = useMemo(() => {
    let result = allReports;
    if (activeCategory !== 'All') {
      result = result.filter((r) => r.category === activeCategory);
    }
    if (activeStatus !== 'All') {
      result = result.filter((r) => r.status === activeStatus);
    }
    return [...result].sort((a, b) => b.timestamp - a.timestamp);
  }, [allReports, activeCategory, activeStatus]);

  const stats = useMemo(() => {
    const total = allReports.length;
    const verified = allReports.filter((r) => r.status === 'Verified').length;
    const unverified = allReports.filter((r) => r.status === 'Unverified').length;
    const review = allReports.filter((r) => r.status === 'Under Review').length;
    return { total, verified, unverified, review };
  }, [allReports]);

  const handleDirections = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromLocation.trim() && toLocation.trim()) {
      const url = `https://www.openstreetmap.org/directions?from=${encodeURIComponent(
        fromLocation + ', Pune'
      )}&to=${encodeURIComponent(toLocation + ', Pune')}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Safety"
        subtitle="Community-submitted incident reports with transparent verification status."
        icon={<ShieldAlert size={28} />}
        action={
          <button
            onClick={() => setShowDirections((v) => !v)}
            className="btn-primary flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium"
          >
            <Navigation size={16} />
            Get Directions
          </button>
        }
      />

      {/* Emergency disclaimer */}
      <div className="rounded-2xl bg-red-50 p-5 ring-1 ring-red-200">
        <div className="flex items-start gap-3">
          <AlertTriangle size={22} className="mt-0.5 shrink-0 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-800">Emergency Disclaimer</h3>
            <p className="mt-1 text-sm text-red-700">
              In an emergency, call <strong>112</strong> (India emergency number) or
              <strong> 100</strong> (police) immediately. CITYSENSE is not an official
              safety authority. Reports here are community-submitted and do not guarantee
              a safe route or official verification. Always exercise personal caution.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total Reports', value: stats.total, icon: FileText, color: 'text-navy-700 bg-navy-50' },
          { label: 'Unverified', value: stats.unverified, icon: ShieldQuestion, color: 'text-red-600 bg-red-50' },
          { label: 'Under Review', value: stats.review, icon: ShieldAlert, color: 'text-amber-600 bg-amber-50' },
          { label: 'Verified', value: stats.verified, icon: ShieldCheck, color: 'text-green-600 bg-green-50' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-sand-50 p-4 shadow-sm ring-1 ring-navy-100/60"
          >
            <div className={`mb-2 inline-flex rounded-lg p-2 ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            <p className="text-2xl font-bold text-navy-800">{stat.value}</p>
            <p className="text-xs text-navy-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Directions form */}
      {showDirections && (
        <div className="rounded-2xl bg-sand-50 p-5 shadow-sm ring-1 ring-navy-100/60 animate-slide-down">
          <h3 className="flex items-center gap-2 font-semibold text-navy-800">
            <Navigation size={18} className="text-teal-600" />
            Plan a Route (External)
          </h3>
          <p className="mt-1 text-sm text-navy-400">
            Enter start and destination to open directions in OpenStreetMap.
            We do not store or guarantee route safety.
          </p>
          <form onSubmit={handleDirections} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              placeholder="From (e.g. FC Road)"
              required
              className="flex-1 rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-800 outline-none focus:border-teal-500"
            />
            <input
              type="text"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              placeholder="To (e.g. Koregaon Park)"
              required
              className="flex-1 rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-800 outline-none focus:border-teal-500"
            />
            <button
              type="submit"
              className="btn-primary flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium"
            >
              <ExternalLink size={16} />
              Open Route
            </button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Filter size={16} className="text-navy-400" />
          {allCategories.map((cat) => (
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
        <div className="flex flex-wrap items-center gap-2">
          {allStatuses.map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`chip ${
                activeStatus === status ? 'chip-active' : 'chip-inactive'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Reports list */}
      {filteredReports.length > 0 ? (
        <div className="space-y-3">
          {filteredReports.map((report) => {
            const StatusIcon = statusIcon[report.status];
            return (
              <div
                key={report.id}
                className="rounded-2xl bg-sand-50 p-5 shadow-sm ring-1 ring-navy-100/60 transition-all hover:shadow-md animate-slide-up"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${
                        categoryColors[report.category]
                      }`}
                    >
                      {report.category}
                    </div>
                    <Badge variant={statusBadge[report.status]}>
                      <StatusIcon size={12} />
                      {report.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-navy-400">
                    {report.source === 'sample' ? 'Sample' : 'Community'}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-navy-700">
                  {report.description}
                </p>

                {report.imageDataUrl && (
                  <img
                    src={report.imageDataUrl}
                    alt="Report attachment"
                    className="mt-3 max-h-48 rounded-lg object-cover ring-1 ring-navy-100"
                  />
                )}

                {report.hasVoiceNote && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-navy-50 px-3 py-2 text-xs text-navy-500">
                    <FileText size={14} className="text-teal-600" />
                    Voice note attached: {report.voiceNoteName ?? 'audio recording'}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-navy-100 pt-3 text-xs text-navy-400">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {report.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {timeAgo(report.timestamp)}
                  </span>
                  <span title={formatDate(report.timestamp)}>
                    {formatDate(report.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon="inbox"
          title="No reports found"
          description="No reports match your current filters. Try changing the category or status."
        />
      )}
    </div>
  );
}
