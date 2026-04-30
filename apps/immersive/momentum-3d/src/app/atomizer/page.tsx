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
      
      setShatter(true);
      setTimeout(() => {
        setTask(newTask);
        saveAtomizerTask(newTask);
        setShatter(false);
      }, 1000);
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
    
    // Quick burst on completion
    setShatter(true);
    setTimeout(() => setShatter(false), 500);

    // Law 3: Energy check every 6 steps
    if (completedCount % 6 === 0) {
        setShowEnergyCheck(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: ET.bg }}>
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

      {/* 3D Background */}
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

      <main className="flex-1 z-10 w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-6 py-32">
        {!task ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight" style={{ color: ET.ink }}>
              The <span style={{ color: ET.accent }}>Atomizer</span>
            </h1>
            <p className="text-lg mb-12 max-w-md mx-auto" style={{ color: ET.mid }}>
              Break intimidating projects into tiny, 2-minute steps. Law 1: System &gt; Emotion.
            </p>
            <div className="flex flex-col md:flex-row gap-3">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAtomize()}
                placeholder="What is the scary task?"
                className="flex-1 bg-black/40 border p-4 rounded-xl text-lg outline-none transition-all focus:ring-1 ring-cyan-500"
                style={{ borderColor: ET.border, color: ET.ink }}
              />
              <button 
                onClick={handleAtomize}
                disabled={loading || !input}
                className="px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-50 hover:scale-105 active:scale-95"
                style={{ backgroundColor: ET.accent, color: ET.bg }}
              >
                {loading ? 'Atomizing...' : 'Initialize'}
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="w-full flex flex-col items-center">
            <header className="mb-12 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.3em] mb-3" style={{ color: ET.accent }}>Project Atomized</p>
                <h1 className="text-3xl font-bold mb-4">{task.originalTask}</h1>
                <button 
                    onClick={() => { setTask(null); saveAtomizerTask(null); }}
                    className="text-xs font-medium opacity-50 hover:opacity-100 transition-opacity flex items-center gap-2 mx-auto"
                >
                    Abandon System & Restart <span>↺</span>
                </button>
            </header>
            <AtomizerList steps={task.steps} onComplete={handleComplete} />
          </div>
        )}
      </main>

      {/* Footer (Emergency Style) */}
      <footer className="z-10 py-12 px-6 border-t" style={{ backgroundColor: ET.surface, borderColor: ET.border }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Image src="/logo.png" alt="Adduckivity Logo" width={28} height={28} className="rounded-md" />
            <span className="font-semibold text-sm" style={{ color: ET.ink }}>Adduckivity</span>
          </div>
          <p className="text-sm mb-1" style={{ color: ET.sub }}>
            Part of the <strong style={{ color: ET.ink }}>Duck OS</strong> — Life Architecture for Neurodivergent Creators
          </p>
        </div>
      </footer>
    </div>
  );
}
