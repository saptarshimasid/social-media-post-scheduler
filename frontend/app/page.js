'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Preloader from '@/components/Preloader';
import ClockWidget from '@/components/ClockWidget';
import WeatherWidget from '@/components/WeatherWidget';
import NextPostPreview from '@/components/NextPostPreview';
import MiniCalendar from '@/components/MiniCalendar';
import TodoList from '@/components/TodoList';
import SideNavBar from '@/components/SideNavBar';
import TopNavBar from '@/components/TopNavBar';
import { useLocation } from '@/components/LocationContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(false);
  const [selectedDate, setSelectedDate] = useState(''); 
  
  const { locationName, weatherData, isCelsius, setIsCelsius } = useLocation();

  const mainRef = useRef(null);
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    // Set dynamic local date as selected default
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    setSelectedDate(`${y}-${m}-${d}`);

    // Check if app has already loaded once in session
    const hasLoaded = sessionStorage.getItem('app_loaded');
    if (hasLoaded) {
      setIsLoading(false);
      setShowPreloader(false);
    } else {
      setShowPreloader(true);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;

    // Background Blobs scroll parallax using GSAP
    gsap.to(blob1Ref.current, {
      y: 200,
      ease: 'none',
      scrollTrigger: {
        trigger: mainRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      }
    });

    gsap.to(blob2Ref.current, {
      y: -250,
      ease: 'none',
      scrollTrigger: {
        trigger: mainRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      }
    });

    // Content entrance animation
    gsap.fromTo(
      cardsRef.current.filter(Boolean),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }
    );
  }, [isLoading]);

  const addCardRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <>
      {showPreloader && (
        <Preloader 
          onComplete={() => {
            sessionStorage.setItem('app_loaded', 'true');
            setIsLoading(false);
            setShowPreloader(false);
          }} 
        />
      )}

      {(!showPreloader || !isLoading) && (
        <div ref={mainRef} className="relative min-h-screen bg-[#0A0C10] text-[#e2e2e8]">
          {/* Parallax Background Blobs */}
          <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
            <div
              ref={blob1Ref}
              className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-primary-container/8 blur-[100px]"
            />
            <div
              ref={blob2Ref}
              className="absolute bottom-[-15%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-secondary-container/8 blur-[130px]"
            />
          </div>

          {/* Left Navigation (Sidebar) */}
          <SideNavBar />

          {/* Top Navbar */}
          <TopNavBar />

          {/* Main Dashboard Layout */}
          <main className="pt-24 pb-12 px-6 md:px-8 md:ml-[280px] min-h-screen relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
              
              {/* Left Column: Bento Grid for Time, Weather, and Post Previews */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* Widgets Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div ref={addCardRef} className="hover-card-animate">
                    <ClockWidget locationName={locationName} />
                  </div>
                  <div ref={addCardRef} className="hover-card-animate">
                    <WeatherWidget 
                      locationName={locationName} 
                      tempC={weatherData.tempC} 
                      condition={weatherData.condition} 
                      isCelsius={isCelsius}
                      setIsCelsius={setIsCelsius}
                    />
                  </div>
                </div>

                {/* Primary Post Preview Widget */}
                <div ref={addCardRef} className="flex-1 flex flex-col">
                  <NextPostPreview selectedDate={selectedDate} />
                </div>

              </div>

              {/* Right Column: Task List and Mini Calendar */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                <div ref={addCardRef}>
                  <MiniCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
                </div>

                <div ref={addCardRef} className="flex-1 flex flex-col">
                  <TodoList />
                </div>

              </div>

            </div>
          </main>

          {/* Mobile Bottom Navigation Menu */}
          <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#111318]/90 backdrop-blur-xl border-t border-white/10 z-50 px-4 py-2 flex justify-between items-center pb-safe">
            <a className="flex flex-col items-center gap-1 p-2 text-primary-fixed cursor-pointer" href="#">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
              <span className="font-label-sm text-[9px] uppercase tracking-wider">Home</span>
            </a>
            <a className="flex flex-col items-center gap-1 p-2 text-on-surface-variant hover:text-white cursor-pointer" href="#">
              <span className="material-symbols-outlined">calendar_month</span>
              <span className="font-label-sm text-[9px] uppercase tracking-wider">Plan</span>
            </a>
            <button className="w-12 h-12 rounded-full glass-button-primary flex items-center justify-center shadow-lg -translate-y-4 border-4 border-[#0A0C10] cursor-pointer">
              <span className="material-symbols-outlined text-black">add</span>
            </button>
            <a className="flex flex-col items-center gap-1 p-2 text-on-surface-variant hover:text-white cursor-pointer" href="#">
              <span className="material-symbols-outlined">monitoring</span>
              <span className="font-label-sm text-[9px] uppercase tracking-wider">Stats</span>
            </a>
            <a className="flex flex-col items-center gap-1 p-2 text-on-surface-variant hover:text-white cursor-pointer" href="#">
              <span className="material-symbols-outlined">person</span>
              <span className="font-label-sm text-[9px] uppercase tracking-wider">Profile</span>
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
