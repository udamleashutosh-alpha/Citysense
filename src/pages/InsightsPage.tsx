import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import {
  sampleWeather,
  sampleTraffic,
  sampleTrends,
} from '@/data/insights';
import SectionHeader from '@/components/SectionHeader';
import Badge from '@/components/Badge';
import { formatDate } from '@/utils/format';
import {
  BarChart3,
  Cloud,
  TrafficCone,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export default function InsightsPage() {
  const { allReports } = useApp();

  const reportTrends = useMemo(() => {
    const counts: Record<string, number> = {};
    allReports.forEach((r) => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [allReports]);

  const maxReportCount = Math.max(...reportTrends.map((t) => t.count), 1);

  const trafficColor = (level: string) => {
    if (level === 'Low') return 'text-green-700 bg-green-50';
    if (level === 'Moderate') return 'text-amber-700 bg-amber-50';
    return 'text-red-700 bg-red-50';
  };

  const trendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp size={14} className="text-amber-500" />;
    if (trend === 'down') return <TrendingDown size={14} className="text-green-500" />;
    return <Minus size={14} className="text-navy-400" />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Insights Dashboard"
        subtitle="Weather, traffic, and community trend snapshots for Pune."
        icon={<BarChart3 size={28} />}
      />

      <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200">
        <Badge variant="warning">Demo data</Badge>
        <p className="text-xs text-amber-800">
          Weather, traffic, and trend feeds are sample/demo values. No live API is connected.
          Timestamps show when the demo snapshot was generated.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Weather */}
        <div className="rounded-2xl bg-gradient-to-br from-navy-800 to-navy-900 p-6 text-sand-50 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
              <Cloud size={22} className="text-teal-400" />
              Weather
            </h3>
            <Badge variant="warning">Demo</Badge>
          </div>
          <div className="mt-5 flex items-end gap-4">
            <span className="font-display text-5xl font-bold">
              {sampleWeather.tempC}°
            </span>
            <div className="pb-2">
              <p className="text-lg text-sand-50">{sampleWeather.condition}</p>
              <p className="text-sm text-navy-300">Pune, Maharashtra</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-navy-700/40 p-3">
              <p className="text-xs text-navy-300">Humidity</p>
              <p className="text-lg font-semibold text-sand-50">
                {sampleWeather.humidity}%
              </p>
            </div>
            <div className="rounded-xl bg-navy-700/40 p-3">
              <p className="text-xs text-navy-300">Wind</p>
              <p className="text-lg font-semibold text-sand-50">
                {sampleWeather.windKph} km/h
              </p>
            </div>
          </div>
          <p className="mt-4 flex items-center gap-1 text-xs text-navy-400">
            <Clock size={11} />
            Updated: {formatDate(sampleWeather.updatedAt)}
          </p>
        </div>

        {/* Traffic */}
        <div className="rounded-2xl bg-sand-50 p-6 shadow-sm ring-1 ring-navy-100/60">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-navy-800">
              <TrafficCone size={22} className="text-teal-600" />
              Traffic Congestion
            </h3>
            <Badge variant="warning">Demo</Badge>
          </div>
          <div className="mt-5 space-y-3">
            {sampleTraffic.map((item) => (
              <div
                key={item.route}
                className="flex items-center justify-between rounded-xl bg-navy-50/60 p-3"
              >
                <span className="text-sm font-medium text-navy-700">
                  {item.route}
                </span>
                <span
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                    trafficColor(item.congestionLevel)
                  }`}
                >
                  {item.congestionLevel}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-1 text-xs text-navy-400">
            <Clock size={11} />
            Updated: {formatDate(sampleTraffic[0].updatedAt)}
          </p>
        </div>

        {/* Community trends - bar chart */}
        <div className="rounded-2xl bg-sand-50 p-6 shadow-sm ring-1 ring-navy-100/60">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-navy-800">
              <BarChart3 size={22} className="text-teal-600" />
              Reports by Category
            </h3>
            <Badge variant="community">Live count</Badge>
          </div>
          <div className="mt-5 space-y-3">
            {reportTrends.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-navy-600">{item.label}</span>
                  <span className="font-semibold text-navy-800">{item.count}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-navy-100">
                  <div
                    className="h-full rounded-full bg-teal-500 transition-all duration-500"
                    style={{
                      width: `${(item.count / maxReportCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trend indicators */}
        <div className="rounded-2xl bg-sand-50 p-6 shadow-sm ring-1 ring-navy-100/60">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-navy-800">
              <TrendingUp size={22} className="text-teal-600" />
              Community Trends
            </h3>
            <Badge variant="warning">Demo</Badge>
          </div>
          <div className="mt-5 space-y-3">
            {sampleTrends.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl bg-navy-50/60 p-3"
              >
                <span className="text-sm font-medium text-navy-700">
                  {item.label}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-navy-800">
                    {item.count}
                  </span>
                  <div className="flex w-12 items-center justify-end gap-1">
                    {trendIcon(item.trend)}
                    <span className="text-xs text-navy-400">
                      {item.trend === 'up'
                        ? 'Rising'
                        : item.trend === 'down'
                        ? 'Falling'
                        : 'Stable'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 ring-1 ring-amber-100">
            <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-600" />
            <p className="text-xs text-amber-700">
              Trend directions are illustrative demo values. No social media scraping is
              performed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
