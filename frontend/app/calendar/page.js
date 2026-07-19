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

export default function ContentCalendarPage() {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // July (0-indexed)
  const [todayStr, setTodayStr] = useState('');
  
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [draftSearch, setDraftSearch] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);

  const mainRef = useRef(null);
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const elementRef = useRef(null);

  // Unscheduled drafts list (mocked for rich UX)
  const mockDrafts = [
    { id: 'd1', platform: 'Instagram', title: 'Behind the scenes studio tour! 📸✨', body: 'Behind the scenes of our new studio setup! #workspace #design', icon: 'photo_camera', color: '#ff24e4', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBy1I73hIitmxqNaEI4R_DPNf30I8hSkgL4icf17aRnTPbncMw_Km2i2tNuitmcGu8Q-ohFV3lAeYaw2yMy-FHFJAJsld9Rv-Dlwc0Ld4FsPxmxYqqxQM7cGelHnSIKz3SvZfwnOCxB8JoMsWmi1Zxd1yC1LLKsHUpiEFcgb3b_PDp1GYZx9NLt3d09ryKKCMS2BMS6uDCg1QlcUVE_XGJ0RaUqyFTw7u_OaMiusxzPtaBXQc2yru3e9_VNki7qzbStxqWdJE741Htp' },
    { id: 'd2', platform: 'LinkedIn', title: 'Q3 Product milestones announcement', body: 'Excited to announce our Q3 results. Our team has pushed boundaries in social scheduling...', icon: 'work', color: '#0077b5' },
    { id: 'd3', platform: 'X', title: 'Poll: Design Token Challenges', body: "Quick poll: What's your biggest challenge with content planning? #Designtokens #UX", icon: 'share', color: '#00f0ff' }
  ];

  useEffect(() => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());

    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    setTodayStr(`${y}-${m}-${d}`);

    async function fetchScheduledPosts() {
      try {
        const res = await fetch('http://localhost:5001/api/posts');
        if (res.ok) {
          const data = await res.json();
          setScheduledPosts(data);
        }
      } catch (err) {
        console.error('Error fetching calendar posts:', err);
      }
    }

    fetchScheduledPosts();
  }, []);

  useEffect(() => {
    // Parallax background blobs
    gsap.to(blob1Ref.current, {
      y: 120,
      ease: 'none',
      scrollTrigger: {
        trigger: mainRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      }
    });

    gsap.to(blob2Ref.current, {
      y: -120,
      ease: 'none',
      scrollTrigger: {
        trigger: mainRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      }
    });
  }, []);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const monthName = monthNames[currentMonth];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDayOffset = new Date(currentYear, currentMonth, 1).getDay();

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

  const formatDateStr = (year, month, day) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const days = [];
  // Spacer days (previous month tail)
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
    const dayPosts = scheduledPosts.filter(p => p.scheduledTime === dateStr);
    days.push({
      day: d,
      isCurrentMonth: true,
      dateStr,
      isToday: dateStr === todayStr,
      posts: dayPosts
    });
  }

  const filteredDrafts = mockDrafts.filter(d => 
    d.title.toLowerCase().includes(draftSearch.toLowerCase()) || 
    d.body.toLowerCase().includes(draftSearch.toLowerCase())
  );

  return (
    <div ref={mainRef} className="relative min-h-screen bg-[#0A0C10] text-[#e2e2e8]">
      {/* Background blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div ref={blob1Ref} className="absolute top-[10%] left-[-8%] w-[45vw] h-[45vw] rounded-full bg-[#00f0ff]/5 blur-[120px]" />
        <div ref={blob2Ref} className="absolute bottom-[10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-[#ff24e4]/5 blur-[120px]" />
      </div>

      <SideNavBar />
      <TopNavBar />

      <main className="pt-24 pb-8 px-6 md:px-8 md:ml-[280px] flex-1 flex flex-col xl:flex-row gap-6 relative z-10">
        
        {/* Main Calendar Grid */}
        <div className="flex-1 glass-card rounded-xl p-6 flex flex-col min-h-[650px]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h2 className="font-headline-md text-2xl font-bold text-white tracking-tight">
                {monthName} <span className="text-on-surface-variant/60 font-normal text-lg">{currentYear}</span>
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-on-surface cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button 
                  onClick={handleNextMonth}
                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-on-surface cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-4 mb-3 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">{day}</div>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-2 flex-grow">
            {days.map((item, idx) => {
              if (!item.isCurrentMonth) {
                return (
                  <div key={`spacer-${idx}`} className="glass-card rounded-lg p-2 min-h-[90px] border border-white/5 opacity-30 select-none">
                    <span className="font-label-sm text-xs text-on-surface-variant block text-right mb-1">{item.day}</span>
                  </div>
                );
              }

              return (
                <div 
                  key={`day-${item.day}`}
                  className={`glass-card rounded-lg p-2 min-h-[90px] flex flex-col gap-1.5 border hover:bg-white/5 transition-all relative ${
                    item.isToday 
                      ? 'border-2 border-[#00F0FF] bg-[#00F0FF]/5 shadow-[0_0_15px_rgba(0,240,255,0.25)] z-10' 
                      : 'border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    {item.isToday ? (
                      <span className="text-[9px] font-bold bg-[#00F0FF] text-black px-1.5 py-0.5 rounded shadow-[0_0_6px_rgba(0,240,255,0.4)] select-none">
                        TODAY
                      </span>
                    ) : <div />}
                    <span className={`font-label-sm text-xs block text-right ${
                      item.isToday ? 'text-[#00F0FF] font-bold' : 'text-on-surface-variant'
                    }`}>
                      {item.day}
                    </span>
                  </div>

                  {item.posts.map(post => (
                    <motion.div
                      key={post.id}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => setSelectedPost(post)}
                      className="bg-primary-container/10 border border-primary-container/30 rounded p-1.5 flex items-center gap-1.5 cursor-pointer hover:border-primary-container transition-colors max-w-full overflow-hidden"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] shrink-0" />
                      <span className="font-label-sm text-[10px] text-[#00F0FF] truncate flex-1">{post.draft}</span>
                    </motion.div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar: Unscheduled Drafts & Selected post details */}
        <div className="w-full xl:w-[320px] flex flex-col gap-6 shrink-0">
          
          {/* Post detail panel if selected */}
          {selectedPost && (
            <div className="glass-card rounded-xl p-5 relative border-t-2 border-t-[#00f0ff] flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="font-label-sm text-xs text-primary-fixed font-bold uppercase tracking-wider">Scheduled Post</span>
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="text-on-surface-variant hover:text-white cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
              <p className="font-body-md text-sm text-white leading-relaxed mt-2">"{selectedPost.draft}"</p>
              {selectedPost.image && (
                <div className="w-full h-24 rounded overflow-hidden border border-white/10">
                  <img src={selectedPost.image} className="w-full h-full object-cover" alt="Scheduled post content" />
                </div>
              )}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedPost.tags.map(tag => (
                  <span key={tag} className="text-xs text-primary-container bg-primary-container/10 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Unscheduled drafts panel */}
          <div className="glass-card rounded-xl p-6 flex flex-col max-h-[500px] xl:max-h-[600px] flex-grow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-md font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-fixed text-lg">inbox</span>
                Drafts
              </h3>
              <span className="bg-white/10 text-on-surface font-label-sm text-[10px] px-2 py-0.5 rounded-full">
                {filteredDrafts.length} Items
              </span>
            </div>
            
            <div className="relative mb-4">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input 
                value={draftSearch}
                onChange={(e) => setDraftSearch(e.target.value)}
                className="w-full bg-black/35 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-on-surface-variant focus:outline-none focus:border-[#00F0FF]/50" 
                placeholder="Search drafts..." 
                type="text"
              />
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-grow">
              {filteredDrafts.map(draft => (
                <div 
                  key={draft.id} 
                  className="bg-white/5 p-3 rounded-lg border border-white/5 hover:border-white/20 transition-all group relative cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: draft.color }} />
                      <span className="font-label-sm text-[9px] uppercase tracking-widest font-semibold" style={{ color: draft.color }}>
                        {draft.platform}
                      </span>
                    </div>
                  </div>
                  <p className="font-body-md text-xs text-white line-clamp-2 leading-relaxed">{draft.body}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
