"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Wind, Eye, MapPin, RefreshCw } from 'lucide-react';
import { WeatherData } from '@/types';
import { getWeatherIcon, getWeatherDescription, getWindDirection } from '@/lib/weather';

interface WeatherHeroProps {
  weather: WeatherData | null;
  loading: boolean;
  resortName: string;
  onRefresh: () => void;
}

export function WeatherHero({ weather, loading, resortName, onRefresh }: WeatherHeroProps) {
  if (loading || !weather) {
    return (
      <Card className="glass">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-16 w-24" />
            <Skeleton className="h-4 w-48" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <Card className="glass overflow-hidden">
      <CardContent className="p-6 space-y-4">
        {/* Location and Update */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">{resortName}</span>
          </div>
          <button
            onClick={onRefresh}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Main Temperature Display */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl font-bold font-display">{weather.feelsLike}</span>
              <span className="text-2xl text-muted-foreground">°F</span>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Actual: {weather.temperature}°F
            </p>
          </div>
          <div className="text-right">
            <span className="text-5xl">{getWeatherIcon(weather.weatherCode)}</span>
            <p className="text-sm text-muted-foreground mt-1">
              {getWeatherDescription(weather.weatherCode)}
            </p>
          </div>
        </div>

        {/* Wind and Visibility */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wind className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{weather.windSpeed} mph</p>
              <p className="text-xs text-muted-foreground">
                Wind {getWindDirection(weather.windDirection)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">
                {weather.visibility > 10000 ? '10+' : Math.round(weather.visibility / 1000)} km
              </p>
              <p className="text-xs text-muted-foreground">Visibility</p>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <p className="text-xs text-muted-foreground text-center pt-2">
          Updated {formatTime(weather.lastUpdated)}
        </p>
      </CardContent>
    </Card>
  );
}
