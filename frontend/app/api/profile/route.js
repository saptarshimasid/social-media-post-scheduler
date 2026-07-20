import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const defaultProfile = {
  username: 'Alex Nova',
  email: 'alex@creatorhub.co',
  handle: '@nova_creates',
  bio: 'Digital artist, workspace designer, and social strategist.',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK8ykBcnINDy2Khv5YDql-g1s2ny_8R03DQbIeh5Pto-ByYjt9x63YHjCaNtMBtrzs8KMyHACqv9MOK_ztdjM_rLvtfSY2F9t3z-vHlfMDC5NvS_ajoyMUkqvAD6wMC8ohIbaFJ6SvtxZUE2VkPYOdw1oluR_B_ShGFzkpsFkPmhZDC4fc9vm59J2eCxeJZMpFo8RR53lVC8ElYFIAwHI4-qMgQUJGMrvpiIQ_CVaDtk5Aro4s9WjeaT6gaXOIKNV1tnKtVHkALtIh'
};

export async function GET() {
  try {
    const profile = await kv.get('profile');
    if (!profile) {
      return NextResponse.json(defaultProfile);
    }
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile from KV:', error);
    return NextResponse.json(defaultProfile);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Save the entire profile object to KV
    await kv.set('profile', body);
    
    return NextResponse.json(body, { status: 201 });
  } catch (error) {
    console.error('Error updating profile in KV:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
