export type Category =
  | 'Attraction'
  | 'Food'
  | 'Shopping'
  | 'Park'
  | 'Museum'
  | 'Heritage'
  | 'Transport'
  | 'Nightlife';

export type Budget = 'Free' | 'Budget' | 'Mid-range' | 'Premium';

export type DataProvenance = 'sample' | 'community' | 'verified';

export interface Place {
  id: string;
  name: string;
  category: Category;
  budget: Budget;
  lat: number;
  lng: number;
  address: string;
  shortDesc: string;
  longDesc: string;
  rating: number;          // 0-5, community/sample
  ratingProvenance: DataProvenance;
  ratingCount: number;
  cleanliness: number;     // 1-5
  accessibility: number;   // 1-5
  tags: string[];
  imageQuery: string;      // for stock photos
  hours: string;
  entryFee: string;
  bestTimeToVisit: string;
  source: string;
  externalLink?: string;
}

export type IncidentStatus = 'Unverified' | 'Under Review' | 'Verified';
export type IncidentCategory =
  | 'Theft'
  | 'Harassment'
  | 'Road Safety'
  | 'Public Nuisance'
  | 'Lighting Issue'
  | 'Other';

export interface SafetyReport {
  id: string;
  category: IncidentCategory;
  description: string;
  location: string;
  lat?: number;
  lng?: number;
  timestamp: number;
  status: IncidentStatus;
  source: 'community' | 'sample';
  imageDataUrl?: string;
  hasVoiceNote?: boolean;
  voiceNoteName?: string;
}

export interface HeritageLandmark {
  id: string;
  name: string;
  yearBuilt: string;
  era: string;
  lat: number;
  lng: number;
  summary: string;
  history: string;
  timeline: { year: string; event: string }[];
  furtherReading: { label: string; url: string }[];
  imageQuery: string;
}

export type WeatherData = {
  tempC: number;
  condition: string;
  humidity: number;
  windKph: number;
  isDemo: boolean;
  updatedAt: number;
};

export type TrafficData = {
  route: string;
  congestionLevel: 'Low' | 'Moderate' | 'Heavy';
  isDemo: boolean;
  updatedAt: number;
};

export type TrendItem = {
  label: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
};

export type PageKey =
  | 'discover'
  | 'map'
  | 'safety'
  | 'compare'
  | 'heritage'
  | 'reports'
  | 'insights'
  | 'about';
