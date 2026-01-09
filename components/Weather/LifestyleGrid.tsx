import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Thermometer, Shirt, Droplets, Umbrella, Info, CloudRain } from "lucide-react";

type LifestyleGridProps = {
  weather: any;
  unit: "C" | "F";
};

// Helper for consistency
const InfoHeader = ({ title, icon: Icon, tooltip }: { title: string; icon: any; tooltip: string }) => (
  <div className="flex items-center justify-between w-full mb-2">
    <div className="flex items-center gap-1.5">
      <span className="text-sm font-medium text-muted-foreground">{title}</span>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-help p-0.5 rounded-full hover:bg-muted transition-colors opacity-50 hover:opacity-100">
              <Info className="w-3 h-3 text-muted-foreground" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-[200px] text-xs">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    <Icon className="w-4 h-4 text-muted-foreground" />
  </div>
);

export default function LifestyleGrid({ weather, unit }: LifestyleGridProps) {
  if (!weather) return null;

  const feelsLike = Math.round(
    unit === "C"
      ? weather.main.feels_like
      : (weather.main.feels_like * 9) / 5 + 32
  );

  const dewPoint = Math.round(
    unit === "C"
      ? weather.main.temp - ((100 - weather.main.humidity) / 5)
      : (weather.main.temp - ((100 - weather.main.humidity) / 5) * 9 / 5 + 32)
  );

  const isRaining = weather.weather.some((c: any) =>
    c.main.toLowerCase().includes("rain") || c.main.toLowerCase().includes("drizzle")
  );
  const isCloudy = weather.clouds.all > 70;

  // --- LOGIC: Real Feel Status & Color ---
  // Thresholds: Extreme=36°C/97°F, Hot=31°C/88°F, Warm=26°C/79°F, Cool<20°C/68°F
  const hotThreshold = unit === "C" ? 36 : 97;
  const warmHotThreshold = unit === "C" ? 31 : 88;
  const warmThreshold = unit === "C" ? 26 : 79;
  const coolThreshold = unit === "C" ? 20 : 68;

  let feelStatus = "Comfortable";
  let feelColor = "text-green-500";

  if (feelsLike >= hotThreshold) {
    feelStatus = "Extreme Caution";
    feelColor = "text-red-600 font-bold";
  } else if (feelsLike >= warmHotThreshold) {
    feelStatus = "Hot";
    feelColor = "text-red-500";
  } else if (feelsLike >= warmThreshold) {
    feelStatus = "Warm";
    feelColor = "text-orange-500";
  } else if (feelsLike < coolThreshold) {
    feelStatus = "Cool";
    feelColor = "text-blue-500";
  }

  // Logic: Laundry Guide
  let laundryStatus = "Great Time!";
  let laundryDesc = "Sunny & clear. Dry clothes fast.";
  let laundryColor = "text-green-500";

  if (isRaining) {
    laundryStatus = "Don't Risk It.";
    laundryDesc = "Rain is expected. Keep it inside.";
    laundryColor = "text-red-500";
  } else if (isCloudy) {
    laundryStatus = "Decent.";
    laundryDesc = "Might take longer to dry.";
    laundryColor = "text-yellow-500";
  }

  // Logic: Umbrella Check
  let umbrellaStatus = "No Need.";
  let umbrellaDesc = "Clear skies ahead.";
  let umbrellaColor = "text-muted-foreground";

  if (isRaining) {
    umbrellaStatus = "Bring Umbrella!";
    umbrellaDesc = "Rain is likely. Stay dry.";
    umbrellaColor = "text-blue-500";
  } else if (weather.clouds.all > 50) {
    umbrellaStatus = "Just in Case.";
    umbrellaDesc = "Cloudy skies, chance of rain.";
    umbrellaColor = "text-blue-400";
  } else if (weather.main.temp > 32) {
    umbrellaStatus = "Use for Sun.";
    umbrellaDesc = "UV is high. Shield yourself.";
    umbrellaColor = "text-orange-500";
  }

  // Logic: Rain Chance (estimated from clouds, humidity, weather)
  let rainChance = 0;
  let rainColor = "text-green-500";
  let rainStatus = "Low";

  if (isRaining) {
    rainChance = 90;
    rainColor = "text-blue-500";
    rainStatus = "Raining";
  } else if (weather.clouds.all > 80 && weather.main.humidity > 70) {
    rainChance = 70;
    rainColor = "text-blue-400";
    rainStatus = "High";
  } else if (weather.clouds.all > 60 || weather.main.humidity > 80) {
    rainChance = 45;
    rainColor = "text-yellow-500";
    rainStatus = "Moderate";
  } else if (weather.clouds.all > 30) {
    rainChance = 20;
    rainColor = "text-green-400";
    rainStatus = "Low";
  } else {
    rainChance = 5;
    rainColor = "text-green-500";
    rainStatus = "Unlikely";
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">

      {/* CARD 1: Real Feel */}
      <Card className="hover:shadow-md transition-shadow duration-200 active:scale-[0.98]">
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <InfoHeader
            title="Real Feel"
            icon={Thermometer}
            tooltip="Calculates how the temperature actually feels based on humidity and wind."
          />
          <div>
            <div className="text-2xl font-bold">
              {feelsLike}°{unit}
            </div>
            {/* FIX: Now using variables guaranteed to match */}
            <p className={`text-xs font-medium mt-1 ${feelColor}`}>
              {feelStatus}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CARD 2: Laundry Guide */}
      <Card className="hover:shadow-md transition-shadow duration-200 active:scale-[0.98]">
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <InfoHeader
            title="Laundry Guide"
            icon={Shirt}
            tooltip="Advice on drying clothes based on rain probability and sunlight."
          />
          <div>
            <div className={`text-2xl font-bold ${laundryColor}`}>
              {laundryStatus}
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1" title={laundryDesc}>
              {laundryDesc}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CARD 3: Humidity */}
      <Card className="hover:shadow-md transition-shadow duration-200 active:scale-[0.98]">
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <InfoHeader
            title="Humidity"
            icon={Droplets}
            tooltip="The amount of water vapor in the air. High humidity makes it feel hotter."
          />
          <div>
            <div className="text-2xl font-bold">
              {weather.main.humidity}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Dew point: {dewPoint}°
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CARD 4: Umbrella Check */}
      <Card className="hover:shadow-md transition-shadow duration-200 active:scale-[0.98]">
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <InfoHeader
            title="Umbrella Check"
            icon={Umbrella}
            tooltip="Recommendation on whether you need an umbrella for rain or intense sun."
          />
          <div>
            <div className={`text-2xl font-bold ${umbrellaColor}`}>
              {umbrellaStatus}
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1 capitalize" title={isRaining ? "Light rain expected" : weather.weather[0].description}>
              {isRaining ? "Light rain expected" : weather.weather[0].description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CARD 5: Rain Chance */}
      <Card className="hover:shadow-md transition-shadow duration-200 active:scale-[0.98]">
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <InfoHeader
            title="Rain Chance"
            icon={CloudRain}
            tooltip="Estimated probability of rain based on current conditions."
          />
          <div>
            <div className={`text-2xl font-bold ${rainColor}`}>
              {rainChance}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {rainStatus}
            </p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}