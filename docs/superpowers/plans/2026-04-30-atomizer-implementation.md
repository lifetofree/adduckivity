# The Atomizer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build "The Atomizer," a Duck OS tool to break scary tasks into <2min steps with 3D feedback.

**Architecture:** A Next.js page (`/atomizer`) using a dedicated Gemini API route for task decomposition. State is managed locally and persisted to `localStorage`. A React Three Fiber scene provides visual rewards (shattering particles) for task completion.

**Tech Stack:** Next.js (App Router), React Three Fiber, Gemini 2.0 Flash, Tailwind CSS (for blur/UI).

---

## 1. Foundation & Types

### Task 1.1: Define Atomizer Types
**Files:**
- Create: `apps/immersive/momentum-3d/src/lib/atomizer.ts`

- [ ] **Step 1: Write the type definitions**
```typescript
export interface AtomicStep {
  id: string;
  text: string;
  completed: boolean;
}

export interface AtomizerTask {
  originalTask: string;
  steps: AtomicStep[];
  energyCheckCount: number;
  createdAt: string;
}

export const STORAGE_KEY = 'duckos:atomizer:active_task';

export function saveAtomizerTask(task: AtomizerTask | null) {
  if (typeof window === 'undefined') return;
  if (!task) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(task));
  }
}

export function loadAtomizerTask(): AtomizerTask | null {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
}
```

- [ ] **Step 2: Commit**
```bash
git add apps/immersive/momentum-3d/src/lib/atomizer.ts
git commit -m "feat(atomizer): add types and storage helpers"
```

---

## 2. AI Backend

### Task 2.1: Create Atomize API Route
**Files:**
- Create: `apps/immersive/momentum-3d/src/app/api/ai/atomize/route.ts`

