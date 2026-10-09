import type { SafetyReport, WeatherData, TrafficData, TrendItem } from '@/types';

export const sampleSafetyReports: SafetyReport[] = [
  {
    id: 'sr-001',
    category: 'Lighting Issue',
    description: 'Street lights not working on a stretch of FC Road near the college gate after 9 PM.',
    location: 'FC Road, Shivajinagar',
    timestamp: Date.now() - 1000 * 60 * 60 * 20,
    status: 'Under Review',
    source: 'sample',
  },
  {
    id: 'sr-002',
    category: 'Road Safety',
    description: 'Pothole near Aundh Gaon signal causing two-wheeler swerves during morning commute.',
    location: 'Aundh Gaon, Baner Road',
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    status: 'Unverified',
    source: 'sample',
  },
  {
    id: 'sr-003',
    category: 'Theft',
    description: 'Phone snatching reported from crowded market lane near Deccan Gymkhana, evening hours.',
    location: 'Deccan Gymkhana Market',
    timestamp: Date.now() - 1000 * 60 * 60 * 72,
    status: 'Verified',
    source: 'sample',
  },
  {
    id: 'sr-004',
    category: 'Public Nuisance',
    description: 'Loud music from a pub in Koregaon Park Lane 5 past 1 AM on a Saturday.',
    location: 'Koregaon Park, Lane 5',
    timestamp: Date.now() - 1000 * 60 * 60 * 96,
    status: 'Unverified',
    source: 'sample',
  },
  {
    id: 'sr-005',
    category: 'Harassment',
    description: 'Unverified report of eve-teasing near a bus stop in Hadapsar around 8 PM.',
    location: 'Hadapsar Bus Stand',
    timestamp: Date.now() - 1000 * 60 * 60 * 120,
    status: 'Under Review',
    source: 'sample',
  },
];

export const sampleWeather: WeatherData = {
  tempC: 27,
  condition: 'Partly Cloudy',
  humidity: 65,
  windKph: 12,
  isDemo: true,
  updatedAt: Date.now(),
};

export const sampleTraffic: TrafficData[] = [
  { route: 'Hinjewadi \u2013 Baner (NH-48)', congestionLevel: 'Heavy', isDemo: true, updatedAt: Date.now() },
  { route: 'Kothrud \u2014 Deccan \u2014 FC Road', congestionLevel: 'Moderate', isDemo: true, updatedAt: Date.now() },
  { route: 'Koregaon Park \u2014 Camp', congestionLevel: 'Low', isDemo: true, updatedAt: Date.now() },
  { route: 'Viman Nagar \u2014 Airport Road', congestionLevel: 'Moderate', isDemo: true, updatedAt: Date.now() },
];

export const sampleTrends: TrendItem[] = [
  { label: 'Cleanliness reports', count: 42, trend: 'up' },
  { label: 'Lighting issues', count: 28, trend: 'up' },
  { label: 'Road safety reports', count: 19, trend: 'stable' },
  { label: 'Theft reports', count: 11, trend: 'down' },
  { label: 'Public nuisance', count: 8, trend: 'down' },
];
