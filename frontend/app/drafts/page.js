'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import SideNavBar from '@/components/SideNavBar';
import TopNavBar from '@/components/TopNavBar';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function DraftWorkspacePage() {
  const [activePlatform, setActivePlatform] = useState('Twitter / X');
  const [composerText, setComposerText] = useState('Testing the new multi-platform drafting features in Creator Hub. The glassmorphism UI feels incredibly fast and sleek. 🚀');
  const [hasMedia, setHasMedia] = useState(true);
  const [scheduledDate, setScheduledDate] = useState('2026-10-24');
  const [scheduledTime, setScheduledTime] = useState('09:00 AM');
  
  // AI Modal States
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState('');
  const [generatedResult, setGeneratedResult] = useState(null);
  const [activePreviewTab, setActivePreviewTab] = useState('instagram');

  // Optimal Time state
  const [isFindingTime, setIsFindingTime] = useState(false);
  const [optimalTimeMessage, setOptimalTimeMessage] = useState('');

  // Toast status message
  const [toastMessage, setToastMessage] = useState('');

  const mainRef = useRef(null);
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    // Parallax background blobs
    gsap.to(blob1Ref.current, {
      y: 130,
      ease: 'none',
      scrollTrigger: {
        trigger: mainRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      }
    });

    gsap.to(blob2Ref.current, {
      y: -130,
      ease: 'none',
      scrollTrigger: {
        trigger: mainRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      }
    });
  }, []);

  const handleOptimalTime = () => {
    setIsFindingTime(true);
    setOptimalTimeMessage('');
    setTimeout(() => {
      setIsFindingTime(false);
      setOptimalTimeMessage('Optimal posting time found: Today at 6:45 PM');
      setScheduledDate(new Date().toISOString().split('T')[0]);
      setScheduledTime('06:45 PM');
    }, 1500);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSaveDraft = async () => {
    // Mock save to file/API
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduledTime: scheduledDate,
          draft: composerText,
          platforms: [activePlatform],
          tags: ['#Draft', '#CreatorHub'],
          image: hasMedia ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZL_MvIhjiER5StKRA7RBi480N8IQcuPqGiQzpoaw8dJQGKScIJNwqm50gVwlZIwbyk8u6FFsVCIgjUMLYFM4C8o4muCbhOz0Lop_TRSeObBHxlhCRjwsx9LJteWrSK5AN7ZsEzxgWlx_dAaQKQ5pKjn-vmYK9lHik82wVi_Y5YuSgqCCOORLjtXi9j3TbZz_Cvb8LfxOWyYIPa4SDfEUEtyLycRBRjklOLJw3NYNWpJ924avq8cSt6khf_J5I_5Z8-dEFmB1Zjgw5' : ''
        })
      });
      if (res.ok) {
        showToast('Draft successfully scheduled to Calendar!');
      } else {
        showToast('Saved draft locally.');
      }
    } catch (err) {
      showToast('Saved draft locally.');
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    setGeneratedResult(null);
    setGenerationStage('Initializing AI Core...');

    try {
      setTimeout(() => setGenerationStage('LangGraph: Orchestrating pipelines...'), 600);
      setTimeout(() => setGenerationStage('LangGraph: Optimizing content nodes...'), 1200);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });

      if (!response.ok) throw new Error('Generation error');
      const data = await response.json();
      setGeneratedResult(data);
    } catch (err) {
      console.error(err);
      setGeneratedResult({
        instagram: `AI generated preview based on prompt: "${aiPrompt}"`,
        linkedin: `AI generated preview based on prompt: "${aiPrompt}"`,
        draft: `AI generated preview based on prompt: "${aiPrompt}"`,
        tags: ['#AIGenerated', '#ModernTech']
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const applyGeneratedPost = () => {
    let content = '';
    if (activePreviewTab === 'instagram') content = generatedResult.instagram;
    else if (activePreviewTab === 'linkedin') content = generatedResult.linkedin;
    else content = generatedResult.draft;

    // Append tags
    if (generatedResult.tags && generatedResult.tags.length > 0) {
      content += '\n\n' + generatedResult.tags.join(' ');
    }

    setComposerText(content);
    setIsAIModalOpen(false);
    setGeneratedResult(null);
    setAiPrompt('');
    showToast('AI content imported to workspace!');
  };

  return (
    <div ref={mainRef} className="relative min-h-screen bg-[#0A0C10] text-[#e2e2e8]">
      {/* Background blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div ref={blob1Ref} className="absolute top-[10%] left-[-8%] w-[45vw] h-[45vw] rounded-full bg-[#00f0ff]/5 blur-[120px]" />
        <div ref={blob2Ref} className="absolute bottom-[10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-[#ff24e4]/5 blur-[120px]" />
      </div>

      <SideNavBar />
      <TopNavBar />

      <main className="flex-1 md:ml-[280px] pt-24 px-6 md:px-8 pb-12 flex flex-col min-h-screen relative z-10">
        
        {/* Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display-lg text-3xl font-bold text-white tracking-tight">Draft Workspace</h2>
            <p className="font-body-md text-sm text-on-surface-variant mt-1">Compose, preview, and schedule your next drop.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleSaveDraft}
              className="px-5 py-2.5 rounded-lg border border-primary-container text-primary-container hover:bg-primary-container/10 transition-colors font-label-sm text-xs uppercase tracking-wider cursor-pointer"
            >
              Save Draft
            </button>
            <button 
              onClick={() => showToast('Post published successfully in real-time!')}
              className="px-5 py-2.5 rounded-lg bg-primary-container text-black font-label-sm text-xs uppercase tracking-wider font-bold shadow-md cursor-pointer hover:shadow-neon transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">send</span>
              Publish Now
            </button>
          </div>
        </div>

        {/* Content columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          
          {/* Left Column: Composer */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Platforms selector */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="font-headline-md text-sm font-semibold text-white mb-4 uppercase tracking-wider">Select Platforms</h3>
              <div className="flex gap-3">
                {['Twitter / X', 'LinkedIn', 'Facebook'].map(p => {
                  const isSelected = activePlatform === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setActivePlatform(p)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full font-label-sm text-xs transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-primary-container/15 border border-primary-container text-primary-container shadow-[0_0_8px_rgba(0,240,255,0.25)]' 
                          : 'bg-black/30 border border-white/10 text-on-surface hover:border-white/20'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {p === 'Twitter / X' ? 'share' : p === 'LinkedIn' ? 'group' : 'public'}
                      </span>
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rich text editor */}
            <div className="glass-card rounded-xl p-0 flex flex-col flex-1 min-h-[400px]">
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5 rounded-t-xl">
                <div className="flex gap-1">
                  {['format_bold', 'format_italic', 'link', 'image', 'mood'].map(tool => (
                    <button 
                      key={tool}
                      type="button"
                      className="p-1.5 rounded hover:bg-white/10 text-on-surface-variant hover:text-white transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">{tool}</span>
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setIsAIModalOpen(true)}
                  className="font-label-sm text-xs text-[#00F0FF] hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                >
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  Use AI Writer
                </button>
              </div>

              <div className="p-6 flex-1 flex flex-col relative group gap-4">
                <textarea 
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                  className="w-full flex-1 bg-transparent border-none text-white font-body-md text-sm focus:ring-0 outline-none resize-none placeholder:text-on-surface-variant/40"
                  placeholder="What's happening? Type your next viral post here..."
                />
                
                {hasMedia && (
                  <div className="relative rounded-lg overflow-hidden border border-white/10 h-44 w-full md:w-3/4 shrink-0">
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZL_MvIhjiER5StKRA7RBi480N8IQcuPqGiQzpoaw8dJQGKScIJNwqm50gVwlZIwbyk8u6FFsVCIgjUMLYFM4C8o4muCbhOz0Lop_TRSeObBHxlhCRjwsx9LJteWrSK5AN7ZsEzxgWlx_dAaQKQ5pKjn-vmYK9lHik82wVi_Y5YuSgqCCOORLjtXi9j3TbZz_Cvb8LfxOWyYIPa4SDfEUEtyLycRBRjklOLJw3NYNWpJ924avq8cSt6khf_J5I_5Z8-dEFmB1Zjgw5" 
                      className="w-full h-full object-cover" 
                      alt="Upload preview"
                    />
                    <button 
                      onClick={() => setHasMedia(false)}
                      className="absolute top-2 right-2 p-1 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-black/90 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm font-bold">close</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Character counts info */}
              <div className="p-4 border-t border-white/5 flex items-center justify-between bg-black/20 rounded-b-xl text-xs text-on-surface-variant font-label-sm">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-container shadow-[0_0_6px_#00f0ff]" />
                    <span>X: <span className="text-white font-medium">{composerText.length}/280</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <span>LinkedIn: <span className="text-white font-medium">{composerText.length}/3000</span></span>
                  </div>
                </div>
                {!hasMedia && (
                  <button 
                    onClick={() => setHasMedia(true)}
                    className="text-[#00F0FF] hover:underline cursor-pointer font-semibold"
                  >
                    + Add Media Mock
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Previews and Optimal Time Scheduling */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Live Preview Card */}
            <div className="glass-card rounded-xl p-0 flex flex-col flex-1 border-t-2 border-t-primary-container overflow-hidden">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="font-headline-md text-xs font-semibold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00f0ff] text-sm">visibility</span>
                  Live Preview ({activePlatform})
                </h3>
              </div>
              <div className="p-6 flex-1 bg-black/35 flex items-center justify-center">
                
                {/* Mock Twitter Post Preview */}
                <div className="bg-[#111318] rounded-xl border border-white/10 p-5 max-w-sm w-full shadow-2xl relative isolate">
                  <div className="flex gap-3 mb-3">
                    <img 
                      alt="Avatar" 
                      className="w-10 h-10 rounded-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK8ykBcnINDy2Khv5YDql-g1s2ny_8R03DQbIeh5Pto-ByYjt9x63YHjCaNtMBtrzs8KMyHACqv9MOK_ztdjM_rLvtfSY2F9t3z-vHlfMDC5NvS_ajoyMUkqvAD6wMC8ohIbaFJ6SvtxZUE2VkPYOdw1oluR_B_ShGFzkpsFkPmhZDC4fc9vm59J2eCxeJZMpFo8RR53lVC8ElYFIAwHI4-qMgQUJGMrvpiIQ_CVaDtk5Aro4s9WjeaT6gaXOIKNV1tnKtVHkALtIh"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-body-md text-xs font-semibold text-white">Alex Nova</span>
                        <span className="material-symbols-outlined text-[#00f0ff] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      </div>
                      <span className="font-label-sm text-[10px] text-on-surface-variant">@nova_creates · Just now</span>
                    </div>
                  </div>
                  <p className="font-body-md text-xs text-white/90 leading-relaxed mb-4 whitespace-pre-wrap">
                    {composerText || "Draft text goes here..."}
                  </p>
                  
                  {hasMedia && (
                    <div className="w-full h-36 bg-cover bg-center rounded-lg border border-white/5 mb-4 overflow-hidden">
                      <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZL_MvIhjiER5StKRA7RBi480N8IQcuPqGiQzpoaw8dJQGKScIJNwqm50gVwlZIwbyk8u6FFsVCIgjUMLYFM4C8o4muCbhOz0Lop_TRSeObBHxlhCRjwsx9LJteWrSK5AN7ZsEzxgWlx_dAaQKQ5pKjn-vmYK9lHik82wVi_Y5YuSgqCCOORLjtXi9j3TbZz_Cvb8LfxOWyYIPa4SDfEUEtyLycRBRjklOLJw3NYNWpJ924avq8cSt6khf_J5I_5Z8-dEFmB1Zjgw5" 
                        className="w-full h-full object-cover" 
                        alt="Preview media" 
                      />
                    </div>
                  )}

                  <div className="flex justify-between text-on-surface-variant text-[11px] px-1 pt-1">
                    <button className="flex items-center gap-1.5 hover:text-primary-container transition-colors cursor-pointer"><span className="material-symbols-outlined text-sm">chat_bubble</span> <span>0</span></button>
                    <button className="flex items-center gap-1.5 hover:text-tertiary-fixed transition-colors cursor-pointer"><span className="material-symbols-outlined text-sm">repeat</span> <span>0</span></button>
                    <button className="flex items-center gap-1.5 hover:text-secondary-container transition-colors cursor-pointer"><span className="material-symbols-outlined text-sm">favorite</span> <span>0</span></button>
                    <button className="flex items-center gap-1.5 hover:text-primary-container transition-colors cursor-pointer"><span className="material-symbols-outlined text-sm">bar_chart</span> <span>0</span></button>
                  </div>
                </div>

              </div>
            </div>

            {/* Schedule Drop panel */}
            <div className="glass-card rounded-xl p-5 flex flex-col gap-4 relative">
              <h3 className="font-headline-md text-sm font-semibold text-white flex items-center gap-2 uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">event</span>
                Schedule Drop
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider mb-2">Date</label>
                  <div className="relative">
                    <input 
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:outline-none" 
                      type="text" 
                    />
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">calendar_today</span>
                  </div>
                </div>
                <div>
                  <label className="block font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider mb-2">Time</label>
                  <div className="relative">
                    <input 
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:outline-none" 
                      type="text" 
                    />
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">schedule</span>
                  </div>
                </div>
              </div>

              {optimalTimeMessage && (
                <div className="text-xs text-[#9bfc00] font-semibold flex items-center gap-1.5 bg-[#9bfc00]/10 p-2.5 rounded-lg border border-[#9bfc00]/20 animate-pulse">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  {optimalTimeMessage}
                </div>
              )}

              <button 
                onClick={handleOptimalTime}
                disabled={isFindingTime}
                className="w-full border border-primary-container text-primary-container py-2.5 rounded-lg font-label-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer hover:bg-[#00f0ff]/10 disabled:opacity-75"
              >
                <span className={`material-symbols-outlined text-sm ${isFindingTime ? 'animate-spin' : ''}`}>
                  {isFindingTime ? 'sync' : 'auto_awesome'}
                </span>
                {isFindingTime ? 'Analyzing Engagement...' : 'Find Optimal Time'}
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* AI Post Generation Dialog */}
      <AnimatePresence>
        {isAIModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if(!isGenerating) setIsAIModalOpen(false); }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl glass-card rounded-2xl p-6 md:p-8 z-10 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-headline-md text-headline-md text-white text-xl">AI Agent Generation Panel</h3>
                  <p className="font-label-sm text-xs text-on-surface-variant mt-1">Powered by LangGraph & Gemini 2.5</p>
                </div>
                <button 
                  disabled={isGenerating}
                  onClick={() => setIsAIModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-on-surface-variant transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {!generatedResult ? (
                <form onSubmit={handleGenerate} className="space-y-6">
                  <div>
                    <label className="block font-label-sm text-on-surface-variant text-xs uppercase mb-2">
                      What would you like the post to be about?
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      disabled={isGenerating}
                      placeholder="e.g. A content creator workstation upgrade showcasing a new matte black mechanical keyboard and RGB smart light bar..."
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder:text-on-surface-variant/40 focus:outline-none focus:border-[#00F0FF]/50 transition-colors focus:ring-1 focus:ring-[#00F0FF]/50 text-sm"
                    />
                  </div>

                  {isGenerating && (
                    <div className="flex flex-col items-center justify-center py-6 gap-3">
                      <div className="relative w-10 h-10 border-4 border-[#00F0FF]/25 border-t-[#00F0FF] rounded-full animate-spin" />
                      <span className="font-label-sm text-xs text-[#00F0FF] tracking-wider animate-pulse uppercase">
                        {generationStage}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      disabled={isGenerating}
                      onClick={() => setIsAIModalOpen(false)}
                      className="px-5 py-2.5 rounded-lg font-label-sm text-label-sm border border-white/10 text-white hover:bg-white/5 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isGenerating || !aiPrompt.trim()}
                      className="px-5 py-2.5 rounded-lg font-label-sm text-label-sm glass-button-primary flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">auto_awesome</span>
                      Run AI Graph
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Results Tabs */}
                  <div className="flex border-b border-white/10 gap-4">
                    {['instagram', 'linkedin', 'draft'].map(tabName => (
                      <button 
                        key={tabName}
                        onClick={() => setActivePreviewTab(tabName)}
                        className={`pb-3 font-label-sm text-sm border-b-2 transition-all cursor-pointer ${
                          activePreviewTab === tabName ? 'text-[#00F0FF] border-[#00F0FF]' : 'text-on-surface-variant border-transparent'
                        }`}
                      >
                        {tabName.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <div className="bg-black/30 border border-white/5 rounded-lg p-4 max-h-[300px] overflow-y-auto">
                    <p className="whitespace-pre-line text-body-md text-white/90 leading-relaxed font-body-md">
                      {activePreviewTab === 'instagram' && generatedResult.instagram}
                      {activePreviewTab === 'linkedin' && generatedResult.linkedin}
                      {activePreviewTab === 'draft' && generatedResult.draft}
                    </p>
                  </div>

                  <div>
                    <span className="block font-label-sm text-xs text-on-surface-variant uppercase mb-2">Recommended Hashtags</span>
                    <div className="flex flex-wrap gap-2">
                      {generatedResult.tags.map(tag => (
                        <span key={tag} className="text-[#00F0FF] font-label-sm text-xs bg-[#00f0ff]/10 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <button
                      onClick={() => setGeneratedResult(null)}
                      className="px-4 py-2 rounded-lg font-label-sm text-label-sm border border-white/10 text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={applyGeneratedPost}
                      className="px-5 py-2.5 rounded-lg font-label-sm text-label-sm glass-button-primary flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">file_download</span>
                      Apply to Workspace
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-[#111318]/90 border border-[#00f0ff]/30 text-white px-5 py-3 rounded-xl shadow-neon backdrop-blur-md text-xs font-semibold flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[#00f0ff] text-sm">info</span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
