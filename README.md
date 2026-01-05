# Mausam – Weather Forecasting Platform

Mausam (मौसम - "weather" in Nepali) is a modern weather forecasting application built with Next.js. It provides real-time weather, 12-hour temperature trends, and 5-day forecasts for any location worldwide. The platform includes practical "Lifestyle" metrics like laundry and umbrella guides, geolocation support, search history, and favorite locations.

## Tech Stack

### Frontend & UI
- **Framework:** Next.js 15+ (App Router), React 19
- **Styling:** Tailwind CSS, Shadcn UI, Radix UI
- **Icons & Animation:** Lucide React, Framer Motion
- **Charts:** Recharts
- **Maps:** Leaflet, React-Leaflet

### Backend & API
- **Runtime:** Next.js Route Handlers (Serverless)
- **Weather:** OpenWeatherMap API
- **Geocoding:** OpenCage Data API
- **Type Safety:** TypeScript

## Features

- 🌍 Global location search with autocomplete
- 📍 Automatic geolocation detection
- ⭐ Favorite locations with local storage
- 🔗 Shareable URLs that persist across reloads
- 📊 Interactive 12-hour temperature charts
- 📅 5-day extended forecast
- 🧺 Smart Laundry Guide based on weather conditions
- ☂️ Umbrella recommendations
- 🗺️ Interactive weather maps (temperature, rain, wind, clouds)
- 🌙 Dark/Light mode toggle

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/nisxant69/mausam
cd mausam
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file:
```bash
NEXT_PUBLIC_OWM_API_KEY=your_openweathermap_key
NEXT_PUBLIC_OPENCAGE_API_KEY=your_opencage_key
OPENWEATHER_API_KEY=your_openweathermap_key
OPENCAGE_API_KEY=your_opencage_key
```

### 4. Run the Application
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- Search for any city using the search bar
- Click the location icon to use GPS
- Save favorite cities for quick access
- Check the Lifestyle Grid for laundry and umbrella recommendations
- Explore weather patterns on the interactive map

## License

MIT
