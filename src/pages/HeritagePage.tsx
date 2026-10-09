import { useState } from 'react';
import { heritageLandmarks } from '@/data/heritage';
import SectionHeader from '@/components/SectionHeader';
import Badge from '@/components/Badge';
import { Landmark, ExternalLink, ChevronDown, MapPin, Calendar, BookOpen } from 'lucide-react';

export default function HeritagePage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Heritage"
        subtitle="Pune's historic landmarks with accurate context, timelines, and further reading."
        icon={<Landmark size={28} />}
      />

      <div className="flex items-center gap-2 rounded-xl bg-teal-50 p-3 ring-1 ring-teal-200">
        <Badge variant="info">Sources</Badge>
        <p className="text-xs text-teal-800">
          Historical summaries are based on publicly available encyclopedic references.
          Links to Wikipedia and ASI are provided for further reading.
        </p>
      </div>

      <div className="space-y-4">
        {heritageLandmarks.map((landmark) => {
          const expanded = expandedId === landmark.id;
          return (
            <article
              key={landmark.id}
              className="overflow-hidden rounded-2xl bg-sand-50 shadow-sm ring-1 ring-navy-100/60 transition-all hover:shadow-md"
            >
              {/* Banner */}
              <div className="relative h-40 overflow-hidden bg-gradient-to-br from-navy-200 via-navy-300 to-teal-200 sm:h-48">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Landmark size={48} className="text-white/30" />
                </div>
                <div className="absolute left-4 bottom-4">
                  <h2 className="font-display text-xl font-bold text-sand-50 drop-shadow sm:text-2xl">
                    {landmark.name}
                  </h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1 rounded-full bg-navy-900/70 px-2.5 py-0.5 text-xs font-medium text-sand-50 backdrop-blur-sm">
                      <Calendar size={11} />
                      {landmark.yearBuilt}
                    </span>
                    <span className="rounded-full bg-teal-500/90 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                      {landmark.era}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <p className="text-sm font-medium text-navy-600">{landmark.summary}</p>

                <div className="mt-3 flex items-center gap-2 text-xs text-navy-400">
                  <MapPin size={12} className="text-teal-600" />
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${landmark.lat}&mlon=${landmark.lng}#map=16/${landmark.lat}/${landmark.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-teal-600 hover:text-teal-700"
                  >
                    View location on map
                    <ExternalLink size={11} className="ml-1 inline" />
                  </a>
                </div>

                <button
                  onClick={() => setExpandedId(expanded ? null : landmark.id)}
                  className="mt-4 flex items-center gap-1.5 text-sm font-medium text-teal-600 transition-colors hover:text-teal-700"
                >
                  {expanded ? 'Hide details' : 'Read history & timeline'}
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {expanded && (
                  <div className="mt-4 space-y-5 animate-slide-down">
                    <div>
                      <h3 className="text-sm font-semibold text-navy-700">History</h3>
                      <p className="mt-2 text-sm leading-relaxed text-navy-600">
                        {landmark.history}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-navy-700">Timeline</h3>
                      <div className="mt-3 space-y-3">
                        {landmark.timeline.map((item, idx) => (
                          <div key={idx} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-xs font-bold text-white">
                                {idx + 1}
                              </div>
                              {idx < landmark.timeline.length - 1 && (
                                <div className="h-full w-0.5 flex-1 bg-navy-100" />
                              )}
                            </div>
                            <div className="pb-2">
                              <span className="text-sm font-semibold text-teal-700">
                                {item.year}
                              </span>
                              <p className="text-sm text-navy-600">{item.event}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="flex items-center gap-1.5 text-sm font-semibold text-navy-700">
                        <BookOpen size={15} className="text-teal-600" />
                        Further Reading
                      </h3>
                      <div className="mt-2 flex flex-col gap-2">
                        {landmark.furtherReading.map((link) => (
                          <a
                            key={link.url}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-lg bg-navy-50 px-3 py-2 text-sm text-teal-700 transition-colors hover:bg-navy-100"
                          >
                            <ExternalLink size={14} />
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
