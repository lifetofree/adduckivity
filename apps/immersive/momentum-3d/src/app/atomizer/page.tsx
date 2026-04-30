'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
      const data = await res.json() as { steps?: string[]; error?: string };
      
      if (!data.steps || data.error) {
        throw new Error(data.error || 'No steps returned');
      }
      
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
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b px-6 py-4 flex items-center justify-between" style={{ backgroundColor: 'rgba(10,15,30,0.92)', borderColor: ET.border, backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/logo.png"
              alt="Adduckivity Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-semibold text-lg" style={{ color: ET.ink }}>Adduckivity</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium transition-opacity hover:opacity-70" style={{ color: ET.mid }}>
              Home
            </Link>
            <a href="https://wp.adduckivity.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium transition-opacity hover:opacity-70" style={{ color: ET.mid }}>
              Blog
            </a>
            <a href="https://duckshort.cc" target="_blank" rel="noopener noreferrer" className="text-sm font-medium transition-opacity hover:opacity-70" style={{ color: ET.mid }}>
              Tools
            </a>
          </div>
        </div>
      </nav>

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
