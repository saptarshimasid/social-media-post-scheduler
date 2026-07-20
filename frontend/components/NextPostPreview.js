'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NextPostPreview({ selectedDate }) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form fields
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState('');
  const [generatedResult, setGeneratedResult] = useState(null);
  const [activePreviewTab, setActivePreviewTab] = useState('instagram'); // 'instagram' | 'linkedin' | 'draft'

  // Fetch posts on mount & when date changes
  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      const match = posts.find(p => p.date === selectedDate);
      setSelectedPost(match || null);
    } else {
      setSelectedPost(null);
    }
  }, [selectedDate, posts]);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setPosts([]);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGenerationStage('CONNECTING TO LANGGRAPH AGENT...');

    try {
      // Simulate stages for nice UI
      const stages = [
        'AGENT: INITIALIZING SYSTEM STATE...',
        'AGENT: DRAFTING BASE CONTENT...',
        'AGENT: RUNNING PARALLEL INSTAGRAM OPTIMIZER...',
        'AGENT: RUNNING PARALLEL LINKEDIN OPTIMIZER...',
        'AGENT: EXTRACTING HASHTAG METADATA...',
        'AGENT: VALIDATING OUTPUT SCHEMA...'
      ];

      let stageIdx = 0;
      const interval = setInterval(() => {
        if (stageIdx < stages.length) {
          setGenerationStage(stages[stageIdx]);
          stageIdx++;
        }
      }, 500);

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      clearInterval(interval);
      
      if (!res.ok) throw new Error('AI generation failed');
      
      const data = await res.json();
      setGeneratedResult(data);
    } catch (err) {
      console.error(err);
      setGenerationStage('ERROR ENCOUNTERED. PLEASE RETRY.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveSchedule = async () => {
    if (!generatedResult) return;

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          draft: generatedResult.draft,
          instagram: generatedResult.instagram,
          linkedin: generatedResult.linkedin,
          tags: generatedResult.tags,
          platforms: ['Instagram', 'LinkedIn'],
          scheduledTime: 'Scheduled',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeubOjIhhIx5YdlKgojMSomPYRiPH0Kh3UJb1Sjg-_NDcrvUlbRT1g0ZoBG8MMoCT3LmABNfnmmxgqjUay8MrWFYXjwZzoCCT4qq7j5qvOA6SIZ1MlmEQy54TXjeSRdqgQRPy8Xvc7cAsZeT9y7PFbo81IcRZCDQoDjtclIEokbCeX8OEy3p3w5xkw3KPJmfU54h4YQyMNXfoDFWzaTBRET5SswuDQ572W9ardM240TEyVfHqUt33phnFUUCP727gLOiuzg243PjMn'
        })
      });

      if (res.ok) {
        setGeneratedResult(null);
        setPrompt('');
        setIsModalOpen(false);
        fetchPosts(); // Refresh list
      }
    } catch (err) {
      console.error('Error saving scheduled post:', err);
    }
  };

  return (
    <div className="glass-card rounded-xl p-6 md:p-8 flex-1 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary-container">
            <span className="material-symbols-outlined text-sm">rocket_launch</span>
          </div>
          <h2 className="font-headline-md text-headline-md text-white">Up Next</h2>
        </div>
        
        {selectedPost && (
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/5">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">{selectedPost.scheduledTime}</span>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {selectedPost ? (
          <motion.div 
            key="has-post"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full"
          >
            {/* Media Preview */}
            <div className="rounded-lg overflow-hidden relative border border-white/10 group h-48 md:h-full min-h-[200px]">
              <img 
                alt="Post preview image" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src={selectedPost.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              {/* Platform Chips */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                {selectedPost.platforms.includes('Instagram') && (
                  <span className="px-2 py-1 bg-surface-container/80 backdrop-blur-md rounded border border-white/10 font-label-sm text-[10px] text-white flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px] text-primary-fixed">photo_camera</span> Instagram
                  </span>
                )}
                {selectedPost.platforms.includes('LinkedIn') && (
                  <span className="px-2 py-1 bg-[#0077b5]/20 backdrop-blur-md rounded border border-[#0077b5]/50 font-label-sm text-[10px] text-white flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px] text-[#0077b5]">work</span> LinkedIn
                  </span>
                )}
              </div>
            </div>

            {/* Content Details */}
            <div className="flex flex-col justify-between">
              <div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-4 line-clamp-6 leading-relaxed">
                  "{selectedPost.draft}"
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedPost.tags.map(tag => (
                    <span key={tag} className="text-primary-fixed font-label-sm text-label-sm bg-primary-container/10 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 rounded-lg font-label-sm text-label-sm border border-white/10 text-on-surface hover:bg-white/5 transition-all cursor-pointer"
                >
                  Regenerate
                </button>
                <button className="px-4 py-2 rounded-lg font-label-sm text-label-sm glass-button-primary cursor-pointer">
                  Publish Now
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="empty-post"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-8 text-center"
          >
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/50 mb-3">
              calendar_today
            </span>
            <h3 className="font-headline-md text-white text-md mb-1">No Posts Scheduled</h3>
            <p className="font-body-md text-sm text-on-surface-variant max-w-sm mb-6">
              Create a custom post or generate one using our LangGraph AI pipeline.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 rounded-lg font-label-sm text-label-sm glass-button-primary flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">smart_toy</span>
              Draft Post with AI
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Post Generation Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if(!isGenerating) setIsModalOpen(false); }}
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
                  onClick={() => setIsModalOpen(false)}
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
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      disabled={isGenerating}
                      placeholder="e.g. A content creator workstation upgrade showcasing a new matte black mechanical keyboard and RGB smart light bar..."
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder:text-on-surface-variant/40 focus:outline-none focus:border-[#00F0FF]/50 transition-colors focus:ring-1 focus:ring-[#00F0FF]/50"
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
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 rounded-lg font-label-sm text-label-sm border border-white/10 text-white hover:bg-white/5 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isGenerating || !prompt.trim()}
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
                    <button 
                      onClick={() => setActivePreviewTab('instagram')}
                      className={`pb-3 font-label-sm text-sm border-b-2 transition-all cursor-pointer ${
                        activePreviewTab === 'instagram' ? 'text-[#00F0FF] border-[#00F0FF]' : 'text-on-surface-variant border-transparent'
                      }`}
                    >
                      Instagram Optimized
                    </button>
                    <button 
                      onClick={() => setActivePreviewTab('linkedin')}
                      className={`pb-3 font-label-sm text-sm border-b-2 transition-all cursor-pointer ${
                        activePreviewTab === 'linkedin' ? 'text-[#00F0FF] border-[#00F0FF]' : 'text-on-surface-variant border-transparent'
                      }`}
                    >
                      LinkedIn Optimized
                    </button>
                    <button 
                      onClick={() => setActivePreviewTab('draft')}
                      className={`pb-3 font-label-sm text-sm border-b-2 transition-all cursor-pointer ${
                        activePreviewTab === 'draft' ? 'text-[#00F0FF] border-[#00F0FF]' : 'text-on-surface-variant border-transparent'
                      }`}
                    >
                      Base Draft
                    </button>
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
                      Back to Edit Prompt
                    </button>
                    <button
                      onClick={handleSaveSchedule}
                      className="px-5 py-2.5 rounded-lg font-label-sm text-label-sm glass-button-primary flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">schedule_send</span>
                      Schedule for {selectedDate}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
