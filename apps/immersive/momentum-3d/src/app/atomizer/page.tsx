'use client'
import React, { useState, useEffect } from 'react';
import { AtomizerTask, AtomicStep, saveAtomizerTask, loadAtomizerTask } from '@/lib/atomizer';
import AtomizerList from '@/components/AtomizerList';
import AtomizerScene from '@/components/AtomizerScene';
import EnergyCheck from '@/components/EnergyCheck';
import { ET } from '@/lib/theme';
import { motion, AnimatePresence } from 'framer-motion';

export default function AtomizerPage() {
  const [input, setInput] = useState('');
  const [task, setTask] = useState<AtomizerTask | null>(null);
  const [loading, setLoading] = useState(false);
  const [shatter, setShatter] = useState(false);
  const [showEnergyCheck, setShowEnergyCheck] = useState(false);

  useEffect(() => {
    setTask(loadAtomizerTask());
  }, []);

  const handleAtomize = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/atomize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: input }),
      });
      const data = await res.json();
      const newTask: AtomizerTask = {
        originalTask: input,
        steps: data.steps.map((text: string, i: number) => ({
          id: Math.random().toString(36).substr(2, 9),
          text,
          completed: false,
        })),
        energyCheckCount: 0,
        createdAt: new Date().toISOString(),
      };
      setTask(newTask);
      saveAtomizerTask(newTask);
      setShatter(true);
      setTimeout(() => setShatter(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = (id: string) => {
    if (!task) return;
    const completedCount = task.steps.filter(s => s.completed).length + 1;
    const newSteps = task.steps.map(s => s.id === id ? { ...s, completed: true } : s);
    const updatedTask = { ...task, steps: newSteps };
    
    setTask(updatedTask);
    saveAtomizerTask(updatedTask);
    setShatter(true);
    setTimeout(() => setShatter(false), 1000);

    // Law 3: Energy check every 6 steps
    if (completedCount % 6 === 0) {
        setShowEnergyCheck(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ color: ET.ink }}>
      <AtomizerScene shatter={shatter} />
      
      <AnimatePresence>
        {showEnergyCheck && (
            <EnergyCheck 
                onContinue={() => setShowEnergyCheck(false)}
                onRest={() => {
                    setShowEnergyCheck(false);
                    window.open('https://www.youtube.com/results?search_query=5+minute+meditation', '_blank');
                }}
            />
        )}
      </AnimatePresence>

      <main className="z-10 w-full max-w-2xl flex flex-col items-center">
        {!task ? (
          <div className="w-full text-center">
            <h1 className="text-4xl font-bold mb-4">What's the <span style={{ color: ET.accent }}>scary task</span>?</h1>
            <p className="text-sm mb-8" style={{ color: ET.sub }}>We'll atomize it into 2-minute steps. Law 1: System {'>'} Emotion.</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAtomize()}
                placeholder="e.g., Do my taxes..."
                className="flex-1 bg-transparent border-b-2 text-2xl py-2 px-1 focus:outline-none transition-all"
                style={{ borderColor: ET.border }}
              />
              <button 
                onClick={handleAtomize}
                disabled={loading || !input}
                className="px-6 py-2 rounded-xl font-bold transition-all disabled:opacity-50"
                style={{ backgroundColor: ET.accent, color: ET.surface }}
              >
                {loading ? 'Atomizing...' : 'Atomize'}
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            <header className="mb-12 text-center">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: ET.sub }}>Project</h2>
                <h1 className="text-2xl font-bold">{task.originalTask}</h1>
                <button 
                    onClick={() => { setTask(null); saveAtomizerTask(null); }}
                    className="mt-4 text-[10px] uppercase font-bold tracking-tighter opacity-50 hover:opacity-100"
                >
                    Abandon & Start New →
                </button>
            </header>
            <AtomizerList steps={task.steps} onComplete={handleComplete} />
          </div>
        )}
      </main>
    </div>
  );
}
