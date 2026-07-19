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

export default function AnalyticsPage() {
  const [activeRange, setActiveRange] = useState('30D');
  const mainRef = useRef(null);
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const elementsRef = useRef([]);

  useEffect(() => {
    // Parallax background blobs scrolling
    gsap.to(blob1Ref.current, {
      y: 180,
      ease: 'none',
      scrollTrigger: {
        trigger: mainRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      }
    });

    gsap.to(blob2Ref.current, {
      y: -200,
      ease: 'none',
      scrollTrigger: {
        trigger: mainRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      }
    });

    // Fade-in bento cards entrance
    gsap.fromTo(
      elementsRef.current.filter(Boolean),
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out' }
    );
  }, []);

  const addElementRef = (el) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  };

  const metrics = [
    {
      title: 'Total Reach',
      value: '2.4M',
      change: '+12.5%',
      isPositive: true,
      icon: 'visibility',
      color: '#00f0ff',
      sparkline: (
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30">
          <path className="drop-shadow-[0_0_4px_rgba(0,240,255,0.6)]" d="M0,25 L10,22 L20,28 L30,15 L40,18 L50,10 L60,12 L70,5 L80,8 L90,2 L100,0" fill="none" stroke="#00f0ff" strokeWidth="2"></path>
          <path d="M0,30 L0,25 L10,22 L20,28 L30,15 L40,18 L50,10 L60,12 L70,5 L80,8 L90,2 L100,0 L100,30 Z" fill="url(#grad-cyan)" opacity="0.15"></path>
          <defs>
            <linearGradient id="grad-cyan" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="1"></stop>
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      title: 'Engagement',
      value: '5.8%',
      change: '+4.2%',
      isPositive: true,
      icon: 'favorite',
      color: '#ff24e4',
      sparkline: (
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30">
          <path className="drop-shadow-[0_0_4px_rgba(255,36,228,0.6)]" d="M0,20 L15,18 L30,22 L45,15 L60,10 L75,12 L90,5 L100,8" fill="none" stroke="#ff24e4" strokeWidth="2"></path>
          <path d="M0,30 L0,20 L15,18 L30,22 L45,15 L60,10 L75,12 L90,5 L100,8 L100,30 Z" fill="url(#grad-magenta)" opacity="0.15"></path>
          <defs>
            <linearGradient id="grad-magenta" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ff24e4" stopOpacity="1"></stop>
              <stop offset="100%" stopColor="#ff24e4" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      title: 'Follower Growth',
      value: '+12K',
      change: '-1.1%',
      isPositive: false,
      icon: 'group_add',
      color: '#9bfc00',
      sparkline: (
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30">
          <path className="drop-shadow-[0_0_4px_rgba(155,252,0,0.6)]" d="M0,10 L20,15 L40,12 L60,20 L80,18 L100,25" fill="none" stroke="#9bfc00" strokeWidth="2"></path>
          <path d="M0,30 L0,10 L20,15 L40,12 L60,20 L80,18 L100,25 L100,30 Z" fill="url(#grad-green)" opacity="0.15"></path>
          <defs>
            <linearGradient id="grad-green" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#9bfc00" stopOpacity="1"></stop>
              <stop offset="100%" stopColor="#9bfc00" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      title: 'CTR',
      value: '3.2%',
      change: '+8.4%',
      isPositive: true,
      icon: 'ads_click',
      color: '#00f0ff',
      sparkline: (
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30">
          <path className="drop-shadow-[0_0_4px_rgba(0,240,255,0.6)]" d="M0,28 L25,20 L50,22 L75,10 L100,5" fill="none" stroke="#00f0ff" strokeWidth="2"></path>
          <path d="M0,30 L0,28 L25,20 L50,22 L75,10 L100,5 L100,30 Z" fill="url(#grad-cyan2)" opacity="0.15"></path>
          <defs>
            <linearGradient id="grad-cyan2" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="1"></stop>
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
        </svg>
      )
    }
  ];

  return (
    <div ref={mainRef} className="relative min-h-screen bg-[#0A0C10] text-[#e2e2e8]">
      {/* Background blobs parallax */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div ref={blob1Ref} className="absolute top-[10%] left-[-8%] w-[45vw] h-[45vw] rounded-full bg-[#00f0ff]/5 blur-[120px]" />
        <div ref={blob2Ref} className="absolute bottom-[10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-[#ff24e4]/5 blur-[120px]" />
      </div>

      <SideNavBar />
      <TopNavBar />

      <main className="pt-24 pb-12 px-6 md:px-8 md:ml-[280px] min-h-screen relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-headline-md text-3xl font-semibold text-white tracking-tight">Analytics Dashboard</h2>
              <p className="font-body-md text-sm text-on-surface-variant mt-1">Track your content performance across all platforms.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="glass-card flex items-center p-1 rounded-lg">
                {['7D', '30D', '90D'].map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setActiveRange(range)}
                    className={`px-4 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                      activeRange === range 
                        ? 'bg-white/10 text-primary-fixed shadow-sm' 
                        : 'text-on-surface-variant hover:text-white'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <button 
                type="button"
                className="glass-button-action p-2 rounded-lg text-white hover:text-primary-fixed transition-colors flex items-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">filter_list</span>
              </button>
            </div>
          </div>

          {/* Metric cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, idx) => (
              <div
                key={metric.title}
                ref={addElementRef}
                className="glass-card p-5 rounded-xl relative overflow-hidden group hover:border-[#00f0ff]/20 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 text-white pointer-events-none">
                  <span className="material-symbols-outlined text-[64px] -rotate-12">{metric.icon}</span>
                </div>
                <div className="flex justify-between items-start mb-4">
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{metric.title}</p>
                  <span className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded ${
                    metric.isPositive ? 'text-tertiary-fixed bg-tertiary-fixed/10' : 'text-error bg-error/10'
                  }`}>
                    <span className="material-symbols-outlined text-[14px] mr-0.5">
                      {metric.isPositive ? 'trending_up' : 'trending_down'}
                    </span>
                    {metric.change}
                  </span>
                </div>
                <h3 className="font-display-lg-mobile text-3xl font-bold text-white mb-4">{metric.value}</h3>
                
                <div className="h-10 w-full relative">{metric.sparkline}</div>
              </div>
            ))}
          </div>

          {/* Charts grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left side: Line Chart */}
            <div ref={addElementRef} className="lg:col-span-8 glass-card rounded-xl p-6 flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-md text-lg font-semibold text-white">Engagement Trends</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary-container shadow-[0_0_5px_#00f0ff]" />
                    <span className="text-xs text-on-surface-variant">Instagram</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-secondary-container shadow-[0_0_5px_#ff24e4]" />
                    <span className="text-xs text-on-surface-variant">X</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 relative w-full border-b border-l border-white/10 pb-4 pl-4 mt-4">
                <div className="absolute -left-2 top-0 bottom-4 flex flex-col justify-between text-[10px] text-on-surface-variant items-end pr-2 w-8">
                  <span>10k</span>
                  <span>7.5k</span>
                  <span>5k</span>
                  <span>2.5k</span>
                  <span>0</span>
                </div>
                
                <div className="absolute inset-0 left-4 bottom-4 flex flex-col justify-between">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-full h-px border-dashed border-t border-white/5" />
                  ))}
                  <div className="w-full h-px bg-transparent" />
                </div>
                
                <svg className="w-full h-full absolute inset-0 left-4 bottom-4" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path className="drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" d="M0,80 C10,75 20,60 30,65 C40,70 50,40 60,30 C70,20 80,45 90,15 C95,5 100,10 100,10" fill="none" stroke="#00f0ff" strokeWidth="1.5"></path>
                  <path className="drop-shadow-[0_0_8px_rgba(255,36,228,0.8)]" d="M0,90 C15,85 25,75 35,80 C45,85 55,60 65,55 C75,50 85,70 100,40" fill="none" stroke="#ff24e4" strokeWidth="1.5"></path>
                  
                  {/* Interactive dots with hover scale */}
                  <circle cx="30" cy="65" fill="#111318" r="2.5" stroke="#00f0ff" strokeWidth="1.5" className="cursor-pointer hover:r-4 transition-all" />
                  <circle cx="60" cy="30" fill="#111318" r="2.5" stroke="#00f0ff" strokeWidth="1.5" className="cursor-pointer hover:r-4 transition-all" />
                  <circle cx="90" cy="15" fill="#111318" r="2.5" stroke="#00f0ff" strokeWidth="1.5" className="cursor-pointer hover:r-4 transition-all" />
                  <circle cx="35" cy="80" fill="#111318" r="2.5" stroke="#ff24e4" strokeWidth="1.5" className="cursor-pointer hover:r-4 transition-all" />
                  <circle cx="65" cy="55" fill="#111318" r="2.5" stroke="#ff24e4" strokeWidth="1.5" className="cursor-pointer hover:r-4 transition-all" />
                </svg>
                
                <div className="absolute -bottom-6 left-4 right-0 flex justify-between text-[10px] text-on-surface-variant pt-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side: Donut Chart */}
            <div ref={addElementRef} className="lg:col-span-4 glass-card rounded-xl p-6 flex flex-col h-[400px]">
              <h3 className="font-headline-md text-lg font-semibold text-white mb-6">Audience Distribution</h3>
              <div className="flex-1 flex flex-col items-center justify-center relative">
                <div className="w-40 h-40 rounded-full border-[12px] border-surface-variant relative flex items-center justify-center">
                  <div className="absolute inset-[-12px] rounded-full border-[12px] border-primary-container" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 50%)', filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.4))' }}></div>
                  <div className="absolute inset-[-12px] rounded-full border-[12px] border-secondary-container" style={{ clipPath: 'polygon(50% 50%, 0 50%, 0 0, 40% 0)', filter: 'drop-shadow(0 0 8px rgba(255,36,228,0.4))' }}></div>
                  <div className="absolute inset-[-12px] rounded-full border-[12px] border-tertiary-fixed" style={{ clipPath: 'polygon(50% 50%, 40% 0, 100% 0)', filter: 'drop-shadow(0 0 8px rgba(155,252,0,0.4))' }}></div>
                  <div className="text-center z-10 bg-[#0A0C10]/80 w-28 h-28 rounded-full flex flex-col items-center justify-center border border-white/5">
                    <span className="font-display-lg-mobile text-2xl font-bold text-white">100%</span>
                    <span className="text-[9px] text-on-surface-variant uppercase tracking-wider">Total Engaged</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {[
                  { name: 'Instagram', val: '55%', bg: 'bg-primary-container' },
                  { name: 'X', val: '30%', bg: 'bg-secondary-container' },
                  { name: 'LinkedIn', val: '15%', bg: 'bg-tertiary-fixed' }
                ].map(plat => (
                  <div key={plat.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${plat.bg}`} />
                      <span className="text-on-surface">{plat.name}</span>
                    </div>
                    <span className="font-medium text-white">{plat.val}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Top Performing Posts */}
          <div ref={addElementRef} className="glass-card rounded-xl p-6 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-lg font-semibold text-white">Top Performing Posts</h3>
              <button type="button" className="text-primary-fixed text-sm hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-on-surface-variant font-label-sm text-xs uppercase tracking-wider">
                    <th className="pb-3 pl-2 font-medium">Post Details</th>
                    <th className="pb-3 px-4 font-medium">Platform</th>
                    <th className="pb-3 px-4 font-medium text-right">Likes</th>
                    <th className="pb-3 px-4 font-medium text-right">Comments</th>
                    <th className="pb-3 px-4 font-medium text-right">Shares</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    {
                      title: 'Launch Announce: Synthwave UI Kit',
                      date: 'Oct 12, 10:00 AM',
                      snippet: 'Just dropped our newest asset pack...',
                      icon: 'photo_camera',
                      iconBg: 'bg-primary-container/10 text-primary-container border-primary-container/30',
                      likes: '12.4K', comments: '842', shares: '1.2K',
                      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBy1I73hIitmxqNaEI4R_DPNf30I8hSkgL4icf17aRnTPbncMw_Km2i2tNuitmcGu8Q-ohFV3lAeYaw2yMy-FHFJAJsld9Rv-Dlwc0Ld4FsPxmxYqqxQM7cGelHnSIKz3SvZfwnOCxB8JoMsWmi1Zxd1yC1LLKsHUpiEFcgb3b_PDp1GYZx9NLt3d09ryKKCMS2BMS6uDCg1QlcUVE_XGJ0RaUqyFTw7u_OaMiusxzPtaBXQc2yru3e9_VNki7qzbStxqWdJE741Htp'
                    },
                    {
                      title: 'Setup Tour 2024',
                      date: 'Oct 10, 2:30 PM',
                      snippet: 'A quick look at my updated workstation.',
                      icon: 'chat',
                      iconBg: 'bg-secondary-container/10 text-secondary-container border-secondary-container/30',
                      likes: '8.9K', comments: '456', shares: '2.1K',
                      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6C3vhY4DEbF0pnlda_MyrnNKIDFM_3-QUhSQ_pSRvjSJBz1BsWyrpdgE869ud3VWilElH4GZaS72b9ZnxKwnQ9kR8kGvjE--haFZexo09G1j23Ji3byfPrug44JQslz0yF6ifsW_2q8irry4-yE9GV7v2wOjmtfCIU1qMhm6q1CIcqE0ta33IuE--c4JGYITKfjBO30un664nFSjFmOKh45KJNFOSpnPFB0-r-ssnPeSPWby-TGpjLjqOfDSPhdR-1i5YwFrZC0bv'
                    }
                  ].map(post => (
                    <tr key={post.title} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                      <td className="py-4 pl-2">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded bg-surface-container border border-white/10 overflow-hidden relative shrink-0">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="max-w-[300px]">
                            <p className="text-white font-medium truncate group-hover:text-primary-fixed transition-colors">{post.title}</p>
                            <p className="text-xs text-on-surface-variant truncate mt-1">{post.date} • {post.snippet}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full border ${post.iconBg}`}>
                          <span className="material-symbols-outlined text-[16px]">{post.icon}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right text-white font-medium">{post.likes}</td>
                      <td className="py-4 px-4 text-right text-on-surface">{post.comments}</td>
                      <td className="py-4 px-4 text-right text-on-surface">{post.shares}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audience Demographics */}
          <div ref={addElementRef} className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h3 className="font-headline-md text-xl font-semibold text-white">Audience Demographics</h3>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#00f0ff]/10 text-primary-container border border-[#00f0ff]/30">
                  <span className="material-symbols-outlined text-[14px]">hub</span>
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Demographic left card */}
              <div className="glass-card rounded-xl p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-headline-md text-md font-semibold text-white">Age & Gender Distribution</h4>
                  <span className="text-[10px] text-primary-fixed uppercase tracking-widest opacity-60">All Platforms</span>
                </div>
                
                <div>
                  <h5 className="text-xs text-on-surface-variant uppercase tracking-wider mb-4">Age Groups</h5>
                  <div className="space-y-4">
                    {[
                      { age: '18-24', pct: '45%' },
                      { age: '25-34', pct: '30%' },
                      { age: '35-44', pct: '15%' },
                      { age: '45+', pct: '10%' }
                    ].map(group => (
                      <div key={group.age}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-on-surface">{group.age}</span>
                          <span className="text-white font-medium">{group.pct}</span>
                        </div>
                        <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                          <div className="h-full bg-primary-container shadow-[0_0_8px_rgba(0,240,255,0.6)] rounded-full" style={{ width: group.pct }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2">
                  <h5 className="text-xs text-on-surface-variant uppercase tracking-wider mb-4">Gender</h5>
                  <div className="flex items-center gap-1.5 h-3 w-full rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-secondary-container shadow-[0_0_5px_rgba(255,36,228,0.6)] rounded-l-full" style={{ width: '60%' }} />
                    <div className="h-full bg-primary-container shadow-[0_0_5px_rgba(0,240,255,0.6)]" style={{ width: '35%' }} />
                    <div className="h-full bg-tertiary-fixed shadow-[0_0_5px_rgba(155,252,0,0.6)] rounded-r-full" style={{ width: '5%' }} />
                  </div>
                  <div className="flex justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
                      <span className="text-on-surface">Female <span className="text-white ml-1 font-medium">60%</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary-container" />
                      <span className="text-on-surface">Male <span className="text-white ml-1 font-medium">35%</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed" />
                      <span className="text-on-surface">Non-binary <span className="text-white ml-1 font-medium">5%</span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demographic right card */}
              <div className="glass-card rounded-xl p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-headline-md text-md font-semibold text-white">Top Countries</h4>
                  <span className="text-[10px] text-primary-fixed uppercase tracking-widest opacity-60">All Platforms</span>
                </div>
                
                <div className="space-y-4">
                  {[
                    { num: 1, name: 'United States', pct: '40%' },
                    { num: 2, name: 'United Kingdom', pct: '25%' },
                    { num: 3, name: 'Canada', pct: '15%' },
                    { num: 4, name: 'Germany', pct: '10%' },
                    { num: 5, name: 'Australia', pct: '10%' }
                  ].map(country => (
                    <div key={country.name} className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-semibold text-on-surface-variant shrink-0">
                        {country.num}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-on-surface font-medium">{country.name}</span>
                          <span className="text-white font-medium">{country.pct}</span>
                        </div>
                        <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                          <div className="h-full bg-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.6)] rounded-full" style={{ width: country.pct }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
