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
    <div className="relative bg-white">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="Adduckivity Logo"
              width={35}
              height={35}
              className="rounded-lg"
            />
            <span className="font-semibold text-lg text-gray-900">Adduckivity</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              Home
            </Link>
            <a href="https://wp.adduckivity.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              Blog
            </a>
            <a href="https://duckshort.cc" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              Tools
            </a>
          </div>
        </div>
      </nav>

      {/* 3D Background Scene */}
      <FlywheelScene scrollProgress={scrollProgress} />

      {/* Content Overlay */}
      <div className="relative z-10 bg-gradient-to-b from-black/40 to-white">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-4xl text-center">
            <p className="text-sm font-medium text-gray-300 mb-4 uppercase tracking-wide">ACT-04 Protocol</p>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white drop-shadow-2xl">
              Momentum Protocol
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-12 drop-shadow-lg max-w-2xl mx-auto">
              Action Over Motivation
            </p>
            <div className="animate-bounce">
              <p className="text-gray-300 text-sm">↓ Scroll to begin ↓</p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Stop Waiting for Motivation
            </h2>
            <div className="prose prose-lg text-gray-600 leading-relaxed">
              <p>
                You don't need motivation. You need a system that works when you don't feel like doing anything.
              </p>
              <p>
                The Momentum Protocol (ACT-04) is designed specifically for people who struggle with consistency. Whether you're dealing with ADHD, burnout, or just procrastination—this system bypasses willpower entirely.
              </p>
              <p>
                <strong className="text-gray-900">Core insight:</strong> Motivation is unreliable. Systems are not. This protocol turns action into automatic momentum.
              </p>
            </div>
          </div>
        </section>

        {/* The Problem */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20 bg-gray-50">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              The Motivation Trap
            </h2>
            <div className="prose prose-lg text-gray-600 leading-relaxed">
              <p>
                You've experienced this cycle: You feel inspired → You take action → The feeling fades → You stop → You wait for inspiration again.
              </p>
              <p>
                <strong className="text-red-600">This is a broken feedback loop.</strong> You're outsourcing your agency to your emotional state.
              </p>
              <p>
                The Duck OS philosophy is simple: <em>"Systems over willpower."</em> When you rely on motivation, you're building on quicksand. When you build systems, you're building on bedrock.
              </p>
            </div>
            <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-700 font-medium">
                "The system is the bridge between intention and action." — UDO
              </p>
            </div>
          </div>
        </section>

        {/* The Solution */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              The Flywheel System
            </h2>
            <div className="prose prose-lg text-gray-600 leading-relaxed">
              <p>
                Watch the 3D flywheel in the background. Notice how it speeds up as you scroll? That's not just visual effects—that's how momentum actually works.
              </p>
              <p>
                <strong className="text-gray-900">The Momentum Protocol has 4 phases:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-4 text-gray-700">
                <li>
                  <strong>Activation (2 minutes):</strong> Smallest possible action. Tiny commitment.
                </li>
                <li>
                  <strong>Build Phase (10 minutes):</strong> Work becomes easier. Dopamine starts flowing.
                </li>
                <li>
                  <strong>Momentum State (20+ minutes):</strong> You're in flow. The system carries you.
                </li>
                <li>
                  <strong>Asset Creation:</strong> Output without relying on willpower.
                </li>
              </ol>
              <p>
                <strong className="text-gray-900">Key insight:</strong> You don't need to feel like doing it. You just need to start the flywheel spinning.
              </p>
            </div>
          </div>
        </section>

        {/* Implementation */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20 bg-gray-50">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              How to Run ACT-04
            </h2>
            <div className="space-y-6 prose prose-lg text-gray-600 leading-relaxed">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Step 1: The 2-Minute Activation</h3>
                <p>
                  When you don't want to do anything: Commit to exactly 2 minutes of work. Anyone can do 2 minutes. If you want to stop after 2 minutes, you're allowed to. <span className="text-gray-900">(You almost never will.)</span>
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Step 2: Remove Friction</h3>
                <p>
                  Before you start, eliminate every possible barrier. Phone in another room. Browser tabs closed. Tools ready. The path of least resistance should be working.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Step 3: Ride the Flywheel</h3>
                <p>
                  Once you hit 10 minutes, you'll feel momentum. Don't question it. Don't analyze it. Just ride it. Let the system carry you.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Step 4: Asset Capture</h3>
                <p>
                  When you finish, document what you created. This builds your asset library. You're not just doing work—you're building your empire, one asset at a time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Duck OS Integration */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              ACT-04 in the Duck OS Ecosystem
            </h2>
            <div className="prose prose-lg text-gray-600 leading-relaxed">
              <p>
                The Momentum Protocol isn't isolated—it connects to every other Duck OS protocol:
              </p>
              <ul className="space-y-3">
                <li>
                  <strong className="text-gray-900">+ SURV-01 (Digital Declutter):</strong> Reduces friction so activation becomes automatic
                </li>
                <li>
                  <strong className="text-gray-900">+ Flow State Architecture:</strong> ACT-04 gets you into flow, Flow State keeps you there
                </li>
                <li>
                  <strong className="text-gray-900">+ Single-Tasking Protocol:</strong> Momentum requires focus, not multitasking
                </li>
                <li>
                  <strong className="text-gray-900">+ Weekly Calibration:</strong> Review which ACT-04 sessions created the most assets
                </li>
              </ul>
              <p>
                <strong className="text-gray-900">This is why systems thinking matters.</strong> No protocol stands alone. They're interconnected components of your life operating system.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20 bg-gray-900 text-white">
          <div className="max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Start Your Flywheel Today
            </h2>
            <div className="prose prose-lg text-gray-300 leading-relaxed">
              <p>
                You don't need to wait for motivation. You don't need to feel ready. You just need to activate the system.
              </p>
              <p>
                <strong className="text-white">Right now:</strong> Set a timer for 2 minutes. Start one thing you've been avoiding. Watch the flywheel begin to spin.
              </p>
              <p>
                In 48 hours, you'll have momentum. In 30 days, you'll have a new identity. In 90 days, you'll have an asset library that compounds forever.
              </p>
            </div>
            <div className="mt-12 bg-white rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Want the Complete Duck OS Starter Kit?
              </h3>
              <p className="text-gray-600 mb-6">
                Get 5 protocols, a Notion template, and quick-start guide—free.
              </p>
              <div className="flex flex-col gap-3">
                <input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="px-6 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <button className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors">
                  Get the Kit (Free)
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                No spam. Just systems that work. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 bg-gray-50 border-t border-gray-200">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Image 
                src="/logo.png" 
                alt="Adduckivity Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="font-semibold text-gray-900">Adduckivity</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Part of the <strong className="text-gray-900">Duck OS</strong> — Life Architecture for Neurodivergent Creators
            </p>
            <p className="text-xs text-gray-500">
              Built with Next.js + React Three Fiber. Deployed on Cloudflare Pages.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
