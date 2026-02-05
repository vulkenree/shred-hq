"use client";

import { useState, useEffect, useCallback } from 'react';
import { fetchWeather } from '@/lib/weather';
import { WeatherData } from '@/types';

interface UseWeatherResult {
  weather: WeatherData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useWeather(lat: number, lng: number): UseWeatherResult {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!lat || !lng) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeather(lat, lng);
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch weather'));
    } finally {
      setLoading(false);
    }
  }, [lat, lng]);

  useEffect(() => {
    fetchData();

    // Refresh weather data every 10 minutes
    const interval = setInterval(fetchData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { weather, loading, error, refetch: fetchData };
}
