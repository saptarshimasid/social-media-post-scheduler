'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

import SideNavBar from '@/components/SideNavBar';
import TopNavBar from '@/components/TopNavBar';
import { useProfile } from '@/components/ProfileContext';

const avatarOptions = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDK8ykBcnINDy2Khv5YDql-g1s2ny_8R03DQbIeh5Pto-ByYjt9x63YHjCaNtMBtrzs8KMyHACqv9MOK_ztdjM_rLvtfSY2F9t3z-vHlfMDC5NvS_ajoyMUkqvAD6wMC8ohIbaFJ6SvtxZUE2VkPYOdw1oluR_B_ShGFzkpsFkPmhZDC4fc9vm59J2eCxeJZMpFo8RR53lVC8ElYFIAwHI4-qMgQUJGMrvpiIQ_CVaDtk5Aro4s9WjeaT6gaXOIKNV1tnKtVHkALtIh",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAEcBh7IUd9h7aVmvG_82aPc3YM5AzOTEaYLgx-ginFnGvtoR45ICBd_qvDNSlUe82h1lncs2396pA0JXpPR0uJwIG_QloqKBDil9bciqWcVGGUPwdmRJ_1SIslENg9onTfyuUDWYZD6YMJdCLgqahpz4gze2MbWCEyXIpF62ICprJI6Apo-zsJ2RR7iC06vWK2399l06d-H9SobX3b7q1QRwTAMvwL8W7CJHzy4szCCdKdmsVjAOCqBKuOOOLYP4eM58ffCJHMcb1Y",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80"
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [geminiKey, setGeminiKey] = useState(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
  const [djangoUrl, setDjangoUrl] = useState('http://localhost:8000');
  const [nodeUrl, setNodeUrl] = useState('http://localhost:5001');

  // Use Global Profile Context
  const { username, setUsername, email, setEmail, handle, setHandle, bio, setBio, avatarUrl, setAvatarUrl } = useProfile();

  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(false);
  const [notifAI, setNotifAI] = useState(true);

  const [toastMessage, setToastMessage] = useState('');

  const mainRef = useRef(null);
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);

  useEffect(() => {
    // Parallax background blobs
    gsap.to(blob1Ref.current, {
      y: 100,
      ease: 'none',
      scrollTrigger: {
        trigger: mainRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      }
    });

    gsap.to(blob2Ref.current, {
      y: -100,
      ease: 'none',
      scrollTrigger: {
        trigger: mainRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      }
    });
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSaveSettings = () => {
    showToast('Settings saved successfully!');
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

      <main className="pt-24 pb-12 px-6 md:px-8 md:ml-[280px] min-h-screen relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          
          <div>
            <h2 className="font-display-lg text-3xl font-bold text-white tracking-tight">System Settings</h2>
            <p className="font-body-md text-sm text-on-surface-variant mt-1">Configure your workspaces, API bindings, and preferences.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Sidebar navigation tabs */}
            <div className="md:col-span-4 glass-card rounded-xl p-4 flex flex-col gap-2">
              {[
                { id: 'profile', name: 'Profile Configuration', icon: 'person' },
                { id: 'api', name: 'AI & API Configuration', icon: 'key' },
                { id: 'notifications', name: 'Notifications', icon: 'notifications' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-label-sm text-xs transition-all cursor-pointer ${
                    activeTab === tab.id 
                      ? 'bg-primary-container/15 text-primary-container border-r-2 border-primary-container font-semibold' 
                      : 'text-on-surface-variant hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Tab content panel */}
            <div className="md:col-span-8 glass-card rounded-xl p-6 flex flex-col gap-6">
              
              {activeTab === 'profile' && (
                <div className="flex flex-col gap-5">
                  <h3 className="font-headline-md text-md text-white font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container text-sm">person</span>
                    Profile Configuration
                  </h3>
                  
                  <div className="flex items-center gap-4 py-2">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#00f0ff]/50 relative group shrink-0">
                      <img 
                        src={avatarUrl}
                        className="w-full h-full object-cover" 
                        alt="Avatar profile" 
                      />
                    </div>
                    <div>
                      <label className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white hover:bg-white/5 cursor-pointer inline-block">
                        Upload Image
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setAvatarUrl(reader.result); // Base64 string
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <p className="text-[9px] text-on-surface-variant/50 mt-1.5">Max size 2MB recommended.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Display Name</label>
                      <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#00F0FF]/50" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Creator Handle</label>
                      <input 
                        type="text" 
                        value={handle} 
                        onChange={(e) => setHandle(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#00F0FF]/50" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Contact Email</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Creator Bio</label>
                    <textarea 
                      rows={3} 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#00F0FF]/50 resize-none" 
                    />
                  </div>
                </div>
              )}

              {activeTab === 'api' && (
                <div className="flex flex-col gap-5">
                  <h3 className="font-headline-md text-md text-white font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container text-sm">key</span>
                    AI & API Configuration
                  </h3>

                  <div>
                    <label className="block text-xs font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Gemini API Key</label>
                    <input 
                      type="password" 
                      value={geminiKey} 
                      onChange={(e) => setGeminiKey(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white tracking-widest focus:outline-none focus:border-[#00F0FF]/50" 
                    />
                    <p className="text-[10px] text-on-surface-variant/60 mt-1.5">Authorized key used by the Django LangGraph agent flow.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Django AI Agent URL</label>
                    <input 
                      type="text" 
                      value={djangoUrl} 
                      onChange={(e) => setDjangoUrl(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Node/Express API URL</label>
                    <input 
                      type="text" 
                      value={nodeUrl} 
                      onChange={(e) => setNodeUrl(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none" 
                    />
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="flex flex-col gap-5">
                  <h3 className="font-headline-md text-md text-white font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container text-sm">notifications</span>
                    Notification Preferences
                  </h3>

                  <div className="space-y-4 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifEmail} 
                        onChange={() => setNotifEmail(!notifEmail)}
                        className="rounded border-white/10 bg-black/40 text-primary-container focus:ring-[#00f0ff] w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs text-white block">Email Digests</span>
                        <span className="text-[10px] text-on-surface-variant">Receive weekly summaries of reach and follower metrics.</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifPush} 
                        onChange={() => setNotifPush(!notifPush)}
                        className="rounded border-white/10 bg-black/40 text-primary-container focus:ring-[#00f0ff] w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs text-white block">Push Notifications</span>
                        <span className="text-[10px] text-on-surface-variant">Notify immediately when scheduled posts publish.</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifAI} 
                        onChange={() => setNotifAI(!notifAI)}
                        className="rounded border-white/10 bg-black/40 text-primary-container focus:ring-[#00f0ff] w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs text-white block">AI Optimization Prompts</span>
                        <span className="text-[10px] text-on-surface-variant">Suggest time-based optimizations from active feeds.</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-5 py-2.5 bg-primary-container text-black font-label-sm text-xs font-bold uppercase rounded-lg shadow-md cursor-pointer hover:shadow-neon transition-all"
                >
                  Save Settings
                </button>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-[#111318]/90 border border-[#00f0ff]/30 text-white px-5 py-3 rounded-xl shadow-neon backdrop-blur-md text-xs font-semibold flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[#00f0ff] text-sm">check_circle</span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
