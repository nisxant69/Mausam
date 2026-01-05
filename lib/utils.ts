import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for merging classes (required for ShadCN components)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Capitalize words
export const capitalize = (s = "") =>
  s
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");

// Display name from components
export const makeDisplayNameFromComponents = (components: any, formatted?: string) => {
  if (!components || typeof components !== "object") return formatted || "Unknown Location";
  const city =
    components.city ||
    components.town ||
    components.municipality ||
    components.village ||
    components.county ||
    null;
  const region = components.state || components.region || null;
  const country = components.country || null;

  const parts = [city, region, country].filter(Boolean);
  if (parts.length > 0) return parts.join(", ");
  return formatted || "Unknown Location";
};

// Cache with TTL
export const setWithTTL = (key: string, value: any, ttl: number) => {
  try {
    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), ttl, value }));
  } catch { }
};

export const getWithTTL = (key: string) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.ts > parsed.ttl) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.value;
  } catch {
    return null;
  }
};

// Validate suggestion from API
export const isValidSuggestion = (s: any) => {
  if (!s) return false;
  if (!s.geometry || typeof s.geometry.lat !== "number" || typeof s.geometry.lng !== "number") return false;
  if (!s.components || Object.keys(s.components).length === 0) return false;
  return true;
};

export function calculateHeatIndex(tempC: number, humidity: number): number {
  // Formula requires Fahrenheit
  const T = (tempC * 9) / 5 + 32;
  const R = humidity;

  const c1 = -42.379;
  const c2 = 2.04901523;
  const c3 = 10.14333127;
  const c4 = -0.22475541;
  const c5 = -6.83783 * Math.pow(10, -3);
  const c6 = -5.481717 * Math.pow(10, -2);
  const c7 = 1.22874 * Math.pow(10, -3);
  const c8 = 8.5282 * Math.pow(10, -4);
  const c9 = -1.99 * Math.pow(10, -6);

  let HI =
    c1 +
    c2 * T +
    c3 * R +
    c4 * T * R +
    c5 * T * T +
    c6 * R * R +
    c7 * T * T * R +
    c8 * T * R * R +
    c9 * T * T * R * R;

  // Convert back to Celsius
  return ((HI - 32) * 5) / 9;
}

export function getHeatIndexLabel(hiC: number): { label: string; color: string } {
  if (hiC < 27) return { label: "Comfortable", color: "text-green-500" };
  if (hiC < 32) return { label: "Caution", color: "text-yellow-500" };
  if (hiC < 41) return { label: "Extreme Caution", color: "text-orange-500" };
  if (hiC < 54) return { label: "Danger", color: "text-red-500" };
  return { label: "Extreme Danger", color: "text-purple-600" };
}

export type LaundryStatus = {
  status: "good" | "caution" | "bad";
  message: string;
  messageNe?: string; // Nepali translation
  color: string;
};

export function getLaundryAdvice(weatherId: number, humidity: number, clouds: number): LaundryStatus {
  // Rain codes: 200-531 (Thunderstorm, Drizzle, Rain)
  if (weatherId >= 200 && weatherId <= 531) {
    return {
      status: "bad",
      message: "Don't do laundry. Rain expected.",
      messageNe: "कपडा नधुनुहोस्। पानी पर्छ।",
      color: "text-red-500"
    };
  }

  // High humidity (> 85%) means clothes won't dry well
  if (humidity > 85) {
    return {
      status: "caution",
      message: "Hard to dry. Humid air.",
      messageNe: "सुक्न गाह्रो। हावा चिसो छ।",
      color: "text-orange-500"
    };
  }

  // Very cloudy (> 80%)
  if (clouds > 80) {
    return {
      status: "caution",
      message: "Cloudy. Slow drying.",
      messageNe: "बादल छ। सुक्न ढिलो हुन्छ।",
      color: "text-yellow-500"
    };
  }

  return {
    status: "good",
    message: "Great day for laundry!",
    messageNe: "कपडा धुन राम्रो दिन!",
    color: "text-green-500"
  };
}

export function getUmbrellaAdvice(weatherId: number, temp: number): { message: string; messageNe: string } | null {
  // Rain or Drizzle
  if (weatherId >= 200 && weatherId <= 531) {
    return {
      message: "Bring an umbrella. Rain expected.",
      messageNe: "छाता लिनुहोस्। पानी पर्छ।"
    };
  }
  // Very Hot (> 32°C)
  if (temp > 32) {
    return {
      message: "Hot! Use umbrella for sun.",
      messageNe: "गर्मी छ! घामको लागि छाता लिनुहोस्।"
    };
  }
  return null; // No need
}

/**
 * Returns gradient CSS classes based on weather condition
 * Uses OpenWeatherMap weather codes: https://openweathermap.org/weather-conditions
 */
export function getWeatherGradient(weatherId: number, isNight: boolean = false): string {
  // Night time - dark blues/purples
  if (isNight) {
    if (weatherId >= 200 && weatherId < 300) {
      // Thunderstorm at night
      return "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800";
    }
    if (weatherId >= 300 && weatherId < 600) {
      // Rain/Drizzle at night
      return "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900";
    }
    if (weatherId >= 600 && weatherId < 700) {
      // Snow at night
      return "bg-gradient-to-br from-slate-800 via-blue-900 to-slate-700";
    }
    if (weatherId >= 700 && weatherId < 800) {
      // Fog/Mist at night
      return "bg-gradient-to-br from-slate-800 via-slate-700 to-gray-800";
    }
    if (weatherId === 800) {
      // Clear night
      return "bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950";
    }
    // Cloudy night
    return "bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900";
  }

  // DAY TIME
  if (weatherId >= 200 && weatherId < 300) {
    // Thunderstorm
    return "bg-gradient-to-br from-slate-700 via-purple-800 to-slate-600";
  }
  if (weatherId >= 300 && weatherId < 400) {
    // Drizzle
    return "bg-gradient-to-br from-slate-500 via-blue-600 to-slate-400";
  }
  if (weatherId >= 500 && weatherId < 600) {
    // Rain
    return "bg-gradient-to-br from-slate-600 via-blue-700 to-indigo-600";
  }
  if (weatherId >= 600 && weatherId < 700) {
    // Snow
    return "bg-gradient-to-br from-blue-200 via-slate-300 to-blue-300";
  }
  if (weatherId >= 700 && weatherId < 800) {
    // Fog/Mist/Haze
    return "bg-gradient-to-br from-gray-400 via-slate-400 to-gray-500";
  }
  if (weatherId === 800) {
    // Clear sky - sunny!
    return "bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-400";
  }
  if (weatherId === 801) {
    // Few clouds
    return "bg-gradient-to-br from-sky-400 via-blue-400 to-slate-400";
  }
  if (weatherId === 802) {
    // Scattered clouds
    return "bg-gradient-to-br from-blue-400 via-slate-400 to-gray-400";
  }
  // Overcast/Cloudy
  return "bg-gradient-to-br from-slate-500 via-gray-500 to-slate-400";
}
