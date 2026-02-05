"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Snowflake, Mountain, TrendingUp } from 'lucide-react';
import { WeatherData } from '@/types';

interface SnowReportProps {
  weather: WeatherData | null;
  loading: boolean;
}

export function SnowReport({ weather, loading }: SnowReportProps) {
  if (loading || !weather) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Snow Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      label: '24hr Snow',
      value: weather.snowfallLast24h,
      unit: '"',
      icon: Snowflake,
      highlight: weather.snowfallLast24h >= 6,
    },
    {
      label: 'Snow Depth',
      value: Math.round(weather.snowDepth),
      unit: '"',
      icon: Mountain,
      highlight: false,
    },
    {
      label: '48hr Forecast',
      value: weather.snowfallNext48h,
      unit: '"',
      icon: TrendingUp,
      highlight: weather.snowfallNext48h >= 6,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Snowflake className="w-4 h-4" />
          Snow Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {stats.map(({ label, value, unit, icon: Icon, highlight }) => (
            <div key={label} className="text-center">
              <div className={`flex items-center justify-center gap-1 ${highlight ? 'text-primary' : ''}`}>
                <span className="text-2xl font-bold font-display">{value}</span>
                <span className="text-sm text-muted-foreground">{unit}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>
        {weather.snowfallLast24h >= 6 && (
          <div className="mt-4 p-3 rounded-lg bg-primary/10 text-center">
            <span className="text-sm font-medium text-primary">
              ❄️ Fresh powder alert! {weather.snowfallLast24h}&quot; in the last 24 hours
            </span>
          </div>
        )}
        {weather.snowfallNext48h >= 6 && weather.snowfallLast24h < 6 && (
          <div className="mt-4 p-3 rounded-lg bg-secondary/10 text-center">
            <span className="text-sm font-medium text-secondary">
              🌨️ Storm incoming! {weather.snowfallNext48h}&quot; expected
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
