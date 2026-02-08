import { Timestamp } from 'firebase/firestore';

export interface Trip {
  id: string;
  name: string;
  resort: string;
  location: { lat: number; lng: number };
  startDate: Timestamp;
  endDate: Timestamp;
  inviteCode: string;
  createdBy: string;
  members: string[];
}

export interface Run {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  trailName: string;
  difficulty: 'green' | 'blue' | 'black' | 'double-black';
  verticalFeet: number;
  timestamp: Timestamp;
  notes?: string;
}

export interface BetSide {
  uid: string;
  name: string;
  photo: string;
}

export interface Bet {
  id: string;
  proposedBy: string;
  proposerName: string;
  proposerPhoto: string;
  description: string;
  stakes: string;
  status: 'open' | 'active' | 'resolved' | 'cancelled';
  sides: {
    for: BetSide[];
    against: BetSide[];
  };
  resolvedOutcome: 'for' | 'against' | null;
  resolveVotes: Record<string, 'for' | 'against'>;
  createdAt: Timestamp;
  resolvedAt: Timestamp | null;
}

export interface Award {
  odId: string | null;
  votes: Record<string, string>;
}

export interface DailyAwards {
  mvp: Award;
  yardSale: Award;
  sendIt: Award;
}

export interface Resort {
  name: string;
  lat: number;
  lng: number;
}

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  visibility: number;
  isSnowing: boolean;
  isRaining: boolean;
  snowfallLast24h: number;
  snowDepth: number;
  hourlyForecast: HourlyForecast[];
  snowfallNext48h: number;
  lastUpdated: Date;
}

export interface HourlyForecast {
  time: Date;
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  snowfall: number;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  nickname?: string;
  email: string;
  photoURL: string;
  currentTrip?: string;
}