- [ ] **Step 1: Implement the Gemini decomposition route**
```typescript
export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  const { task } = await req.json();
  if (!task) return NextResponse.json({ error: 'Task required' }, { status: 400 });

  const env = getRequestContext<CloudflareEnv>().env;
  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `
    Act as a "Task Atomizer" for a user with ADHD/Executive Dysfunction.
    The goal is to lower activation energy.
    
    Task to break down: "${task}"
    
    RULES:
    1. Return exactly 12-15 steps.
    2. Every step MUST be executable in under 2 minutes.
    3. Use the "Deep Slice" strategy: Focus on the immediate physical actions to break inertia, not necessarily finishing the entire project.
    4. Keep language extremely simple and non-threatening.
    
    Return ONLY a JSON array of strings. Example: ["Open the website", "Find the login button", ...]
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g, '').trim();
    const steps = JSON.parse(cleaned);
    return NextResponse.json({ steps });
  } catch (err) {
    console.error('[AI/Atomize] Error:', err);
    return NextResponse.json({ error: 'Failed to atomize' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**
```bash
git add apps/immersive/momentum-3d/src/app/api/ai/atomize/route.ts
git commit -m "feat(atomizer): add AI atomize endpoint"
```

---

## 3. UI Components

### Task 3.1: Build AtomicList (Focus Window)
**Files:**
- Create: `apps/immersive/momentum-3d/src/components/AtomizerList.tsx`

- [ ] **Step 1: Implement the "Focus Window" UI**
```tsx
import React from 'react';
import { AtomicStep } from '@/lib/atomizer';
import { ET } from '@/lib/theme';

interface Props {
  steps: AtomicStep[];
  onComplete: (id: string) => void;
}

export default function AtomizerList({ steps, onComplete }: Props) {
  const remaining = steps.filter(s => !s.completed);
  
  return (
    <div className="flex flex-col gap-6 max-w-lg w-full">
      {remaining.map((step, index) => {
        let style = {};
        let label = '';
        
        if (index === 0) {
          style = { color: ET.ink, opacity: 1, scale: '1.05' };
          label = 'Active Action';
        } else if (index < 3) {
          style = { color: ET.mid, opacity: 0.6 };
          label = 'Next Up';
        } else {
          style = { color: ET.sub, opacity: 0.3, filter: 'blur(4px)' };
        }

        return (
          <div 
            key={step.id} 
            className="p-6 rounded-2xl border transition-all duration-500 cursor-pointer group"
            style={{ 
              backgroundColor: index === 0 ? ET.surface : 'transparent',
              borderColor: index === 0 ? ET.accent : ET.border,
              ...style
            }}
            onClick={() => index === 0 && onComplete(step.id)}
          >
            {label && (
              <span className="text-[10px] uppercase tracking-widest font-bold mb-2 block" style={{ color: ET.accent }}>
                {label}
              </span>
            )}
            <p className="text-lg font-medium leading-relaxed">{step.text}</p>
            {index === 0 && (
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: ET.accent }}>
                Done →
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Commit**
```bash
git add apps/immersive/momentum-3d/src/components/AtomizerList.tsx
git commit -m "feat(atomizer): add AtomizerList component"
```

---

## 4. Immersive 3D

### Task 4.1: Build AtomizerScene
**Files:**
- Create: `apps/immersive/momentum-3d/src/components/AtomizerScene.tsx`

- [ ] **Step 1: Implement the React Three Fiber scene**
```tsx
'use client'
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { ET } from '@/lib/theme';

function Particles({ count = 500, shatter = false }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      p[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = radius * Math.cos(phi);
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null!);
  useFrame((state) => {
    ref.current.rotation.y += 0.002;
    ref.current.rotation.x += 0.001;
    if (shatter) {
        // Expand particles outwards
        ref.current.scale.multiplyScalar(1.005);
    }
  });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={ET.accent}
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function AtomizerScene({ shatter = false }) {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={[ET.bg]} />
        <ambientLight intensity={0.5} />
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <Particles shatter={shatter} />
        </Float>
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Commit**
```bash
git add apps/immersive/momentum-3d/src/components/AtomizerScene.tsx
git commit -m "feat(atomizer): add 3D AtomizerScene"
```

---

## 5. Maintenance & Safety

### Task 5.1: Build EnergyCheck Overlay
**Files:**
- Create: `apps/immersive/momentum-3d/src/components/EnergyCheck.tsx`

- [ ] **Step 1: Implement the Law 3 overlay**
```tsx
import React from 'react';
import { ET } from '@/lib/theme';
import { motion } from 'framer-motion';

interface Props {
  onContinue: () => void;
  onRest: () => void;
}

export default function EnergyCheck({ onContinue, onRest }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-md"
      style={{ backgroundColor: 'rgba(10, 15, 30, 0.8)' }}
    >
      <div className="max-w-md w-full bg-surface p-8 rounded-3xl border text-center" style={{ backgroundColor: ET.surface, borderColor: ET.border }}>
        <h2 className="text-2xl font-bold mb-4">Energy Check</h2>
        <p className="text-sm mb-8" style={{ color: ET.sub }}>
            You've completed 6 atomic steps. Respect your system.
            Do you have the energy to continue, or is it time for a 5-minute reset?
        </p>
        <div className="flex flex-col gap-3">
          <button 
            onClick={onContinue}
            className="w-full py-4 rounded-2xl font-bold transition-all"
            style={{ backgroundColor: ET.accent, color: ET.surface }}
          >
            I have energy. Continue →
          </button>
          <button 
            onClick={onRest}
            className="w-full py-4 rounded-2xl font-bold border transition-all"
            style={{ borderColor: ET.border, color: ET.mid }}
          >
            Take 5 mins. (Protect the System)
          </button>
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**
```bash
git add apps/immersive/momentum-3d/src/components/EnergyCheck.tsx
git commit -m "feat(atomizer): add EnergyCheck safety overlay"
```

---

## 6. Page Orchestration

### Task 6.1: Create AtomizerPage
**Files:**
- Create: `apps/immersive/momentum-3d/src/app/atomizer/page.tsx`

- [ ] **Step 1: Implement the main page with state management and energy checks**
```tsx
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
```

- [ ] **Step 2: Commit**
```bash
git add apps/immersive/momentum-3d/src/app/atomizer/page.tsx
git commit -m "feat(atomizer): implement AtomizerPage state and safety logic"
```

---

## 7. Verification

### Task 7.1: Manual Verification
- [ ] **Step 1: Test locally**
Run: `npm run dev`
Visit: `http://localhost:3000/atomizer`
Action: Input a task, verify 3D shatter, verify list appears, verify only 3 steps visible, verify energy check after 6 steps, verify persistence on refresh.

- [ ] **Step 2: Final Commit**
```bash
git commit --allow-empty -m "chore(atomizer): implementation complete and verified"
```
