import { WeatherData } from '@/types';

export interface SendItResult {
  score: number;
  label: string;
  color: string;
}

export function calculateSendIt(weather: WeatherData): SendItResult {
  let score = 5; // baseline

  // Fresh snow (biggest factor)
  if (weather.snowfallLast24h > 12) score += 3;
  else if (weather.snowfallLast24h > 6) score += 2;
  else if (weather.snowfallLast24h > 2) score += 1;

  // Wind
  if (weather.windSpeed < 10) score += 1;
  else if (weather.windSpeed > 30) score -= 2;
  else if (weather.windSpeed > 20) score -= 1;

  // Visibility
  if (weather.visibility > 10000) score += 1;
  else if (weather.visibility < 1000) score -= 2;

  // Temperature sweet spot (20-32°F)
  if (weather.feelsLike >= 20 && weather.feelsLike <= 32) score += 1;
  else if (weather.feelsLike < 5 || weather.feelsLike > 40) score -= 1;

  // Active conditions
  if (weather.isSnowing) score += 0.5;
  if (weather.isRaining) score -= 3;

  const finalScore = Math.max(1, Math.min(10, Math.round(score)));

  return {
    score: finalScore,
    label: getLabel(finalScore),
    color: getColor(finalScore),
  };
}

function getLabel(score: number): string {
  if (score <= 2) return 'Stay in bed';
  if (score <= 3) return 'Coffee first';
  if (score <= 4) return 'Meh';
  if (score <= 5) return 'Decent';
  if (score <= 6) return "Let's ride";
  if (score <= 7) return 'Looking good';
  if (score <= 8) return 'Send it!';
  if (score <= 9) return 'SEND IT!';
  return 'EPIC DAY';
}

function getColor(score: number): string {
  if (score <= 3) return 'text-red-400';
  if (score <= 5) return 'text-amber-400';
  if (score <= 7) return 'text-green-400';
  return 'text-primary';
}
