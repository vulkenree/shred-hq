"use client";

import { Snowflake } from 'lucide-react';
import { useTrip } from '@/lib/trip-context';
import { useWeather } from '@/hooks/use-weather';
import { WeatherHero } from '@/components/mountain/weather-hero';
import { SendItMeter } from '@/components/mountain/send-it-meter';
import { HourlyForecast } from '@/components/mountain/hourly-forecast';
import { SnowReport } from '@/components/mountain/snow-report';

export default function MountainPage() {
  const { trip, loading: tripLoading } = useTrip();
  const { weather, loading: weatherLoading, refetch } = useWeather(
    trip?.location?.lat || 0,
    trip?.location?.lng || 0
  );

  if (tripLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Snowflake className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-6">
        <p className="text-muted-foreground">Trip not found</p>
      </div>
    );
  }

  const loading = weatherLoading || !trip.location;

  return (
    <div className="p-4 space-y-4">
      <WeatherHero
        weather={weather}
        loading={loading}
        resortName={trip.resort}
        onRefresh={refetch}
      />

      <SendItMeter weather={weather} loading={loading} />

      <HourlyForecast weather={weather} loading={loading} />

      <SnowReport weather={weather} loading={loading} />
    </div>
  );
}
