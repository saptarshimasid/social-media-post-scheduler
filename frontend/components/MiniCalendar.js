'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MiniCalendar({ selectedDate, onSelectDate }) {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // July (0-indexed is 6)
  const [todayStr, setTodayStr] = useState('');

  useEffect(() => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    setTodayStr(`${y}-${m}-${d}`);
  }, []);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const monthName = monthNames[currentMonth];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDayOffset = new Date(currentYear, currentMonth, 1).getDay();

  // Helper to format date string as YYYY-MM-DD
  const formatDateStr = (year, month, day) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const days = [];
  // Spacer cells for previous month tail
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
  for (let i = startDayOffset - 1; i >= 0; i--) {
    days.push({ 
      day: prevMonthDays - i, 
      isCurrentMonth: false, 
      dateStr: '' 
    });
  }

  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = formatDateStr(currentYear, currentMonth, d);
    days.push({
      day: d,
      isCurrentMonth: true,
      dateStr,
      isToday: dateStr === todayStr
    });
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleDayClick = (dateStr) => {
    if (dateStr && onSelectDate) {
      onSelectDate(dateStr);
    }
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-headline-md text-headline-md text-white text-lg">
          {monthName} <span className="text-on-surface-variant/65 text-sm font-normal ml-1">{currentYear}</span>
        </h2>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={handlePrevMonth}
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 text-on-surface-variant transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button 
            type="button"
            onClick={handleNextMonth}
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 text-on-surface-variant transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center font-label-sm text-label-sm text-on-surface-variant mb-2">
        <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center font-body-sm text-sm">
        {days.map((item, idx) => {
          if (!item.isCurrentMonth) {
            return (
              <div key={`prev-${idx}`} className="p-1 text-white/20 select-none">
                {item.day}
              </div>
            );
          }

          const isSelected = selectedDate === item.dateStr;
          
          return (
            <motion.div
              key={`day-${item.day}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDayClick(item.dateStr)}
              className={`p-1 rounded cursor-pointer transition-colors relative flex items-center justify-center aspect-square ${
                isSelected 
                  ? 'bg-primary-container text-black font-bold shadow-[0_0_12px_rgba(0,240,255,0.5)] z-10' 
                  : item.isToday
                    ? 'border border-[#00F0FF] text-[#00F0FF] font-bold shadow-[inset_0_0_6px_rgba(0,240,255,0.15)]'
                    : 'text-on-surface hover:bg-white/5'
              }`}
            >
              <span>{item.day}</span>
              
              {item.isToday && !isSelected && (
                <span className="absolute top-1 right-1 w-1 h-1 bg-[#00F0FF] rounded-full" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
