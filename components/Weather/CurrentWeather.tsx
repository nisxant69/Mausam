import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Droplets, Wind, MapPin, Info, Sunrise, Sunset, Clock } from "lucide-react";
import { Suggestion } from "@/types/types";
import { getWeatherGradient } from "@/lib/utils";
import AnimatedWeatherIcon from "./AnimatedWeatherIcon";

type CurrentWeatherProps = {
  weather: any;
  loading: boolean;
  unit: "C" | "F";
  favorites: Suggestion[];
  toggleFavorite: (loc: Suggestion) => void;
  lastUpdated?: Date | null;
};

// Helper: Format relative time
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 120) return "1 min ago";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 7200) return "1 hour ago";
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return date.toLocaleDateString();
};

// HELPER: Reusable Info Label with Tooltip
const InfoLabel = ({
  label,
  tooltipText,
}: {
  label: string;
  tooltipText: string;
}) => (
  <div className="flex items-center gap-1.5 mb-1">
    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
      {label}
    </span>
    {/* Local TooltipProvider ensures it works even if not in global layout */}
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* FIX: Removed opacity/40, made cursor help, added hover effect */}
          <div className="cursor-help p-0.5 rounded-full hover:bg-muted transition-colors">
            <Info className="w-3 h-3 text-muted-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-[200px] text-xs font-medium"
        >
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
);

