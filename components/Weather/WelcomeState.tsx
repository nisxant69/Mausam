import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

type WelcomeStateProps = {
  onUseLocation: () => void;
  onSelectCity: (city: string, lat: number, lon: number) => void;
};

// Popular cities in Nepal
const POPULAR_CITIES = [
  { name: "Kathmandu", lat: 27.7172, lon: 85.324 },
  { name: "Pokhara", lat: 28.2096, lon: 83.9856 },
  { name: "Lalitpur", lat: 27.6644, lon: 85.3188 },
  { name: "Biratnagar", lat: 26.4525, lon: 87.2718 },
  { name: "Bharatpur", lat: 27.6833, lon: 84.4333 },
  { name: "Birgunj", lat: 27.0104, lon: 84.8821 },
  { name: "Dharan", lat: 26.8065, lon: 87.2846 },
  { name: "Butwal", lat: 27.7006, lon: 83.4483 },
  { name: "Itahari", lat: 26.6645, lon: 87.2747 },
];

export default function WelcomeState({ onUseLocation, onSelectCity }: WelcomeStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center animate-in fade-in zoom-in duration-500">

      {/* Hero Section */}
      <div className="space-y-4 max-w-lg">
        <div className="bg-blue-500/10 p-4 rounded-full w-fit mx-auto ring-1 ring-blue-500/20">
          <MapPin className="h-12 w-12 text-blue-500" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome to Mausam
        </h2>
        {/* Concise 2-line description */}
        <p className="text-muted-foreground text-lg px-4 leading-relaxed">
          Your weather companion for Nepal and beyond. <br className="hidden md:block" />
          Get accurate, localized forecasts for any city worldwide.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-md space-y-6">
        <Button
          size="lg"
          className="w-full gap-2 text-base font-semibold shadow-md hover:shadow-lg transition-all"
          onClick={onUseLocation}
        >
          <Navigation className="h-4 w-4" />
          Use My Current Location
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or choose a popular city
            </span>
          </div>
        </div>

        {/* Popular Cities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {POPULAR_CITIES.map((city) => (
            <Button
              key={city.name}
              variant="outline"
              className="h-auto py-3 px-2 text-sm hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
              onClick={() => onSelectCity(city.name, city.lat, city.lon)}
            >
              {city.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}