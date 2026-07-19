'use client';

import { useState, useEffect } from 'react';
import DynamicClock from './DynamicClock';

export default function ClockWidget({ locationName = 'Loading...' }) {
  const [timeStr, setTimeStr] = useState('09:41');
  const [dateStr, setDateStr] = useState('Mon, Oct 24');

  useEffect(() => {
    function update() {
      const now = new Date();
      
      let hours = now.getHours();
      let minutes = now.getMinutes();
      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      setTimeStr(`${hours}:${minutes}`);

      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      setDateStr(now.toLocaleDateString('en-US', options));
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card rounded-xl p-6 flex flex-col justify-between aspect-[2/1] md:aspect-auto">
      <div className="flex justify-between items-start">
        <h2 className="font-label-sm text-label-sm text-on-surface-variant uppercase">Local Time</h2>
        <div className="flex items-center">
          <DynamicClock size={28} strokeColor="#00F0FF" />
        </div>
      </div>
      <div className="mt-4">
        <div className="font-display-lg text-display-lg-mobile md:text-5xl text-white text-glow-primary tracking-tighter">
          {timeStr}
        </div>
        <div className="font-body-md text-on-surface-variant mt-1 truncate">
          <span>{dateStr}</span> • {locationName}
        </div>
      </div>
    </div>
  );
}
