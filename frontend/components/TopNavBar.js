'use client';

import { motion } from 'framer-motion';
import DynamicClock from './DynamicClock';
import { useLocation } from './LocationContext';

function getIconName(condition) {
  const cond = (condition || '').toLowerCase();
  if (cond.includes('clear') || cond.includes('sunny')) return 'sunny';
  if (cond.includes('partly') || cond.includes('mainly')) return 'partly_cloudy_day';
  if (cond.includes('overcast') || cond.includes('cloud')) return 'cloud';
  if (cond.includes('fog')) return 'foggy';
  if (cond.includes('drizzle') || cond.includes('rain')) return 'rainy';
  if (cond.includes('snow')) return 'snowing';
  if (cond.includes('thunderstorm')) return 'thunderstorm';
  return 'cloudy_snowing';
}

export default function TopNavBar() {
  const { weatherData, isCelsius, setIsCelsius } = useLocation();

  return (
    <header className="hidden md:flex justify-between items-center h-16 px-8 ml-[280px] bg-surface/40 backdrop-blur-lg fixed top-0 right-0 w-[calc(100%-280px)] shadow-sm z-40 border-b border-white/5">
      <div className="flex items-center gap-6">
        <span className="font-display-lg text-white font-bold text-xl tracking-tight text-glow-primary">Scheduler Pro</span>
        <nav className="hidden lg:flex gap-6">
          <motion.a
            whileHover={{ scale: 1.05, color: '#00F0FF' }}
            className="font-label-sm text-xs text-on-surface-variant transition-colors cursor-pointer"
            href="#"
          >
            Assets
          </motion.a>
        </nav>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Dynamic Analog Clock button in header */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          className="text-on-surface-variant transition-colors flex items-center cursor-pointer p-1"
        >
          <DynamicClock size={20} strokeColor="#b9cacb" />
        </motion.button>

        {/* Live Weather & Temp button pill in header */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCelsius(!isCelsius)}
          className="text-on-surface-variant hover:text-[#00F0FF] hover:border-[#00F0FF]/30 transition-all flex items-center gap-1.5 cursor-pointer bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs select-none"
          title="Click to toggle temperature units globally"
        >
          <span className="material-symbols-outlined text-[16px] text-[#00F0FF]">
            {getIconName(weatherData.condition)}
          </span>
          <span className="font-semibold text-white">
            {isCelsius 
              ? `${Math.round(weatherData.tempC)}°C` 
              : `${Math.round((weatherData.tempC * 9/5) + 32)}°F`}
          </span>
        </motion.button>
      </div>
    </header>
  );
}
