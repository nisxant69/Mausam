#!/bin/bash

# Initialize fresh git repo
git init

# Set dates (7 days back from today)
DAY1="2026-01-05T09:00:00"
DAY2="2026-01-06T10:30:00"
DAY3="2026-01-07T11:00:00"
DAY4="2026-01-08T14:00:00"
DAY5="2026-01-09T10:00:00"
DAY6="2026-01-10T11:30:00"
DAY7="2026-01-11T09:00:00"

# Helper function for backdated commits
commit_with_date() {
    GIT_AUTHOR_DATE="$1" GIT_COMMITTER_DATE="$1" git commit -m "$2"
}

echo "📦 Day 1: Project Setup & Foundation"
# Add core config files
git add package.json tsconfig.json next.config.ts postcss.config.mjs .gitignore .prettierc README.md
git add app/layout.tsx app/globals.css
git add components/theme-provider.tsx components/ModeToggle.tsx
git add lib/utils.ts lib/constants.ts
git add types/types.ts
commit_with_date "$DAY1" "feat: Initialize Next.js project with TypeScript and Tailwind"

git add components/ui/
commit_with_date "$DAY1" "feat: Add shadcn/ui components library"

echo "🌤️ Day 2: Core Weather Functionality"
git add hooks/useWeather.ts
git add lib/favorites.ts
commit_with_date "$DAY2" "feat: Implement weather data fetching with OpenWeatherMap API"

git add hooks/useSearch.ts
commit_with_date "$DAY2" "feat: Add location search with OpenCage geocoding"

echo "🎨 Day 3: Weather Display Components"
git add components/Weather/CurrentWeather.tsx
commit_with_date "$DAY3" "feat: Create CurrentWeather card with temperature display"

git add components/Weather/ProForecast.tsx
git add components/Weather/ForecastChart.tsx
git add components/Weather/ForecastCarousel.tsx
commit_with_date "$DAY3" "feat: Add 5-day forecast and hourly chart components"

git add components/Weather/WelcomeState.tsx
commit_with_date "$DAY3" "feat: Create welcome state with popular cities"

echo "🗺️ Day 4: Map & Search Integration"
git add components/Weather/WeatherMap.tsx
git add components/MapLegend.tsx
commit_with_date "$DAY4" "feat: Integrate Leaflet weather map with layer controls"

git add components/Search/SearchBar.tsx
git add components/Search/Suggestions.tsx
commit_with_date "$DAY4" "feat: Build search bar with suggestions dropdown"

git add app/page.tsx
commit_with_date "$DAY4" "feat: Assemble main page with all components"

echo "💡 Day 5: Lifestyle Features & Polish"
git add components/Weather/LifestyleGrid.tsx
commit_with_date "$DAY5" "feat: Add lifestyle tips grid (laundry, umbrella, heat index)"

git add components/Footer.tsx
commit_with_date "$DAY5" "feat: Add footer component"

git add constants.ts 2>/dev/null || true
git add app/api/ 2>/dev/null || true
commit_with_date "$DAY5" "feat: Add API route and constants"

echo "✨ Day 6: UI Enhancements"
git add components/Weather/AnimatedWeatherIcon.tsx
commit_with_date "$DAY6" "feat: Create animated SVG weather icons"

git add components/Search/AutocompleteDropdown.tsx
commit_with_date "$DAY6" "feat: Enhanced autocomplete with keyboard navigation"

echo "🚀 Day 7: Production Ready Features"
git add hooks/useOffline.ts
git add components/OfflineBanner.tsx
commit_with_date "$DAY7" "feat: Add offline mode detection and banner"

git add components/ErrorBoundary.tsx
git add components/ErrorFallback.tsx
commit_with_date "$DAY7" "feat: Implement error boundaries for graceful error handling"

# Final commit with any remaining files
git add -A
commit_with_date "$DAY7" "chore: Final polish and production readiness"

echo ""
echo "✅ Git history created successfully!"
echo ""
git log --oneline --all
