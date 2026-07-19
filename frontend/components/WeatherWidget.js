'use client';

import { motion } from 'framer-motion';

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

export default function WeatherWidget({ 
  locationName = 'Loading...', 
  tempC = 20, 
  condition = 'Partly Cloudy',
  isCelsius = true,
  setIsCelsius
}) {
  const displayTemp = isCelsius 
    ? `${Math.round(tempC)}°C` 
    : `${Math.round((tempC * 9/5) + 32)}°F`;

  return (
    <div className="glass-card rounded-xl p-6 flex flex-col justify-between relative overflow-hidden aspect-[2/1] md:aspect-auto">
      {/* Animated glowing cloud blob */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute right-[-20%] top-[-20%] w-48 h-48 bg-[#00F0FF]/20 rounded-full blur-2xl pointer-events-none"
      />
      
      <div className="relative z-10 flex justify-between items-center">
        <h2 className="font-label-sm text-label-sm text-on-surface-variant uppercase">Weather</h2>
        
        <div className="flex items-center gap-3">
          {/* C / F Unit Toggler Pill */}
          <div className="flex items-center bg-black/40 border border-white/10 rounded-full p-0.5 relative z-30 pointer-events-auto">
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (setIsCelsius) setIsCelsius(true);
              }}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer relative z-40 ${
                isCelsius 
                  ? 'bg-[#00F0FF] text-black shadow-[0_0_8px_rgba(0,240,255,0.4)]' 
                  : 'text-on-surface-variant hover:text-white'
              }`}
            >
              °C
            </button>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (setIsCelsius) setIsCelsius(false);
              }}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer relative z-40 ${
                !isCelsius 
                  ? 'bg-[#00F0FF] text-black shadow-[0_0_8px_rgba(0,240,255,0.4)]' 
                  : 'text-on-surface-variant hover:text-white'
              }`}
            >
              °F
            </button>
          </div>
          <span className="material-symbols-outlined text-[#00F0FF]">
            {getIconName(condition)}
          </span>
        </div>
      </div>
      
      <div className="relative z-10 flex items-end justify-between mt-4">
        <div>
          {/* Main Temperature Display (Clickable for easy toggle) */}
          <div 
            onClick={() => { if (setIsCelsius) setIsCelsius(!isCelsius); }}
            className="font-display-lg text-display-lg-mobile md:text-5xl text-white tracking-tight cursor-pointer hover:text-[#00F0FF] transition-colors select-none"
            title="Click to toggle units"
          >
            {displayTemp}
          </div>
          <div className="font-body-md text-on-surface-variant mt-1">{condition}</div>
        </div>
        <div className="text-right">
          <div className="font-label-sm text-label-sm text-on-surface-variant max-w-[150px] truncate">{locationName}</div>
        </div>
      </div>
    </div>
  );
}
