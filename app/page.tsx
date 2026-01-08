"use client";

import { useState, useEffect, Suspense, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import SearchBar from "@/components/Search/SearchBar";
import AutocompleteDropdown from "@/components/Search/AutocompleteDropdown";
import CurrentWeather from "@/components/Weather/CurrentWeather";
import ProForecast from "@/components/Weather/ProForecast";
import LifestyleGrid from "@/components/Weather/LifestyleGrid";
import WelcomeState from "@/components/Weather/WelcomeState";
import Footer from "@/components/Footer";
import OfflineBanner from "@/components/OfflineBanner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/hooks/useSearch";
import { useWeather } from "@/hooks/useWeather";
import { useOffline } from "@/hooks/useOffline";
import { toast } from "sonner";
import { ModeToggle } from "@/components/ModeToggle";
import MapLegend from "@/components/MapLegend";
import { Suggestion } from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getFavorites, addFavorite, removeFavorite } from "@/lib/favorites";
import {
  Locate,
  Star,
  CloudRain,
  Wind,
  Thermometer,
  Cloud,
} from "lucide-react";

// Search input ref for keyboard shortcut
let searchInputRef: HTMLInputElement | null = null;

const WeatherMap = dynamic(() => import("@/components/Weather/WeatherMap"), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full rounded-xl" />,
});

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-muted rounded-md ${className}`} />
);

type MapLayerType =
  | "temp_new"
  | "precipitation_new"
  | "clouds_new"
  | "wind_new";

// Loading skeleton for Suspense fallback
const PageLoadingSkeleton = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <div className="flex-grow p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-[60vh] w-full rounded-xl" />
      </div>
    </div>
  </div>
);

// Main page wrapper with Suspense
export default function Page() {
  return (
    <Suspense fallback={<PageLoadingSkeleton />}>
      <PageContent />
    </Suspense>
  );
}

function PageContent() {
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [mapLayer, setMapLayer] = useState<MapLayerType>("temp_new");
  const [favorites, setFavorites] = useState<Suggestion[]>(() =>
    getFavorites()
  );

  // States for loading and GPS tracking
  const [isLocating, setIsLocating] = useState(false);
  const [isGPS, setIsGPS] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<[number, number] | null>(null);

  const toggleFavorite = (loc: Suggestion) => {
    const isFav = favorites.some((f) => f.display === loc.display);
    if (isFav) {
      removeFavorite(loc);
      setFavorites((prev) => prev.filter((f) => f.display !== loc.display));
      toast.success("Removed from favorites");
    } else {
      addFavorite(loc);
      setFavorites((prev) => [...prev, loc]);
      toast.success("Added to favorites");
    }
  };

  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    input,
    suggestions,
    selected,
    loadingSuggestions,
    onChange,
    pickSuggestion,
    setSuggestions,
  } = useSearch();

  const {
    weather,
    loadingWeather,
    fiveDayForecast,
    twelveHourForecast,
    lastUpdated,
    getWeather,
    get5DayForecast,
    get12HourForecast,
    setError: setWeatherError,
  } = useWeather(selected, input);

  const { isOffline } = useOffline();

  useEffect(() => {
    if (weather) {
      toast.dismiss();
      get5DayForecast();
      get12HourForecast();
      setIsLocating(false);
    }
  }, [weather]);

  // Load weather from URL params on mount
  useEffect(() => {
    const location = searchParams.get("location");
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (lat && lon) {
      // If coordinates are provided, use them directly
      const displayName = location || "Selected Location";
      setIsLocating(true);
      getWeather(parseFloat(lat), parseFloat(lon), displayName).finally(() =>
        setIsLocating(false)
      );
    } else if (location) {
      // If only location name is provided, search for it
      setIsLocating(true);
      // Use the popular cities first, then fall back to geocoding
      handlePopularCityFromURL(location);
    }
  }, []); // Only run on mount

  // Keyboard shortcuts: / to focus search, L for location
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === "/") {
        e.preventDefault();
        searchInputRef?.focus();
      } else if (e.key === "l" || e.key === "L") {
        e.preventDefault();
        handleCurrentLocation();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const mapCenter: [number, number] = weather
    ? [weather.coord.lat, weather.coord.lon]
    : gpsCoords
      ? gpsCoords
      : [27.7, 85.3]; // Default to Nepal

  const mapZoom = weather ? 12 : 6;

  // Helper to update URL with location params
  const updateURLWithLocation = (name: string, lat: number, lon: number) => {
    const params = new URLSearchParams();
    params.set("location", name);
    params.set("lat", lat.toString());
    params.set("lon", lon.toString());
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  // Popular cities for URL lookup
  const POPULAR_CITIES_MAP: Record<string, { lat: number; lon: number }> = {
    kathmandu: { lat: 27.7172, lon: 85.324 },
    pokhara: { lat: 28.2096, lon: 83.9856 },
    lalitpur: { lat: 27.6644, lon: 85.3188 },
    biratnagar: { lat: 26.4525, lon: 87.2718 },
    bharatpur: { lat: 27.6833, lon: 84.4333 },
    birgunj: { lat: 27.0104, lon: 84.8821 },
    dharan: { lat: 26.8065, lon: 87.2846 },
    butwal: { lat: 27.7006, lon: 83.4483 },
    itahari: { lat: 26.6645, lon: 87.2747 },
  };

  // Handle loading location from URL
  const handlePopularCityFromURL = async (locationName: string) => {
    const normalized = locationName.toLowerCase().trim();
    const popularCity = POPULAR_CITIES_MAP[normalized];

    if (popularCity) {
      // Found in popular cities
      getWeather(popularCity.lat, popularCity.lon, locationName).finally(() =>
        setIsLocating(false)
      );
    } else {
      // Fallback: Use OpenCage to geocode the location name
      try {
        const OPENCAGE_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
        if (!OPENCAGE_KEY) {
          setIsLocating(false);
          toast.error("Unable to find location.");
          return;
        }
        const res = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(locationName)}&key=${OPENCAGE_KEY}&limit=1`
        );
        const data = await res.json();
        const result = data?.results?.[0];

        if (result?.geometry) {
          getWeather(result.geometry.lat, result.geometry.lng, locationName).finally(() =>
            setIsLocating(false)
          );
        } else {
          setIsLocating(false);
          toast.error(`Location "${locationName}" not found.`);
        }
      } catch {
        setIsLocating(false);
        toast.error("Error finding location.");
      }
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      toast.info("Locating you...");

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setIsGPS(true);
          setGpsCoords([latitude, longitude]); // Set map center immediately
          getWeather(latitude, longitude).then(() => {
            // Update URL with coordinates (location name will be set by reverse geocoding)
            updateURLWithLocation("My Location", latitude, longitude);
          });
          toast.success("Location found!");
        },
        () => {
          setIsLocating(false);
          toast.error("Unable to get current location.");
        }
      );
    } else {
      setWeatherError("Geolocation is not supported.");
      toast.error("Geolocation is not supported.");
    }
  };

  const handlePopularCity = (city: string, lat: number, lon: number) => {
    onChange("");
    setIsLocating(true);
    setIsGPS(false);
    updateURLWithLocation(city, lat, lon);
    getWeather(lat, lon, city).finally(() => setIsLocating(false));
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    pickSuggestion(suggestion);
    setSuggestions([]);
    setIsLocating(true);
    setIsGPS(false);
    updateURLWithLocation(suggestion.display, suggestion.lat, suggestion.lng);
    getWeather(suggestion.lat, suggestion.lng, suggestion.display).finally(() =>
      setIsLocating(false)
    );
  };

  const getLayerIcon = (layer: MapLayerType) => {
    switch (layer) {
      case "precipitation_new":
        return <CloudRain className="h-4 w-4" />;
      case "wind_new":
        return <Wind className="h-4 w-4" />;
      case "clouds_new":
        return <Cloud className="h-4 w-4" />;
      default:
        return <Thermometer className="h-4 w-4" />;
    }
  };

  const isLoading = loadingWeather || isLocating;

  return (
    // FIX: Changed structure to flex-col to push Footer to bottom
    <div className="min-h-screen bg-background flex flex-col">
      <OfflineBanner isOffline={isOffline} />
      <div className="flex-grow p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* HEADER: Optimized for Mobile & Desktop */}
          <header className="sticky top-0 md:top-4 z-50 bg-background/95 md:bg-card/70 p-4 md:rounded-xl md:border shadow-sm backdrop-blur-md transition-all">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* BLOCK 1: Logo & Mobile Actions */}
              <div className="flex w-full md:w-auto items-center justify-between">
                <h1
                  className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent cursor-pointer"
                  onClick={() => window.location.reload()}
                >
                  Mausam
                </h1>

                {/* Mobile-Only Actions (GPS, Favorites, Toggle) - Moves here to save space below */}
                <div className="flex items-center gap-1 md:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCurrentLocation}
                    className="h-9 w-9"
                  >
                    <Locate className="h-5 w-5" />
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Star className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm w-full z-[100]">
                      <DialogHeader>
                        <DialogTitle>Saved Locations</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col gap-2 mt-2 max-h-[300px] overflow-y-auto">
                        {favorites.length === 0 && (
                          <p className="text-sm text-center py-4 text-muted-foreground">
                            No favorites yet.
                          </p>
                        )}
                        {favorites.map((fav) => (
                          <DialogTrigger asChild key={fav.display}>
                            <Button
                              variant="ghost"
                              className="justify-start w-full"
                              onClick={() => {
                                setIsGPS(false);
                                updateURLWithLocation(fav.display, fav.lat, fav.lng);
                                getWeather(fav.lat, fav.lng, fav.display);
                              }}
                            >
                              <Star className="mr-2 h-4 w-4 text-yellow-500 fill-yellow-500" />
                              {fav.display}
                            </Button>
                          </DialogTrigger>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setUnit(unit === "C" ? "F" : "C")}
                    className="h-9 w-9 font-medium"
                    title="Toggle temperature unit"
                  >
                    °{unit}
                  </Button>

                  <ModeToggle />
                </div>
              </div>

              {/* BLOCK 2: Search Bar (Full width on Mobile) */}
              <div className="relative w-full md:max-w-md lg:max-w-lg">
                <SearchBar
                  input={input}
                  onChange={(e) => onChange(e.target.value)}
                  getWeather={getWeather}
                  loadingWeather={loadingWeather}
                  hasValidSelection={!!selected}
                  onInputRef={(ref) => { searchInputRef = ref; }}
                />

                {(suggestions.length > 0 || loadingSuggestions) && (
                  <div className="absolute top-full left-0 w-full mt-2 z-[100]">
                    <AutocompleteDropdown
                      suggestions={suggestions}
                      loading={loadingSuggestions}
                      onSelect={handleSuggestionClick}
                      onClose={() => setSuggestions([])}
                      highlightText={input}
                    />
                  </div>
                )}
              </div>

              {/* BLOCK 3: Desktop Actions (Hidden on Mobile) */}
              <div className="hidden md:flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCurrentLocation}
                  title="Current Location"
                >
                  <Locate className="h-5 w-5" />
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" title="Favorites">
                      <Star className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm w-full z-[100]">
                    <DialogHeader>
                      <DialogTitle>Saved Locations</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-2 mt-2 max-h-[300px] overflow-y-auto">
                      {favorites.length === 0 && (
                        <p className="text-sm text-center py-4 text-muted-foreground">
                          No favorites yet.
                        </p>
                      )}
                      {favorites.map((fav) => (
                        <DialogTrigger asChild key={fav.display}>
                          <Button
                            variant="ghost"
                            className="justify-start w-full"
                            onClick={() => {
                              setIsGPS(false);
                              updateURLWithLocation(fav.display, fav.lat, fav.lng);
                              getWeather(fav.lat, fav.lng, fav.display);
                            }}
                          >
                            <Star className="mr-2 h-4 w-4 text-yellow-500 fill-yellow-500" />
                            {fav.display}
                          </Button>
                        </DialogTrigger>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setUnit(unit === "C" ? "F" : "C")}
                  className="font-medium"
                  title="Toggle temperature unit"
                >
                  °{unit}
                </Button>

                <ModeToggle />
              </div>
            </div>
          </header>

          <main className="space-y-6">
            {!weather && !isLoading ? (
              <WelcomeState
                onUseLocation={handleCurrentLocation}
                onSelectCity={handlePopularCity}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="md:col-span-1 lg:col-span-1 min-h-[350px] md:h-[400px]">
                    <ErrorBoundary section="weather">
                      <CurrentWeather
                        weather={weather}
                        loading={isLoading}
                        unit={unit}
                        favorites={favorites}
                        toggleFavorite={toggleFavorite}
                        lastUpdated={lastUpdated}
                      />
                    </ErrorBoundary>
                  </div>

                  <div className="md:col-span-1 lg:col-span-2 h-[300px] md:h-[400px] rounded-xl overflow-hidden border shadow-sm relative group z-0">
                    <ErrorBoundary section="map">
                      <WeatherMap
                        center={mapCenter}
                        zoom={mapZoom}
                        layer={mapLayer}
                      />
                    </ErrorBoundary>

                    <div className="absolute bottom-4 left-4 z-[400] flex flex-col gap-1 bg-background/80 p-1 rounded-lg border shadow backdrop-blur-md">
                      {[
                        { id: "temp_new", label: "Temp" },
                        { id: "precipitation_new", label: "Rain" },
                        { id: "wind_new", label: "Wind" },
                        { id: "clouds_new", label: "Clouds" },
                      ].map((layer) => (
                        <Button
                          key={layer.id}
                          size="sm"
                          variant={mapLayer === layer.id ? "default" : "ghost"}
                          className="justify-start h-8 px-2 w-28 text-xs"
                          onClick={() => setMapLayer(layer.id as MapLayerType)}
                        >
                          {getLayerIcon(layer.id as MapLayerType)}
                          <span className="ml-2">{layer.label}</span>
                        </Button>
                      ))}
                    </div>

                    <div className="absolute bottom-4 right-4 z-[400] bg-background/80 p-2 rounded-md shadow backdrop-blur-md">
                      <MapLegend layer={mapLayer} />
                    </div>
                  </div>
                </div>

                {(weather || isLoading) && (
                  <>
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                      <ErrorBoundary section="lifestyle tips">
                        {weather && (
                          <LifestyleGrid weather={weather} unit={unit} />
                        )}
                      </ErrorBoundary>
                    </div>

                    <div className="mt-6 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                      <ErrorBoundary section="forecast">
                        <ProForecast
                          fiveDay={fiveDayForecast}
                          twelveHour={twelveHourForecast}
                          unit={unit}
                          loading={isLoading}
                        />
                      </ErrorBoundary>
                    </div>
                  </>
                )}
              </>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
