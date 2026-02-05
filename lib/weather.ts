import { WeatherData, HourlyForecast } from '@/types';

const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1/forecast';

interface OpenMeteoResponse {
  current_weather: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    time: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    precipitation: number[];
    rain: number[];
    snowfall: number[];
    snow_depth: number[];
    visibility: number[];
    windspeed_10m: number[];
    weathercode: number[];
  };
}

export async function fetchWeather(lat: number, lng: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    hourly: 'temperature_2m,apparent_temperature,precipitation,rain,snowfall,snow_depth,visibility,windspeed_10m,weathercode',
    current_weather: 'true',
    temperature_unit: 'fahrenheit',
    windspeed_unit: 'mph',
    timezone: 'auto',
    forecast_days: '3',
  });

  const response = await fetch(`${OPEN_METEO_BASE}?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data: OpenMeteoResponse = await response.json();
  return parseWeatherData(data);
}

function parseWeatherData(data: OpenMeteoResponse): WeatherData {
  const { current_weather, hourly } = data;
  const now = new Date();
  const currentHourIndex = hourly.time.findIndex(t => new Date(t) >= now) - 1;
  const idx = Math.max(0, currentHourIndex);

  // Calculate snowfall in last 24 hours
  const last24hStart = Math.max(0, idx - 24);
  const snowfallLast24h = hourly.snowfall
    .slice(last24hStart, idx + 1)
    .reduce((sum, val) => sum + (val || 0), 0);

  // Calculate snowfall in next 48 hours
  const snowfallNext48h = hourly.snowfall
    .slice(idx, idx + 48)
    .reduce((sum, val) => sum + (val || 0), 0);

  // Get next 12 hours forecast
  const hourlyForecast: HourlyForecast[] = hourly.time
    .slice(idx, idx + 12)
    .map((time, i) => ({
      time: new Date(time),
      temperature: Math.round(hourly.temperature_2m[idx + i]),
      weatherCode: hourly.weathercode[idx + i],
      windSpeed: Math.round(hourly.windspeed_10m[idx + i]),
      snowfall: hourly.snowfall[idx + i] || 0,
    }));

  const weatherCode = current_weather.weathercode;
  const isSnowing = [71, 73, 75, 77, 85, 86].includes(weatherCode);
  const isRaining = [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode);

  return {
    temperature: Math.round(current_weather.temperature),
    feelsLike: Math.round(hourly.apparent_temperature[idx]),
    windSpeed: Math.round(current_weather.windspeed),
    windDirection: current_weather.winddirection,
    weatherCode,
    visibility: hourly.visibility[idx] || 10000,
    isSnowing,
    isRaining,
    snowfallLast24h: Math.round(snowfallLast24h * 10) / 10,
    snowDepth: Math.round((hourly.snow_depth[idx] || 0) * 10) / 10,
    hourlyForecast,
    snowfallNext48h: Math.round(snowfallNext48h * 10) / 10,
    lastUpdated: new Date(),
  };
}

// WMO Weather Code to icon mapping
export function getWeatherIcon(code: number): string {
  const iconMap: Record<number, string> = {
    0: '☀️',   // Clear sky
    1: '🌤️',   // Mainly clear
    2: '⛅',   // Partly cloudy
    3: '☁️',   // Overcast
    45: '🌫️',  // Fog
    48: '🌫️',  // Depositing rime fog
    51: '🌧️',  // Light drizzle
    53: '🌧️',  // Moderate drizzle
    55: '🌧️',  // Dense drizzle
    61: '🌧️',  // Slight rain
    63: '🌧️',  // Moderate rain
    65: '🌧️',  // Heavy rain
    71: '🌨️',  // Slight snow
    73: '🌨️',  // Moderate snow
    75: '❄️',   // Heavy snow
    77: '🌨️',  // Snow grains
    80: '🌧️',  // Slight rain showers
    81: '🌧️',  // Moderate rain showers
    82: '🌧️',  // Violent rain showers
    85: '🌨️',  // Slight snow showers
    86: '❄️',   // Heavy snow showers
    95: '⛈️',   // Thunderstorm
    96: '⛈️',   // Thunderstorm with slight hail
    99: '⛈️',   // Thunderstorm with heavy hail
  };
  return iconMap[code] || '🌤️';
}

export function getWeatherDescription(code: number): string {
  const descMap: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Rime fog',
    51: 'Light drizzle',
    53: 'Drizzle',
    55: 'Dense drizzle',
    61: 'Light rain',
    63: 'Rain',
    65: 'Heavy rain',
    71: 'Light snow',
    73: 'Snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Rain showers',
    81: 'Rain showers',
    82: 'Heavy showers',
    85: 'Snow showers',
    86: 'Heavy snow',
    95: 'Thunderstorm',
    96: 'Thunderstorm',
    99: 'Thunderstorm',
  };
  return descMap[code] || 'Unknown';
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}
