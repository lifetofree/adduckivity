'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import FlywheelScene from '@/components/FlywheelScene'

export default function MomentumPage() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = window.scrollY / totalHeight
      setScrollProgress(Math.min(Math.max(progress, 0), 1))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative" style={{ backgroundColor: '#F5EFE3' }}>
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b px-6 py-4 flex items-center justify-between" style={{ backgroundColor: 'rgba(250,245,236,0.92)', borderColor: '#D8C9B0', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/logo.png"
              alt="Adduckivity Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-semibold text-lg" style={{ color: '#2C1F14' }}>Adduckivity</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium transition-opacity hover:opacity-70" style={{ color: '#5A4030' }}>
              Home
            </Link>
            <a href="https://wp.adduckivity.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium transition-opacity hover:opacity-70" style={{ color: '#5A4030' }}>
              Blog
            </a>
            <a href="https://duckshort.cc" target="_blank" rel="noopener noreferrer" className="text-sm font-medium transition-opacity hover:opacity-70" style={{ color: '#5A4030' }}>
              Tools
            </a>
          </div>
        </div>
      </nav>

      {/* 3D Background Scene */}
      <FlywheelScene scrollProgress={scrollProgress} />

      {/* Content Overlay */}
      {/* Content overlay — fades from dark hero into warm cream */}
      <div className="relative z-10" style={{ background: 'linear-gradient(to bottom, rgba(44,31,20,0.55) 0%, #F5EFE3 18%)' }}>

        {/* Hero */}
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: 'rgba(250,245,236,0.7)' }}>ACT-04 Protocol</p>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 drop-shadow-2xl" style={{ color: '#FAF5EC' }}>
              Momentum Protocol
            </h1>
            <p className="text-xl md:text-2xl mb-12 drop-shadow-lg max-w-2xl mx-auto" style={{ color: 'rgba(250,245,236,0.85)' }}>
              Action Over Motivation
            </p>
            <div className="animate-bounce">
              <p className="text-sm" style={{ color: 'rgba(250,245,236,0.6)' }}>scroll to begin</p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20" style={{ backgroundColor: '#F5EFE3' }}>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#C07850' }}>Introduction</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: '#2C1F14' }}>
              Stop Waiting for Motivation
            </h2>
            <div className="space-y-5 text-base leading-relaxed" style={{ color: '#5A4030' }}>
              <p>You don't need motivation. You need a system that works when you don't feel like doing anything.</p>
              <p>The Momentum Protocol (ACT-04) is designed specifically for people who struggle with consistency. Whether you're dealing with ADHD, burnout, or just procrastination — this system bypasses willpower entirely.</p>
              <p><strong style={{ color: '#2C1F14' }}>Core insight:</strong> Motivation is unreliable. Systems are not. This protocol turns action into automatic momentum.</p>
            </div>
          </div>
        </section>

        {/* The Problem */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20" style={{ backgroundColor: '#FAF5EC' }}>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#C07850' }}>The Problem</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: '#2C1F14' }}>
              The Motivation Trap
            </h2>
            <div className="space-y-5 text-base leading-relaxed" style={{ color: '#5A4030' }}>
              <p>You've experienced this cycle: You feel inspired → You take action → The feeling fades → You stop → You wait for inspiration again.</p>
              <p><strong style={{ color: '#C07850' }}>This is a broken feedback loop.</strong> You're outsourcing your agency to your emotional state.</p>
              <p>The Duck OS philosophy is simple: <em>"Systems over willpower."</em> When you rely on motivation, you're building on quicksand. When you build systems, you're building on bedrock.</p>
            </div>
            <div className="mt-8 p-6 rounded-xl border" style={{ backgroundColor: '#F5EFE3', borderColor: '#D8C9B0', borderLeft: '3px solid #C07850' }}>
              <p className="font-medium italic" style={{ color: '#5A4030' }}>
                "The system is the bridge between intention and action." — UDO
              </p>
            </div>
          </div>
        </section>

        {/* The Solution */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20" style={{ backgroundColor: '#F5EFE3' }}>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#C07850' }}>The Solution</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: '#2C1F14' }}>
              The Flywheel System
            </h2>
            <div className="space-y-5 text-base leading-relaxed" style={{ color: '#5A4030' }}>
              <p>Watch the 3D flywheel in the background. Notice how it speeds up as you scroll? That's not just visual — that's how momentum actually works.</p>
              <p><strong style={{ color: '#2C1F14' }}>The Momentum Protocol has 4 phases:</strong></p>
            </div>
            <ol className="mt-6 space-y-4">
              {[
                ['Activation (2 min)', 'Smallest possible action. Tiny commitment.'],
                ['Build Phase (10 min)', 'Work becomes easier. Dopamine starts flowing.'],
                ['Momentum State (20+ min)', "You're in flow. The system carries you."],
                ['Asset Creation', 'Output without relying on willpower.'],
              ].map(([title, desc], i) => (
                <li key={i} className="flex gap-4 p-4 rounded-xl border" style={{ backgroundColor: '#FAF5EC', borderColor: '#D8C9B0' }}>
                  <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#C07850', color: '#FAF5EC' }}>{i + 1}</span>
                  <div>
                    <p className="font-semibold text-sm mb-0.5" style={{ color: '#2C1F14' }}>{title}</p>
                    <p className="text-sm" style={{ color: '#7B6248' }}>{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Implementation */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20" style={{ backgroundColor: '#FAF5EC' }}>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#C07850' }}>Implementation</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-10" style={{ color: '#2C1F14' }}>
              How to Run ACT-04
            </h2>
            <div className="space-y-8">
              {[
                ['Step 1: The 2-Minute Activation', 'Commit to exactly 2 minutes of work. Anyone can do 2 minutes. If you want to stop after 2 minutes, you are allowed to. (You almost never will.)'],
                ['Step 2: Remove Friction', 'Before you start, eliminate every possible barrier. Phone in another room. Browser tabs closed. Tools ready. The path of least resistance should be working.'],
                ['Step 3: Ride the Flywheel', "Once you hit 10 minutes, you'll feel momentum. Don't question it. Don't analyze it. Just ride it. Let the system carry you."],
                ['Step 4: Asset Capture', "When you finish, document what you created. This builds your asset library. You're not just doing work — you're building your empire, one asset at a time."],
              ].map(([title, body], i) => (
                <div key={i} className="border-l-2 pl-6" style={{ borderColor: '#C07850' }}>
                  <h3 className="font-semibold text-lg mb-2" style={{ color: '#2C1F14' }}>{title}</h3>
                  <p className="text-base leading-relaxed" style={{ color: '#5A4030' }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Duck OS Integration */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20" style={{ backgroundColor: '#F5EFE3' }}>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#C07850' }}>Ecosystem</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: '#2C1F14' }}>
              ACT-04 in the Duck OS Ecosystem
            </h2>
            <p className="text-base mb-6 leading-relaxed" style={{ color: '#5A4030' }}>
              The Momentum Protocol is not isolated — it connects to every other Duck OS protocol:
            </p>
            <ul className="space-y-4">
              {[
                ['SURV-01 (Digital Declutter)', 'Reduces friction so activation becomes automatic'],
                ['Flow State Architecture', 'ACT-04 gets you into flow, Flow State keeps you there'],
                ['Single-Tasking Protocol', 'Momentum requires focus, not multitasking'],
                ['Weekly Calibration', 'Review which ACT-04 sessions created the most assets'],
              ].map(([title, desc]) => (
                <li key={title} className="flex gap-3 items-start p-4 rounded-xl border" style={{ backgroundColor: '#FAF5EC', borderColor: '#D8C9B0' }}>
                  <span className="text-xs font-bold mt-0.5" style={{ color: '#C07850' }}>+</span>
                  <div>
                    <span className="font-semibold text-sm" style={{ color: '#2C1F14' }}>{title}: </span>
                    <span className="text-sm" style={{ color: '#7B6248' }}>{desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20" style={{ backgroundColor: '#2C1F14' }}>
          <div className="max-w-2xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#FAF5EC' }}>
              Start Your Flywheel Today
            </h2>
            <div className="space-y-4 text-base leading-relaxed mb-12" style={{ color: '#D8C9B0' }}>
              <p>You don't need to wait for motivation. You don't need to feel ready. You just need to activate the system.</p>
              <p><strong style={{ color: '#FAF5EC' }}>Right now:</strong> Set a timer for 2 minutes. Start one thing you've been avoiding. Watch the flywheel begin to spin.</p>
              <p>In 48 hours, you'll have momentum. In 30 days, a new identity. In 90 days, an asset library that compounds forever.</p>
            </div>
            <div className="rounded-2xl p-8 max-w-md mx-auto" style={{ backgroundColor: '#FAF5EC', border: '1px solid #D8C9B0' }}>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#2C1F14' }}>Want the Complete Duck OS Starter Kit?</h3>
              <p className="text-sm mb-6" style={{ color: '#7B6248' }}>Get 5 protocols, a Notion template, and quick-start guide — free.</p>
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="px-4 py-3 rounded-lg text-sm focus:outline-none"
                  style={{ border: '1px solid #D8C9B0', backgroundColor: '#F5EFE3', color: '#2C1F14' }}
                />
                <button
                  className="px-6 py-3 rounded-lg text-sm font-semibold transition-opacity hover:opacity-85"
                  style={{ backgroundColor: '#C07850', color: '#FAF5EC' }}
                >
                  Get the Kit (Free)
                </button>
              </div>
              <p className="text-xs mt-4" style={{ color: '#7B6248' }}>No spam. Just systems that work. Unsubscribe anytime.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t" style={{ backgroundColor: '#FAF5EC', borderColor: '#D8C9B0' }}>
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Image src="/logo.png" alt="Adduckivity Logo" width={28} height={28} className="rounded-md" />
              <span className="font-semibold text-sm" style={{ color: '#2C1F14' }}>Adduckivity</span>
            </div>
            <p className="text-sm mb-1" style={{ color: '#7B6248' }}>
              Part of the <strong style={{ color: '#2C1F14' }}>Duck OS</strong> — Life Architecture for Neurodivergent Creators
            </p>
            <p className="text-xs" style={{ color: '#7B6248' }}>Built with Next.js + React Three Fiber.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
