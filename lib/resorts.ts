import { Resort } from '@/types';

export const RESORTS: Resort[] = [
  { name: "Palisades Tahoe", lat: 39.1968, lng: -120.2354 },
  { name: "Heavenly", lat: 38.9353, lng: -119.9400 },
  { name: "Northstar", lat: 39.2746, lng: -120.1210 },
  { name: "Kirkwood", lat: 38.6849, lng: -120.0653 },
  { name: "Mt. Rose", lat: 39.3149, lng: -119.8813 },
  { name: "Mammoth Mountain", lat: 37.6308, lng: -119.0326 },
  { name: "Park City", lat: 40.6514, lng: -111.5080 },
  { name: "Vail", lat: 39.6403, lng: -106.3742 },
  { name: "Breckenridge", lat: 39.4817, lng: -106.0384 },
  { name: "Jackson Hole", lat: 43.5877, lng: -110.8279 },
  { name: "Aspen Snowmass", lat: 39.2084, lng: -106.9490 },
  { name: "Telluride", lat: 37.9375, lng: -107.8123 },
  { name: "Big Sky", lat: 45.2618, lng: -111.4010 },
  { name: "Steamboat", lat: 40.4572, lng: -106.8045 },
  { name: "Deer Valley", lat: 40.6375, lng: -111.4783 },
];

export function getResortByName(name: string): Resort | undefined {
  return RESORTS.find(r => r.name === name);
}
