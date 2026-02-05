"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { WeatherData } from '@/types';
import { getWeatherIcon } from '@/lib/weather';

interface HourlyForecastProps {
  weather: WeatherData | null;
  loading: boolean;
}

export function HourlyForecast({ weather, loading }: HourlyForecastProps) {
  if (loading || !weather) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Hourly Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 min-w-[60px]">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatHour = (date: Date) => {
    const now = new Date();
    const isCurrentHour = date.getHours() === now.getHours();
    if (isCurrentHour) return 'Now';
    return date.toLocaleTimeString('en-US', { hour: 'numeric' });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Next 12 Hours</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 snap-x snap-mandatory">
          {weather.hourlyForecast.map((hour, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-1.5 min-w-[60px] snap-start"
            >
              <span className="text-xs text-muted-foreground">
                {formatHour(hour.time)}
              </span>
              <span className="text-2xl">{getWeatherIcon(hour.weatherCode)}</span>
              <span className="font-medium">{hour.temperature}°</span>
              {hour.snowfall > 0 && (
                <span className="text-xs text-primary">
                  +{hour.snowfall.toFixed(1)}&quot;
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                {hour.windSpeed} mph
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
