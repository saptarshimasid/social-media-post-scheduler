import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const posts = await kv.get('posts') || [];
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const posts = await kv.get('posts') || [];
    
    const newPost = {
      id: Date.now().toString(),
      date: body.date,
      draft: body.draft,
      instagram: body.instagram || '',
      linkedin: body.linkedin || '',
      tags: body.tags || [],
      platforms: body.platforms || [],
      scheduledTime: body.scheduledTime || 'Scheduled',
      image: body.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeubOjIhhIx5YdlKgojMSomPYRiPH0Kh3UJb1Sjg-_NDcrvUlbRT1g0ZoBG8MMoCT3LmABNfnmmxgqjUay8MrWFYXjwZzoCCT4qq7j5qvOA6SIZ1MlmEQy54TXjeSRdqgQRPy8Xvc7cAsZeT9y7PFbo81IcRZCDQoDjtclIEokbCeX8OEy3p3w5xkw3KPJmfU54h4YQyMNXfoDFWzaTBRET5SswuDQ572W9ardM240TEyVfHqUt33phnFUUCP727gLOiuzg243PjMn'
    };
    
    posts.push(newPost);
    await kv.set('posts', posts);
    
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
