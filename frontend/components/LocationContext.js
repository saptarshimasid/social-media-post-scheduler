'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [locationName, setLocationName] = useState('Detecting location...');
  const [weatherData, setWeatherData] = useState({ tempC: 20, condition: 'Loading...' });
  const [isCelsius, setIsCelsius] = useState(true);

  useEffect(() => {
    async function fetchWeatherByCoords(lat, lon, fallbackCity = 'Local') {
      try {
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
        );
        if (!weatherRes.ok) throw new Error('Weather API error');
        const weatherJson = await weatherRes.json();

        if (weatherJson && weatherJson.current) {
          const tempC = weatherJson.current.temperature_2m;
          const code = weatherJson.current.weather_code;

          const weatherCodeMap = {
            0: "Clear Sky",
            1: "Mainly Clear",
            2: "Partly Cloudy",
            3: "Overcast",
            45: "Fog",
            48: "Depositing Rime Fog",
            51: "Light Drizzle",
            53: "Moderate Drizzle",
            55: "Dense Drizzle",
            61: "Slight Rain",
            63: "Moderate Rain",
            65: "Heavy Rain",
            71: "Slight Snow",
            73: "Moderate Snow",
            75: "Heavy Snow",
            80: "Slight Rain Showers",
            81: "Moderate Rain Showers",
            82: "Violent Rain Showers",
            95: "Thunderstorm",
            96: "Thunderstorm with Hail",
            99: "Thunderstorm with Heavy Hail"
          };

          const condition = weatherCodeMap[code] || 'Clear';
          setWeatherData({ tempC, condition });
          if (locationName === 'Detecting location...') {
             setLocationName(fallbackCity);
          }
        }
      } catch (err) {
        console.error('Error fetching weather:', err);
        setLocationName('Seattle, WA');
        setWeatherData({ tempC: 20, condition: 'Partly Cloudy' });
      }
    }

    async function fetchLocationByIP() {
      try {
        const geoRes = await fetch('https://ipapi.co/json/');
        if (!geoRes.ok) throw new Error('Location API error');
        const geoData = await geoRes.json();
        const city = geoData.city || 'Unknown';
        const region = geoData.region || '';
        setLocationName(`${city}${region ? ', ' + region : ''}`);
        
        await fetchWeatherByCoords(geoData.latitude || 47.6062, geoData.longitude || -122.3321, city);
      } catch (err) {
        console.error('IP Geolocation failed, using default coords', err);
        setLocationName('Seattle, WA');
        fetchWeatherByCoords(47.6062, -122.3321, 'Seattle, WA');
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // If browser grants location, we use it directly
          setLocationName('Your Location'); // Open-Meteo doesn't give city names directly
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude, 'Your Location');
        },
        (error) => {
          // If denied or fails, fallback to IP
          fetchLocationByIP();
        }
      );
    } else {
      fetchLocationByIP();
    }
  }, []);

  return (
    <LocationContext.Provider value={{ locationName, weatherData, isCelsius, setIsCelsius }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
