'use client';

import { useEffect, useState } from 'react';

export default function DynamicClock({ size = 24, strokeColor = '#00F0FF' }) {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) {
    // Initial server render skeleton to prevent hydration mismatch
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke={strokeColor} strokeWidth="1.5" />
        <circle cx="12" cy="12" r="1.5" fill={strokeColor} />
      </svg>
    );
  }

  const hrs = time.getHours();
  const mins = time.getMinutes();
  const secs = time.getSeconds();

  const hrsAngle = ((hrs % 12) * 30) + (mins * 0.5);
  const minsAngle = (mins * 6) + (secs * 0.1);
  const secsAngle = secs * 6;

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <circle cx="12" cy="12" r="10" stroke={strokeColor} strokeWidth="1.5" />
      
      {/* Hour Hand */}
      <line 
        x1="12" 
        y1="12" 
        x2="12" 
        y2="7" 
        stroke={strokeColor} 
        strokeWidth="1.5" 
        strokeLinecap="round"
        transform={`rotate(${hrsAngle} 12 12)`}
      />
      
      {/* Minute Hand */}
      <line 
        x1="12" 
        y1="12" 
        x2="12" 
        y2="5" 
        stroke={strokeColor} 
        strokeWidth="1.2" 
        strokeLinecap="round"
        transform={`rotate(${minsAngle} 12 12)`}
      />

      {/* Second Hand */}
      <line 
        x1="12" 
        y1="12" 
        x2="12" 
        y2="4" 
        stroke="#ff24e4" 
        strokeWidth="0.8" 
        strokeLinecap="round"
        transform={`rotate(${secsAngle} 12 12)`}
      />
      
      {/* Center Pin */}
      <circle cx="12" cy="12" r="1.2" fill={strokeColor} />
    </svg>
  );
}
