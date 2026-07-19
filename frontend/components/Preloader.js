'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader({ onComplete }) {
  const [percent, setPercent] = useState(0);
  const [statusText, setStatusText] = useState('BOOTING SYSTEM...');
  const containerRef = useRef(null);
  const progressLineRef = useRef(null);

  useEffect(() => {
    const counter = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete: () => {
            if (onComplete) onComplete();
          }
        });
      }
    });

    tl.to(counter, {
      val: 100,
      duration: 2.0,
      ease: 'power1.inOut',
      onUpdate: () => {
        const currentVal = Math.floor(counter.val);
        setPercent(currentVal);
        
        if (currentVal < 25) {
          setStatusText('CONNECTING TO SERVICES...');
        } else if (currentVal < 50) {
          setStatusText('INITIALIZING LANGGRAPH ENGINE...');
        } else if (currentVal < 80) {
          setStatusText('CONFIGURING GEMINI LLM PIPELINES...');
        } else {
          setStatusText('CREATOR HUB IS READY');
        }
      }
    });

    gsap.to(progressLineRef.current, {
      width: '100%',
      duration: 2.0,
      ease: 'power1.inOut'
    });

  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full bg-[#0A0C10] z-[9999] flex flex-col items-center justify-center"
    >
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-container/10 blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary-container/10 blur-[150px]"></div>

      <div className="w-[300px] md:w-[450px] flex flex-col gap-4 relative z-10 px-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-headline-md text-headline-md text-primary-fixed text-xl font-bold tracking-tight">Creator Hub</h1>
            <p className="font-label-sm text-[10px] tracking-widest text-on-surface-variant uppercase mt-1">PRO PLATFORM v3.5</p>
          </div>
          <span className="font-display-lg text-display-lg-mobile md:text-3xl text-glow-primary text-[#00F0FF] font-bold">
            {percent}%
          </span>
        </div>

        <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden relative">
          <div
            ref={progressLineRef}
            className="h-full bg-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.8)] w-0"
          ></div>
        </div>

        <div className="flex justify-between items-center text-[10px] font-label-sm text-on-surface-variant/80 tracking-widest uppercase">
          <span>{statusText}</span>
          <span className="animate-pulse">SYSTEM ONLINE</span>
        </div>
      </div>
    </div>
  );
}
