# Mausam 🌤️

A beautiful, modern weather application built for Nepal with real-time weather data, interactive maps, and a stunning user interface.

![Mausam Preview](https://res.cloudinary.com/dhuf7bqvp/image/upload/v1768112331/Screenshot_2026-01-11_at_11.52.08_alnsru.png)

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

- **Real-time Weather Data** — Current conditions with temperature, humidity, wind, and more
- **5-Day Forecast** — Extended weather outlook with daily highs/lows
- **12-Hour Forecast** — Hourly temperature trends with interactive charts
- **Interactive Weather Map** — Leaflet-powered map with temperature, rain, wind, and cloud layers
- **Animated Weather Icons** — Beautiful SVG animations for all weather conditions
- **140+ Nepal Locations** — Instant search for cities, districts, and tourist destinations
- **Offline Support** — Cached data available when you're disconnected
- **Dark/Light Mode** — Automatic theme switching based on system preference
- **Lifestyle Tips** — Smart suggestions for laundry, umbrella, and outdoor activities
- **Favorites** — Save your frequently checked locations
- **Responsive Design** — Works beautifully on mobile, tablet, and desktop

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/nisxant69/Mausam.git
cd Mausam

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

Add your API keys to `.env.local`:

```env
# Client-side API keys (used in browser)
NEXT_PUBLIC_OWM_API_KEY=your_openweather_api_key
NEXT_PUBLIC_OPENCAGE_API_KEY=your_opencage_api_key

# Server-side API keys (used in API routes)
OPENWEATHER_API_KEY=your_openweather_api_key
OPENCAGE_API_KEY=your_opencage_api_key
```

### Getting API Keys

1. **OpenWeatherMap API Key**
   - Sign up at [openweathermap.org](https://openweathermap.org/api)
   - Go to API Keys section and generate a free key
   - Free tier includes 1,000 calls/day

2. **OpenCage API Key**
   - Sign up at [opencagedata.com](https://opencagedata.com/)
   - Get your API key from the dashboard
   - Free tier includes 2,500 calls/day

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Maps**: [Leaflet](https://leafletjs.com/) + [React Leaflet](https://react-leaflet.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## 🌐 APIs Used

| API | Purpose | Free Tier |
|-----|---------|-----------|
| [OpenWeatherMap](https://openweathermap.org/api) | Weather data, forecasts, map tiles | 1,000 calls/day |
| [OpenCage](https://opencagedata.com/) | Geocoding, location search | 2,500 calls/day |

## 📁 Project Structure

```
├── app/
│   ├── page.tsx          # Main weather dashboard
│   ├── layout.tsx        # Root layout with providers
│   └── api/              # API routes
├── components/
│   ├── Weather/          # Weather display components
│   ├── Search/           # Search and autocomplete
│   └── ui/               # shadcn/ui components
├── hooks/
│   ├── useWeather.ts     # Weather data fetching
│   ├── useSearch.ts      # Location search
│   └── useOffline.ts     # Offline detection
├── lib/
│   ├── utils.ts          # Utility functions
│   └── constants.ts      # App constants
└── types/
    └── types.ts          # TypeScript definitions
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Environment Variables for Production

```
NEXT_PUBLIC_OWM_API_KEY=xxx
NEXT_PUBLIC_OPENCAGE_API_KEY=xxx
OPENWEATHER_API_KEY=xxx
OPENCAGE_API_KEY=xxx
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Made with ❤️ in Nepal
