"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { WeatherData } from '@/types';
import { calculateSendIt } from '@/lib/send-it-calculator';

interface SendItMeterProps {
  weather: WeatherData | null;
  loading: boolean;
}

export function SendItMeter({ weather, loading }: SendItMeterProps) {
  if (loading || !weather) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  const { score, label, color } = calculateSendIt(weather);
  const percentage = (score / 10) * 100;

  // Gradient colors based on score
  const getGradientStyle = () => {
    if (score <= 3) return 'bg-gradient-to-r from-red-500 to-red-400';
    if (score <= 5) return 'bg-gradient-to-r from-amber-500 to-amber-400';
    if (score <= 7) return 'bg-gradient-to-r from-green-500 to-green-400';
    return 'bg-gradient-to-r from-primary to-cyan-400';
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Send It Meter</h3>
            <p className={`text-2xl font-bold font-display ${color}`}>{label}</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-bold font-display">{score}</span>
            <span className="text-lg text-muted-foreground">/10</span>
          </div>
        </div>

        {/* Custom gradient progress bar */}
        <div className="relative h-3 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${getGradientStyle()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Factor breakdown */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs text-muted-foreground">
          <div className={weather.snowfallLast24h > 2 ? 'text-green-400' : ''}>
            <span className="block text-lg">
              {weather.snowfallLast24h > 6 ? '❄️' : weather.snowfallLast24h > 2 ? '🌨️' : '☁️'}
            </span>
            Snow
          </div>
          <div className={weather.windSpeed < 15 ? 'text-green-400' : weather.windSpeed > 25 ? 'text-red-400' : ''}>
            <span className="block text-lg">
              {weather.windSpeed < 15 ? '🍃' : weather.windSpeed > 25 ? '💨' : '🌬️'}
            </span>
            Wind
          </div>
          <div className={weather.visibility > 10000 ? 'text-green-400' : weather.visibility < 2000 ? 'text-red-400' : ''}>
            <span className="block text-lg">
              {weather.visibility > 10000 ? '👁️' : weather.visibility < 2000 ? '🌫️' : '⛅'}
            </span>
            Vis
          </div>
          <div className={weather.feelsLike >= 15 && weather.feelsLike <= 35 ? 'text-green-400' : ''}>
            <span className="block text-lg">
              {weather.feelsLike >= 15 && weather.feelsLike <= 35 ? '😎' : weather.feelsLike < 10 ? '🥶' : '😰'}
            </span>
            Temp
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
