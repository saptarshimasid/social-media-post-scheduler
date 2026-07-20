'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [username, setUsername] = useState('Alex Nova');
  const [email, setEmail] = useState('alex@creatorhub.co');
  const [handle, setHandle] = useState('@nova_creates');
  const [bio, setBio] = useState('Digital artist, workspace designer, and social strategist.');
  const [avatarUrl, setAvatarUrl] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuDK8ykBcnINDy2Khv5YDql-g1s2ny_8R03DQbIeh5Pto-ByYjt9x63YHjCaNtMBtrzs8KMyHACqv9MOK_ztdjM_rLvtfSY2F9t3z-vHlfMDC5NvS_ajoyMUkqvAD6wMC8ohIbaFJ6SvtxZUE2VkPYOdw1oluR_B_ShGFzkpsFkPmhZDC4fc9vm59J2eCxeJZMpFo8RR53lVC8ElYFIAwHI4-qMgQUJGMrvpiIQ_CVaDtk5Aro4s9WjeaT6gaXOIKNV1tnKtVHkALtIh');

  // Fetch from API on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const parsed = await res.json();
          if (parsed.username) setUsername(parsed.username);
          if (parsed.email) setEmail(parsed.email);
          if (parsed.handle) setHandle(parsed.handle);
          if (parsed.bio) setBio(parsed.bio);
          if (parsed.avatarUrl) setAvatarUrl(parsed.avatarUrl);
        }
      } catch (e) {
        console.error('Failed to fetch profile', e);
      }
    }
    fetchProfile();
  }, []);

  // Sync to API when things change
  useEffect(() => {
    // Debounce or just save directly since this is a simple dashboard
    fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, handle, bio, avatarUrl })
    }).catch(e => console.error('Failed to save profile', e));
  }, [username, email, handle, bio, avatarUrl]);

  return (
    <ProfileContext.Provider value={{
      username, setUsername,
      email, setEmail,
      handle, setHandle,
      bio, setBio,
      avatarUrl, setAvatarUrl
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
