'use client'
import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AtomizerTask, AtomicStep, saveAtomizerTask, loadAtomizerTask } from '@/lib/atomizer';
import AtomizerList from '@/components/AtomizerList';
import AtomizerScene from '@/components/AtomizerScene';
import EnergyCheck from '@/components/EnergyCheck';
import { ET } from '@/lib/theme';
import { motion, AnimatePresence } from 'framer-motion';

function AtomizerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  
  const [input, setInput] = useState('');
  const [task, setTask] = useState<AtomizerTask | null>(null);
  const [loading, setLoading] = useState(false);
  const [shatter, setShatter] = useState(false);
  const [showEnergyCheck, setShowEnergyCheck] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setTask(loadAtomizerTask());
  }, []);

  // Reliable Auto-Redirect Protocol
  useEffect(() => {
    if (showSuccess && returnTo) {
      const timer = setTimeout(() => {
        // Clear task before returning so it's fresh next time
        saveAtomizerTask(null);
        router.push(returnTo);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, returnTo, router]);

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

    // Check if all steps completed
    if (newSteps.every(s => s.completed)) {
        setShowSuccess(true);
    } else if (completedCount % 6 === 0) {
        // Law 3: Energy check every 6 steps (only if not finished)
        setShowEnergyCheck(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'transparent' }}>
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

      {/* 3D Background — only on first step */}
      {!task && <AtomizerScene shatter={shatter} />}
      
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
        {showSuccess ? (
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-6"
            >
                <div className="w-20 h-20 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                    <span className="text-4xl text-green-500 font-bold">✓</span>
                </div>
                <h1 className="text-4xl font-bold uppercase tracking-tighter" style={{ color: ET.ink }}>Task Eradicated</h1>
                <p className="text-sm uppercase tracking-widest font-mono" style={{ color: ET.mid }}>
                    {returnTo ? 'Initiating system return protocol...' : 'Momentum sustained. Ready for next load.'}
                </p>
                
                <div className="flex flex-col gap-3 pt-4">
                    {returnTo ? (
                        <button 
                            onClick={() => router.push(returnTo)}
                            className="px-8 py-4 bg-cyan-500 text-black font-bold uppercase text-xs tracking-[0.2em] rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                        >
                            Return to Protocol Now →
                        </button>
                    ) : (
                        <button 
                            onClick={() => { setTask(null); setShowSuccess(false); saveAtomizerTask(null); }}
                            className="px-8 py-3 bg-white text-black font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-opacity-80 transition-all"
                        >
                            New Atomization
                        </button>
                    )}
                </div>
            </motion.div>
        ) : !task ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight" style={{ color: ET.ink }}>
              What&apos;s the{' '}
              <span style={{ color: ET.accent }}>scary task?</span>
            </h1>
            <p className="text-sm mb-14 max-w-md mx-auto" style={{ color: ET.sub }}>
              We&apos;ll atomize it into 2-minute steps. Law 1: System &gt; Emotion.
            </p>
            <div className="flex items-center gap-4 w-full max-w-2xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAtomize()}
                placeholder="e.g., Do my taxes..."
                className="flex-1 bg-transparent border-0 border-b-2 pb-3 text-lg outline-none transition-colors"
                style={{ borderColor: ET.border, color: ET.ink }}
                autoFocus
              />
              <button
                onClick={handleAtomize}
                disabled={loading || !input}
                className="shrink-0 px-7 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 hover:scale-105 active:scale-95"
                style={{ backgroundColor: '#1a3a4a', color: ET.accent, border: `1px solid ${ET.border}` }}
              >
                {loading ? 'Atomizing...' : 'Atomize'}
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

export default function AtomizerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center text-cyan-500 font-mono">Initializing Neural Path...</div>}>
      <AtomizerContent />
    </Suspense>
  )
}
