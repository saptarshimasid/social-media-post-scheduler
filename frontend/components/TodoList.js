'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (task) => {
    const updatedCompleted = !task.completed;
    
    // Optimistic Update
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: updatedCompleted } : t));

    try {
      await fetch(`http://localhost:5001/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: updatedCompleted })
      });
    } catch (err) {
      console.error('Error toggling task:', err);
      // Revert if error
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: !updatedCompleted } : t));
    }
  };

  const handleAddTask = async (e) => {
    if (e.key === 'Enter' && newTaskText.trim()) {
      const text = newTaskText.trim();
      setNewTaskText('');

      try {
        const res = await fetch('http://localhost:5001/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, priority: 'Routine', due: '' })
        });
        const createdTask = await res.json();
        setTasks(prev => [...prev, createdTask]);
      } catch (err) {
        console.error('Error adding task:', err);
      }
    }
  };

  const handleDeleteTask = async (id) => {
    // Optimistic Update
    setTasks(prev => prev.filter(t => t.id !== id));

    try {
      await fetch(`http://localhost:5001/api/tasks/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Error deleting task:', err);
      fetchTasks(); // Revert
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="glass-card rounded-xl p-6 flex-1 flex flex-col min-h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-headline-md text-headline-md text-white text-lg">Daily To-Do</h2>
        <span className="font-label-sm text-label-sm text-[#00F0FF]">
          {completedCount}/{totalCount} Completed
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-surface-container rounded-full mb-6 overflow-hidden">
        <motion.div 
          className="h-full bg-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.8)]"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-on-surface-variant font-label-sm">
          LOADING TASKS...
        </div>
      ) : (
        <ul className="space-y-4 flex-1 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {tasks.map(task => (
              <motion.li 
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className={`flex items-start justify-between gap-3 group p-2 -mx-2 rounded-lg border border-transparent hover:border-white/5 hover:bg-white/2`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <input 
                    type="checkbox" 
                    checked={task.completed}
                    onChange={() => handleToggle(task)}
                    className="neon-checkbox mt-1 shrink-0"
                  />
                  <div className="flex-1">
                    <p className={`font-body-md text-body-md transition-all duration-300 ${
                      task.completed ? 'text-on-surface-variant line-through opacity-70' : 'text-white'
                    }`}>
                      {task.text}
                    </p>
                    {task.due && (
                      <p className={`font-label-sm text-[11px] mt-1 ${
                        task.priority === 'High' ? 'text-secondary-container font-bold' : 'text-on-surface-variant/50'
                      }`}>
                        {task.due}
                      </p>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-on-surface-variant hover:text-red-400 transition-opacity p-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 bg-black/20 rounded-lg p-2 border border-white/5 focus-within:border-[#00F0FF]/50 transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant text-sm ml-2">add</span>
          <input 
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={handleAddTask}
            className="bg-transparent border-none outline-none focus:ring-0 text-body-md font-body-md text-white w-full placeholder:text-on-surface-variant/50"
            placeholder="Add a new task..."
          />
        </div>
      </div>
    </div>
  );
}
