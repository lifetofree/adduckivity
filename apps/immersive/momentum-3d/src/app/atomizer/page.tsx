'use client'
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AtomizerTask, AtomicStep, saveAtomizerTask, loadAtomizerTask } from '@/lib/atomizer';
import AtomizerList from '@/components/AtomizerList';
import EnergyCheck from '@/components/EnergyCheck';
import dynamic from 'next/dynamic';
import { SceneLoader } from '@/components/shared/SceneLoader';

const AtomizerScene = dynamic(() => import('@/components/AtomizerScene'), {
  ssr: false,
  loading: () => <SceneLoader />
});

import { motion, AnimatePresence } from 'framer-motion';
import { useSystem } from '@/lib/system-context';
import SystemGate from '@/components/SystemGate';

function AtomizerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const { isProtected, setFooterVisible } = useSystem();
  
  const [input, setInput] = useState('');
  const [task, setTask] = useState<AtomizerTask | null>(() => loadAtomizerTask());
  const [loading, setLoading] = useState(false);
  const [shatter, setShatter] = useState(false);

  const triggerShatter = React.useCallback((durationMs = 1000) => {
    setShatter(true);
    setTimeout(() => setShatter(false), durationMs);
  }, []);
  const [showEnergyCheck, setShowEnergyCheck] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_TASK_LENGTH = 500;

  // Manage Footer Visibility
  useEffect(() => {
    setFooterVisible(!task)
    return () => setFooterVisible(true)
  }, [task, setFooterVisible])

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
    const trimmed = input.trim();
    if (!trimmed) return;
    if (trimmed.length > MAX_TASK_LENGTH) {
      setError(`Task is too long (max ${MAX_TASK_LENGTH} characters).`);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/ai/atomize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: trimmed }),
      });
      const data = await res.json() as { steps?: string[]; error?: string };

      if (!data.steps || data.error) {
        throw new Error(data.error || 'No steps returned');
      }

      const newTask: AtomizerTask = {
        originalTask: trimmed,
        steps: data.steps.map((text: string) => ({
          id: Math.random().toString(36).slice(2, 11),
          text,
          completed: false,
        })),
        energyCheckCount: 0,
        createdAt: new Date().toISOString(),
      };

      triggerShatter(1000);
      setTimeout(() => {
        setTask(newTask);
        saveAtomizerTask(newTask);
        setInput('');
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Could not atomize task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = (id: string) => {
    if (!task) return;
    const currentCompleted = task.steps.filter(s => s.completed).length + 1;
    const newSteps = task.steps.map(s => s.id === id ? { ...s, completed: true } : s);

    // Law 3: Energy check threshold — standard 6, Protected Mode 3.
    const threshold = isProtected ? 3 : 6;
    const allDone = newSteps.every(s => s.completed);
    const energyCheckTriggered = !allDone && currentCompleted % threshold === 0;

    const updatedTask = {
      ...task,
      steps: newSteps,
      energyCheckCount: task.energyCheckCount + (energyCheckTriggered ? 1 : 0),
    };

    setTask(updatedTask);
    saveAtomizerTask(updatedTask);

    // Quick burst on completion
    triggerShatter(500);

    if (allDone) {
      setShowSuccess(true);
    } else if (energyCheckTriggered) {
      setShowEnergyCheck(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      {/* 3D Background — now always visible for atmosphere */}
      <AtomizerScene shatter={shatter} />
      
      <AnimatePresence>
        {showEnergyCheck && (
            <EnergyCheck 
                stepCount={task?.steps.filter(s => s.completed).length || 0}
                onContinue={() => setShowEnergyCheck(false)}
                onRest={() => {
                    setShowEnergyCheck(false);
                    window.open('https://www.youtube.com/results?search_query=5+minute+meditation', '_blank');
                }}
            />
        )}
      </AnimatePresence>

      <main className="flex-1 z-10 w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-6 py-40">
        {showSuccess ? (
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-6"
            >
                <div className="w-20 h-20 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                    <span className="text-4xl text-green-500 font-bold">✓</span>
                </div>
                <h1 className="text-4xl font-bold uppercase tracking-tighter text-white">Task Eradicated</h1>
                <p className="text-sm uppercase tracking-widest font-mono text-white/50">
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
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-white">
              What&apos;s the{' '}
              <span className="text-cyan-500">scary task?</span>
            </h1>
            <p className="text-sm mb-14 max-w-md mx-auto text-white/40">
              We&apos;ll atomize it into 2-minute steps. Law 1: System &gt; Emotion.
            </p>
            <div className="flex items-center gap-4 w-full max-w-2xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAtomize()}
                placeholder="e.g., Do my taxes..."
                maxLength={MAX_TASK_LENGTH}
                aria-label="Scary task to atomize"
                className="flex-1 bg-transparent border-0 border-b-2 border-white/10 pb-3 text-lg outline-none transition-colors focus:border-cyan-500 text-white"
                autoFocus
              />
              <button
                onClick={handleAtomize}
                disabled={loading || !input}
                className="shrink-0 px-7 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 hover:scale-105 active:scale-95 bg-cyan-900/30 text-cyan-400 border border-cyan-500/20"
              >
                {loading ? 'Atomizing...' : 'Atomize'}
              </button>
            </div>
            {error && (
              <p role="alert" className="text-sm text-red-400 mt-4">
                {error}
              </p>
            )}
          </motion.div>
        ) : (
          <div className="w-full flex flex-col items-center">
            <header className="mb-12 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.3em] mb-3 text-cyan-500">Project Atomized</p>
                <h1 className="text-3xl font-bold mb-4 text-white uppercase tracking-tight">{task.originalTask}</h1>
                <button 
                    onClick={() => { setTask(null); saveAtomizerTask(null); }}
                    className="text-xs font-medium opacity-30 hover:opacity-100 transition-opacity flex items-center gap-2 mx-auto text-white"
                >
                    Abandon System & Restart <span>↺</span>
                </button>
            </header>
            <AtomizerList steps={task.steps} onComplete={handleComplete} />
          </div>
        )}
      </main>
    </div>
  );
}

export default function AtomizerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center text-cyan-500 font-mono tracking-widest animate-pulse">Initializing Neural Path...</div>}>
      <SystemGate toolName="The Atomizer">
        <AtomizerContent />
      </SystemGate>
    </Suspense>
  )
}
