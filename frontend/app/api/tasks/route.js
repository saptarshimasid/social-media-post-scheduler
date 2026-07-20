import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tasks = await kv.get('tasks') || [];
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const tasks = await kv.get('tasks') || [];
    
    const newTask = {
      id: Date.now().toString(),
      text: body.text,
      priority: body.priority || 'Normal',
      due: body.due || '',
      completed: false,
    };
    
    tasks.push(newTask);
    await kv.set('tasks', tasks);
    
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
