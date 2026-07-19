'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import SideNavBar from '@/components/SideNavBar';
import TopNavBar from '@/components/TopNavBar';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PlatformsPage() {
  const mainRef = useRef(null);
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const cardsRef = useRef([]);

  // Live state managers for mock interactions
  const [platformStates, setPlatformStates] = useState({
    facebook: { status: 'connected', handle: '@creativeagency', followers: '12.4K', reach: '45K', isSyncing: false },
    x: { status: 'disconnected', handle: '@creativeagency', followers: '0', reach: '0', isSyncing: false },
    linkedin: { status: 'connected', handle: 'Creative Agency Inc.', followers: '8.2K', reach: '12K', isSyncing: false }
  });

  useEffect(() => {
    // Parallax background blobs scrolling
    gsap.to(blob1Ref.current, {
      y: 150,
      ease: 'none',
      scrollTrigger: {
        trigger: mainRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      }
    });

    gsap.to(blob2Ref.current, {
      y: -150,
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
  }, []);

  const addCardRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  const handleSync = (key) => {
    setPlatformStates(prev => ({
      ...prev,
      [key]: { ...prev[key], isSyncing: true }
    }));

    setTimeout(() => {
      setPlatformStates(prev => ({
        ...prev,
        [key]: { ...prev[key], isSyncing: false }
      }));
    }, 2000);
  };

  const handleReconnect = (key) => {
    setPlatformStates(prev => ({
      ...prev,
      [key]: { ...prev[key], isSyncing: true } // use sync loader to represent connect status loading
    }));

    setTimeout(() => {
      setPlatformStates(prev => ({
        ...prev,
        [key]: { 
          ...prev[key], 
          status: 'connected', 
          handle: '@creativeagency_pro', 
          followers: '4.8K', 
          reach: '18K',
          isSyncing: false 
        }
      }));
    }, 2000);
  };

  return (
    <div ref={mainRef} className="relative min-h-screen bg-[#0A0C10] text-[#e2e2e8]">
      {/* Background blobs parallax */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div ref={blob1Ref} className="absolute top-[15%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#00f0ff]/5 blur-[120px]" />
        <div ref={blob2Ref} className="absolute bottom-[20%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-[#ff24e4]/5 blur-[120px]" />
      </div>

      <SideNavBar />
      <TopNavBar />

      <main className="pt-24 pb-12 px-6 md:px-8 md:ml-[280px] min-h-screen relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          
          <div>
            <h2 className="font-display-lg text-4xl font-bold text-white mb-2">Integrations</h2>
            <p className="font-body-lg text-lg text-on-surface-variant">Connect your platforms to sync analytics and publish content.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Facebook Card */}
            <div ref={addCardRef} className="glass-card rounded-xl p-6 flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1877F2]/10 rounded-full blur-[40px] -mr-8 -mt-8 pointer-events-none" />
              <div className="flex justify-between items-start mb-6 z-10">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#1877F2]/10 rounded-lg flex items-center justify-center border border-[#1877F2]/30">
                    <span className="text-[#1877F2] font-bold text-2xl">f</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-lg font-semibold text-white">Facebook</h3>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#9bfc00] shadow-[0_0_8px_rgba(155,252,0,0.5)]" />
                      <span className="font-label-sm text-xs text-[#9bfc00] uppercase font-bold">Connected</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4 mb-6 border border-white/5 z-10">
                <p className="font-label-sm text-xs text-on-surface-variant mb-1">Active Account</p>
                <p className="font-body-md text-md text-white font-medium">{platformStates.facebook.handle}</p>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
                  <div>
                    <p className="font-display-lg-mobile text-2xl font-bold text-[#00f0ff]">{platformStates.facebook.followers}</p>
                    <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">Followers</p>
                  </div>
                  <div>
                    <p className="font-display-lg-mobile text-2xl font-bold text-white">{platformStates.facebook.reach}</p>
                    <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">Reach (30d)</p>
                  </div>
                </div>
              </div>

              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSync('facebook')}
                disabled={platformStates.facebook.isSyncing}
                className="w-full py-2.5 rounded-lg font-label-sm text-sm glass-button-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                <span className={`material-symbols-outlined text-[18px] ${platformStates.facebook.isSyncing ? 'animate-spin' : ''}`}>
                  sync
                </span>
                <span>{platformStates.facebook.isSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </motion.button>
            </div>

            {/* X (Twitter) Card */}
            <div ref={addCardRef} className="glass-card rounded-xl p-6 flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] -mr-8 -mt-8 pointer-events-none" />
              <div className="flex justify-between items-start mb-6 z-10">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                    <span className="text-white font-bold text-lg">X</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-lg font-semibold text-white">X (Twitter)</h3>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      <span className={`w-2 h-2 rounded-full ${platformStates.x.status === 'connected' ? 'bg-[#9bfc00] shadow-[0_0_8px_rgba(155,252,0,0.5)]' : 'bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                      <span className={`font-label-sm text-xs font-bold uppercase ${platformStates.x.status === 'connected' ? 'text-[#9bfc00]' : 'text-red-400'}`}>
                        {platformStates.x.status === 'connected' ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {platformStates.x.status === 'connected' ? (
                <div className="bg-black/20 rounded-lg p-4 mb-6 border border-white/5 z-10">
                  <p className="font-label-sm text-xs text-on-surface-variant mb-1">Active Account</p>
                  <p className="font-body-md text-md text-white font-medium">{platformStates.x.handle}</p>
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="font-display-lg-mobile text-2xl font-bold text-[#00f0ff]">{platformStates.x.followers}</p>
                      <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">Followers</p>
                    </div>
                    <div>
                      <p className="font-display-lg-mobile text-2xl font-bold text-white">{platformStates.x.reach}</p>
                      <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">Reach (30d)</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-black/20 rounded-lg p-4 mb-6 border border-white/5 z-10 flex-grow flex items-center justify-center text-center flex-col">
                  <span className="material-symbols-outlined text-surface-variant text-4xl mb-2">link_off</span>
                  <p className="font-body-md text-xs text-on-surface-variant max-w-[200px]">
                    Authentication expired. Please reconnect to continue syncing.
                  </p>
                </div>
              )}

              {platformStates.x.status === 'connected' ? (
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSync('x')}
                  disabled={platformStates.x.isSyncing}
                  className="w-full py-2.5 rounded-lg font-label-sm text-sm glass-button-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 mt-auto"
                >
                  <span className={`material-symbols-outlined text-[18px] ${platformStates.x.isSyncing ? 'animate-spin' : ''}`}>
                    sync
                  </span>
                  <span>{platformStates.x.isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                </motion.button>
              ) : (
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleReconnect('x')}
                  disabled={platformStates.x.isSyncing}
                  className="w-full border border-primary-container text-[#00f0ff] font-label-sm text-sm py-2.5 rounded-lg hover:bg-primary-container/10 transition-colors flex items-center justify-center gap-2 cursor-pointer z-10 mt-auto disabled:opacity-75"
                >
                  <span className={`material-symbols-outlined text-[18px] ${platformStates.x.isSyncing ? 'animate-spin' : ''}`}>
                    login
                  </span>
                  <span>{platformStates.x.isSyncing ? 'Connecting...' : 'Reconnect'}</span>
                </motion.button>
              )}
            </div>

            {/* LinkedIn Card */}
            <div ref={addCardRef} className="glass-card rounded-xl p-6 flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0077B5]/10 rounded-full blur-[40px] -mr-8 -mt-8 pointer-events-none" />
              <div className="flex justify-between items-start mb-6 z-10">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#0077B5]/10 rounded-lg flex items-center justify-center border border-[#0077B5]/30">
                    <span className="text-[#0077B5] font-bold text-xl">in</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-lg font-semibold text-white">LinkedIn</h3>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#9bfc00] shadow-[0_0_8px_rgba(155,252,0,0.5)]" />
                      <span className="font-label-sm text-xs text-[#9bfc00] uppercase font-bold">Connected</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4 mb-6 border border-white/5 z-10">
                <p className="font-label-sm text-xs text-on-surface-variant mb-1">Company Page</p>
                <p className="font-body-md text-md text-white font-medium">{platformStates.linkedin.handle}</p>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
                  <div>
                    <p className="font-display-lg-mobile text-2xl font-bold text-[#00f0ff]">{platformStates.linkedin.followers}</p>
                    <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">Followers</p>
                  </div>
                  <div>
                    <p className="font-display-lg-mobile text-2xl font-bold text-white">{platformStates.linkedin.reach}</p>
                    <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">Impressions</p>
                  </div>
                </div>
              </div>

              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSync('linkedin')}
                disabled={platformStates.linkedin.isSyncing}
                className="w-full py-2.5 rounded-lg font-label-sm text-sm glass-button-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                <span className={`material-symbols-outlined text-[18px] ${platformStates.linkedin.isSyncing ? 'animate-spin' : ''}`}>
                  sync
                </span>
                <span>{platformStates.linkedin.isSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </motion.button>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
