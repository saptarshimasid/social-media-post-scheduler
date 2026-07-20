import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const tasks = await kv.get('tasks') || [];
    
    const taskIndex = tasks.findIndex(t => t.id === id || String(t.id) === id);
    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    tasks[taskIndex] = { ...tasks[taskIndex], ...body };
    await kv.set('tasks', tasks);
    
    return NextResponse.json(tasks[taskIndex]);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const tasks = await kv.get('tasks') || [];
    
    const updatedTasks = tasks.filter(t => t.id !== id && String(t.id) !== id);
    await kv.set('tasks', updatedTasks);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