export default function CurrentWeather({
  weather,
  loading,
  unit,
  favorites,
  toggleFavorite,
  lastUpdated,
}: CurrentWeatherProps) {
  if (loading || !weather) {
    return (
      <Card className="h-[400px] w-full rounded-xl border bg-card">
        <CardHeader className="px-6 pt-5 pb-0">
          <div className="animate-pulse space-y-2">
            <div className="h-6 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </CardHeader>
        <CardContent className="px-6 pt-8 pb-5">
          <div className="animate-pulse space-y-6">
            <div className="flex justify-between items-end">
              <div className="h-16 bg-muted rounded w-24" />
              <div className="h-8 bg-muted rounded w-16" />
            </div>
            <div className="h-px w-full bg-muted" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-14 bg-muted rounded" />
              <div className="h-14 bg-muted rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const temp = Math.round(
    unit === "C" ? weather.main.temp : (weather.main.temp * 9) / 5 + 32
  );
  const feelsLike = Math.round(
    unit === "C"
      ? weather.main.feels_like
      : (weather.main.feels_like * 9) / 5 + 32
  );

  const isFavorite = favorites.some((f) => f.display === weather.displayName);

  // Format sunrise/sunset times with AM/PM
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  };
  const sunrise = weather.sys?.sunrise ? formatTime(weather.sys.sunrise) : null;
  const sunset = weather.sys?.sunset ? formatTime(weather.sys.sunset) : null;

  // Weather icon URL from OpenWeatherMap
  const weatherIcon = weather.weather?.[0]?.icon
    ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    : null;

  // Scroll tracking for indicator dots
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const totalItems = 2 + (sunrise ? 1 : 0) + (sunset ? 1 : 0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const itemWidth = container.scrollWidth / totalItems;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(Math.min(newIndex, totalItems - 1));
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [totalItems]);

  // Detect if it's night time based on sunrise/sunset
  const now = Date.now() / 1000;
  const isNight = weather.sys?.sunrise && weather.sys?.sunset
    ? (now < weather.sys.sunrise || now > weather.sys.sunset)
    : false;

  // Get weather-based gradient
  const weatherId = weather.weather?.[0]?.id || 800;
  const gradientClass = getWeatherGradient(weatherId, isNight);

  return (
    <Card className={`h-[400px] flex flex-col relative shadow-lg border-0 overflow-hidden group ${gradientClass}`}>
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40 z-0" />
      {/* Background Decoration */}
      <div className="absolute -top-12 -right-12 opacity-[0.03] pointer-events-none transition-transform group-hover:scale-110 duration-700">
        <MapPin className="w-64 h-64" />
      </div>

      {/* HEADER */}
      <CardHeader className="relative z-10 px-6 pt-5 pb-0 shrink-0">
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1 flex-1 min-w-0">
            <CardTitle
              className="text-xl md:text-2xl font-bold leading-tight break-words pr-1 line-clamp-4 text-white drop-shadow-sm"
              title={weather.displayName}
            >
              {weather.displayName}
            </CardTitle>

            <div className="flex items-center gap-2">
              <AnimatedWeatherIcon
                weatherId={weatherId}
                isNight={isNight}
                size="sm"
              />
              <p className="text-sm text-white/80 capitalize font-medium drop-shadow-sm">
                {weather.weather[0].description}
              </p>
            </div>

            {lastUpdated && (
              <div className="flex items-center gap-1.5 mt-1 text-white/60">
                <Clock className="w-3 h-3" />
                <span className="text-[10px] font-medium">
                  Updated {formatRelativeTime(lastUpdated)}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() =>
              toggleFavorite({
                display: weather.displayName,
                lat: weather.coord.lat,
                lng: weather.coord.lon,
              })
            }
            className="p-2 shrink-0 rounded-full hover:bg-muted/80 transition-all active:scale-95 border border-transparent hover:border-border mt-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isFavorite ? "gold" : "none"}
              stroke="currentColor"
              className={`w-5 h-5 ${isFavorite ? "text-yellow-500" : "text-muted-foreground"}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        </div>
      </CardHeader>

      {/* MAIN CONTENT */}
      <CardContent className="relative z-10 flex-grow flex flex-col justify-end px-6 pb-5 gap-6">
        {/* Temp & Status Block */}
        <div className="flex items-end justify-between w-full">
          <div className="flex items-start">
            <span className="text-7xl font-bold tracking-tighter leading-none text-white drop-shadow-md">
              {temp}
            </span>
            <span className="text-3xl font-light text-white/70 mt-1.5 ml-1 drop-shadow-sm">
              °{unit}
            </span>
          </div>

          <div className="flex flex-col items-end mb-1.5 gap-2">
            {/* Thresholds: Hot = 30°C/86°F, Cool = 20°C/68°F */}
            {temp > (unit === "C" ? 30 : 86) ? (
              <span className="bg-orange-500/30 text-white text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide border border-white/30 backdrop-blur-sm">
                Hot
              </span>
            ) : temp < (unit === "C" ? 20 : 68) ? (
              <span className="bg-blue-500/30 text-white text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide border border-white/30 backdrop-blur-sm">
                Cool
              </span>
            ) : (
              <span className="bg-green-500/30 text-white text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide border border-white/30 backdrop-blur-sm">
                Comfy
              </span>
            )}
            <span className="text-xs font-medium text-white/80 whitespace-nowrap drop-shadow-sm">
              Feels like {feelsLike}°
            </span>
          </div>
        </div>

        <div className="h-px w-full bg-white/20" />

        {/* Bottom Stats - Horizontal Scroll */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
        >
          {/* Humidity */}
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors shrink-0 snap-start">
            <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/30">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1">Humidity</span>
              <p className="text-lg font-extrabold leading-none tracking-tight text-white">{weather.main.humidity}%</p>
            </div>
          </div>

          {/* Wind */}
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors shrink-0 snap-start">
            <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/30">
              <Wind className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1">Wind</span>
              <p className="text-lg font-extrabold leading-none tracking-tight text-white">{weather.wind.speed} m/s</p>
            </div>
          </div>

          {/* Sunrise */}
          {sunrise && (
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors shrink-0 snap-start">
              <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/30">
                <Sunrise className="w-5 h-5 text-orange-300" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1">Sunrise</span>
                <p className="text-lg font-extrabold leading-none tracking-tight text-white">{sunrise}</p>
              </div>
            </div>
          )}

          {/* Sunset */}
          {sunset && (
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors shrink-0 snap-start">
              <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/30">
                <Sunset className="w-5 h-5 text-indigo-300" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1">Sunset</span>
                <p className="text-lg font-extrabold leading-none tracking-tight text-white">{sunset}</p>
              </div>
            </div>
          )}
        </div>

        {/* Scroll indicator dots */}
        <div className="flex justify-center gap-1.5 -mt-1">
          {Array.from({ length: totalItems }).map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${i === activeIndex ? "bg-white/70" : "bg-white/25"
                }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


