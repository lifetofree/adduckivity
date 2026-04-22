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
    <div className="relative">
      {/* Navigation Header with Logo */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/70 backdrop-blur-md border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image 
            src="/logo.png" 
            alt="Adduckivity Logo"
            width={35}
            height={35}
            className="rounded-lg"
          />
          <span className="text-white font-semibold">Adduckivity</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
            Home
          </Link>
          <a href="https://wp.adduckivity.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors text-sm">
            Blog
          </a>
          <a href="https://duckshort.cc" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors text-sm">
            Tools
          </a>
        </div>
      </nav>

      {/* 3D Background Scene */}
      <FlywheelScene scrollProgress={scrollProgress} />

      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-4xl text-center">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white drop-shadow-2xl">
              ACT-04
            </h1>
            <p className="text-2xl md:text-4xl text-green-300 mb-8 drop-shadow-xl">
              Momentum Protocol
            </p>
            <p className="text-xl text-gray-200 mb-12 drop-shadow-lg">
              Action Over Motivation
            </p>
            <div className="animate-bounce">
              <p className="text-gray-300">↓ Scroll to activate the flywheel ↓</p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-transparent to-black/50">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold mb-8 text-white drop-shadow-xl">
              Stop Waiting for Motivation
            </h2>
            <div className="space-y-6 text-lg text-gray-200 leading-relaxed">
              <p className="drop-shadow-lg">
                You don't need motivation. You need a system that works when you don't feel like doing anything.
              </p>
              <p className="drop-shadow-lg">
                The Momentum Protocol (ACT-04) is designed specifically for people who struggle with consistency. Whether you're dealing with ADHD, burnout, or just the human condition of procrastination—this system bypasses willpower entirely.
              </p>
              <p className="drop-shadow-lg">
                <strong className="text-green-300">Core insight:</strong> Motivation is unreliable. Systems are not. This protocol turns action into automatic momentum.
              </p>
            </div>
          </div>
        </section>

        {/* The Problem */}
        <section className="min-h-screen flex items-center justify-center px-6 bg-black/30">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold mb-8 text-white drop-shadow-xl">
              The Motivation Trap
            </h2>
            <div className="space-y-6 text-lg text-gray-200 leading-relaxed">
              <p className="drop-shadow-lg">
                You've experienced this cycle: You feel inspired → You take action → The feeling fades → You stop → You wait for inspiration again.
              </p>
              <p className="drop-shadow-lg">
                <strong className="text-red-400">This is a broken feedback loop.</strong> You're outsourcing your agency to your emotional state.
              </p>
              <p className="drop-shadow-lg">
                The Duck OS philosophy is simple: <em>"Systems over willpower."</em> When you rely on motivation, you're building on quicksand. When you build systems, you're building on bedrock.
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-green-500/30">
                <p className="text-green-300 font-semibold">
                  "The system is the bridge between intention and action." — UDO
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Solution */}
        <section className="min-h-screen flex items-center justify-center px-6 bg-black/50">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold mb-8 text-white drop-shadow-xl">
              The Flywheel System
            </h2>
            <div className="space-y-6 text-lg text-gray-200 leading-relaxed">
              <p className="drop-shadow-lg">
                Watch the 3D flywheel behind this content. Notice how it speeds up as you scroll? That's not just visual effects—that's how momentum actually works.
              </p>
              <p className="drop-shadow-lg">
                <strong className="text-green-300">The Momentum Protocol has 4 phases:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-4 text-gray-200">
                <li className="drop-shadow-lg">
                  <strong className="text-white">Activation (2 minutes):</strong> Smallest possible action. Tiny commitment.
                </li>
                <li className="drop-shadow-lg">
                  <strong className="text-white">Build Phase (10 minutes):</strong> Work becomes easier. Dopamine starts flowing.
                </li>
                <li className="drop-shadow-lg">
                  <strong className="text-white">Momentum State (20+ minutes):</strong> You're in flow. The system carries you.
                </li>
                <li className="drop-shadow-lg">
                  <strong className="text-white">Asset Creation:</strong> Output without relying on willpower.
                </li>
              </ol>
              <p className="drop-shadow-lg">
                <strong className="text-yellow-300">Key insight:</strong> You don't need to feel like doing it. You just need to start the flywheel spinning.
              </p>
            </div>
          </div>
        </section>

        {/* Implementation */}
        <section className="min-h-screen flex items-center justify-center px-6 bg-black/70">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold mb-8 text-white drop-shadow-xl">
              How to Run ACT-04
            </h2>
            <div className="space-y-6 text-lg text-gray-200 leading-relaxed">
              <p className="drop-shadow-lg">
                <strong className="text-green-300">Step 1: The 2-Minute Activation</strong><br/>
                When you don't want to do anything: Commit to exactly 2 minutes of work. Anyone can do 2 minutes. If you want to stop after 2 minutes, you're allowed to. <span className="text-yellow-300">(You almost never will.)</span>
              </p>
              <p className="drop-shadow-lg">
                <strong className="text-green-300">Step 2: Remove Friction</strong><br/>
                Before you start, eliminate every possible barrier. Phone in another room. Browser tabs closed. Tools ready. The path of least resistance should be working.
              </p>
              <p className="drop-shadow-lg">
                <strong className="text-green-300">Step 3: Ride the Flywheel</strong><br/>
                Once you hit 10 minutes, you'll feel momentum. Don't question it. Don't analyze it. Just ride it. Let the system carry you.
              </p>
              <p className="drop-shadow-lg">
                <strong className="text-green-300">Step 4: Asset Capture</strong><br/>
                When you finish, document what you created. This builds your asset library. You're not just doing work—you're building your empire, one asset at a time.
              </p>
            </div>
          </div>
        </section>

        {/* Duck OS Integration */}
        <section className="min-h-screen flex items-center justify-center px-6 bg-black/80">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold mb-8 text-white drop-shadow-xl">
              ACT-04 in the Duck OS Ecosystem
            </h2>
            <div className="space-y-6 text-lg text-gray-200 leading-relaxed">
              <p className="drop-shadow-lg">
                The Momentum Protocol isn't isolated—it connects to every other Duck OS protocol:
              </p>
              <ul className="space-y-4">
                <li className="drop-shadow-lg">
                  <strong className="text-green-300">+ SURV-01 (Digital Declutter):</strong> Reduces friction so activation becomes automatic
                </li>
                <li className="drop-shadow-lg">
                  <strong className="text-green-300">+ Flow State Architecture:</strong> ACT-04 gets you into flow, Flow State keeps you there
                </li>
                <li className="drop-shadow-lg">
                  <strong className="text-green-300">+ Single-Tasking Protocol:</strong> Momentum requires focus, not multitasking
                </li>
                <li className="drop-shadow-lg">
                  <strong className="text-green-300">+ Weekly Calibration:</strong> Review which ACT-04 sessions created the most assets
                </li>
              </ul>
              <p className="drop-shadow-lg">
                <strong className="text-yellow-300">This is why systems thinking matters.</strong> No protocol stands alone. They're interconnected components of your life operating system.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-black/80 to-black">
          <div className="max-w-3xl text-center">
            <h2 className="text-4xl font-bold mb-8 text-white drop-shadow-xl">
              Start Your Flywheel Today
            </h2>
            <div className="space-y-6 text-lg text-gray-200 leading-relaxed">
              <p className="drop-shadow-lg">
                You don't need to wait for motivation. You don't need to feel ready. You just need to activate the system.
              </p>
              <p className="drop-shadow-lg">
                <strong className="text-green-300">Right now:</strong> Set a timer for 2 minutes. Start one thing you've been avoiding. Watch the flywheel begin to spin.
              </p>
              <p className="drop-shadow-lg">
                In 48 hours, you'll have momentum. In 30 days, you'll have a new identity. In 90 days, you'll have an asset library that compounds forever.
              </p>
              <div className="mt-12 bg-gradient-to-r from-green-900/50 to-blue-900/50 backdrop-blur-sm rounded-lg p-8 border border-green-500/30">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Want the Complete Duck OS Starter Kit?
                </h3>
                <p className="text-gray-200 mb-6">
                  Get 5 protocols, a Notion template, and quick-start guide—free.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <input 
                    type="email" 
                    placeholder="your@email.com" 
                    className="px-6 py-3 rounded-lg bg-white/10 border border-green-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
                    Get the Kit (Free)
                  </button>
                </div>
                <p className="text-sm text-gray-400 mt-4">
                  No spam. Just systems that work. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 bg-black">
          <div className="max-w-3xl mx-auto text-center text-gray-400">
            <p className="mb-4">Part of the <strong className="text-green-400">Duck OS</strong> — Life Architecture for Neurodivergent Creators</p>
            <p className="text-sm">Built with Next.js + React Three Fiber. Deployed on Cloudflare Pages.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
