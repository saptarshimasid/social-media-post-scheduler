'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SideNavBar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'dashboard' },
    { name: 'Calendar', path: '/calendar', icon: 'calendar_month' },
    { name: 'Drafts', path: '/drafts', icon: 'edit_note' },
    { name: 'Analytics', path: '/analytics', icon: 'monitoring' },
    { name: 'Platforms', path: '/platforms', icon: 'hub' },
    { name: 'Settings', path: '/settings', icon: 'settings' }
  ];

  return (
    <nav className="hidden md:flex flex-col h-full py-6 bg-surface-container/60 backdrop-blur-xl fixed w-[280px] left-0 top-0 border-r border-white/10 shadow-2xl z-50">
      <div className="px-6 mb-8 mt-2 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-surface overflow-hidden border border-white/10 shrink-0">
          <img
            alt="User Profile Avatar"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK8ykBcnINDy2Khv5YDql-g1s2ny_8R03DQbIeh5Pto-ByYjt9x63YHjCaNtMBtrzs8KMyHACqv9MOK_ztdjM_rLvtfSY2F9t3z-vHlfMDC5NvS_ajoyMUkqvAD6wMC8ohIbaFJ6SvtxZUE2VkPYOdw1oluR_B_ShGFzkpsFkPmhZDC4fc9vm59J2eCxeJZMpFo8RR53lVC8ElYFIAwHI4-qMgQUJGMrvpiIQ_CVaDtk5Aro4s9WjeaT6gaXOIKNV1tnKtVHkALtIh"
          />
        </div>
        <div>
          <h1 className="font-headline-md text-md font-bold text-primary-fixed">Creator Hub</h1>
          <p className="font-label-sm text-[11px] text-on-surface-variant/80">Pro Plan</p>
        </div>
      </div>
      
      <ul className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <li key={item.name}>
              <Link href={item.path}>
                <motion.div
                  whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.03)' }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                    isActive 
                      ? 'text-primary-fixed font-bold border-r-2 border-primary-fixed bg-white/5 shadow-[inset_0_0_8px_rgba(0,240,255,0.05)]' 
                      : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  <span 
                    className="material-symbols-outlined" 
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </motion.div>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="px-6 mt-auto">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-lg font-label-sm text-sm glass-button-primary flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New Post
        </motion.button>
      </div>
    </nav>
  );
}
