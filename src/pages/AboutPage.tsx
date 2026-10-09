import SectionHeader from '@/components/SectionHeader';
import Badge from '@/components/Badge';
import {
  Info,
  Database,
  ShieldAlert,
  Code,
  Heart,
  ExternalLink,
  Compass,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="About & Data Sources"
        subtitle="Transparency about what CITYSENSE is, how it works, and where its data comes from."
        icon={<Info size={28} />}
      />

      {/* About */}
      <div className="rounded-2xl bg-sand-50 p-6 shadow-sm ring-1 ring-navy-100/60">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500 shadow-lg shadow-teal-500/20">
            <Compass size={22} className="text-white" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-navy-800">
              CITYSENSE
            </h2>
            <p className="text-sm text-navy-400">
              Built for the PromptWars Hackathon
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-navy-600">
          CITYSENSE transforms city information into actionable exploration, culture,
          affordability, and safety insights. The demo city is Pune, Maharashtra, India —
          a city with rich Maratha heritage, vibrant street culture, and rapid urban growth.
          The app works entirely in the browser with no paid APIs, no mandatory API keys,
          and no external database. All data is clearly labelled as sample, community, or
          verified so you always know the provenance of what you see.
        </p>
      </div>

      {/* Data sources */}
      <div className="rounded-2xl bg-sand-50 p-6 shadow-sm ring-1 ring-navy-100/60">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-navy-800">
          <Database size={20} className="text-teal-600" />
          Data Sources
        </h3>
        <div className="mt-4 space-y-4">
          <div className="flex items-start gap-3">
            <Badge variant="sample">Sample</Badge>
            <div>
              <p className="text-sm font-medium text-navy-700">Place data, ratings, and heritage</p>
              <p className="mt-1 text-sm text-navy-500">
                Curated sample records based on publicly available encyclopedic and tourism
                references. Ratings are illustrative community-style values, not official
                ratings. Heritage summaries reference Wikipedia and ASI for further reading.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="community">Community</Badge>
            <div>
              <p className="text-sm font-medium text-navy-700">User-submitted safety reports</p>
              <p className="mt-1 text-sm text-navy-500">
                Reports submitted through the Community Reports form are stored in your
                browser's local storage. They are not sent to any server or authority. New
                reports start as Unverified.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="warning">Demo</Badge>
            <div>
              <p className="text-sm font-medium text-navy-700">Weather, traffic, and trends</p>
              <p className="mt-1 text-sm text-navy-500">
                The Insights dashboard shows demo/snapshot values with timestamps. No live
                weather or traffic API is connected. No social media scraping is performed.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="info">Map</Badge>
            <div>
              <p className="text-sm font-medium text-navy-700">OpenStreetMap</p>
              <p className="mt-1 text-sm text-navy-500">
                Interactive map tiles are provided by OpenStreetMap. If tiles fail to load
                due to network restrictions, a list fallback and external map links are
                provided.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Safety & ethics */}
      <div className="rounded-2xl bg-red-50 p-6 ring-1 ring-red-200">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-red-800">
          <ShieldAlert size={20} />
          Safety & Ethics
        </h3>
        <ul className="mt-3 space-y-2 text-sm text-red-700">
          <li>• CITYSENSE is not an official safety authority and does not guarantee safe routes.</li>
          <li>• Incident locations are approximate — never exact coordinates.</li>
          <li>• Community reports are not sent to authorities. Use 112 for emergencies.</li>
          <li>• New reports are Unverified; status can be Under Review or Verified (illustrative).</li>
          <li>• CITYSENSE never claims official verification or fabricates official ratings.</li>
        </ul>
      </div>

      {/* Tech stack */}
      <div className="rounded-2xl bg-sand-50 p-6 shadow-sm ring-1 ring-navy-100/60">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-navy-800">
          <Code size={20} className="text-teal-600" />
          Technology
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            'React 18',
            'TypeScript',
            'Vite',
            'Tailwind CSS',
            'Leaflet',
            'OpenStreetMap',
            'lucide-react',
            'localStorage',
            'MediaRecorder API',
          ].map((tech) => (
            <span
              key={tech}
              className="rounded-lg bg-navy-50 px-3 py-1.5 text-sm font-medium text-navy-600"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* External links */}
      <div className="rounded-2xl bg-sand-50 p-6 shadow-sm ring-1 ring-navy-100/60">
        <h3 className="font-display text-lg font-semibold text-navy-800">
          Useful Pune Resources
        </h3>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            { label: 'Pune Municipal Corporation', url: 'https://pmc.gov.in/' },
            { label: 'Pune Traffic Police', url: 'https://punetrafficpolice.gov.in/' },
            { label: 'Maharashtra Tourism', url: 'https://www.maharashtratourism.gov.in/' },
            { label: 'OpenStreetMap Pune', url: 'https://www.openstreetmap.org/#map=12/18.5204/73.8567' },
          ].map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-navy-50 px-4 py-3 text-sm font-medium text-teal-700 transition-colors hover:bg-navy-100"
            >
              <ExternalLink size={16} />
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="flex items-center justify-center gap-2 py-4 text-sm text-navy-400">
        <Heart size={14} className="text-teal-500" />
        Built for Pune · PromptWars Hackathon · All data clearly labelled
      </div>
    </div>
  );
}
