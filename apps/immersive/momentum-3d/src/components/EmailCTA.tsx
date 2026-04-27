'use client'

import { useState } from 'react'
import { ET } from '@/lib/theme'

export default function EmailCTA() {
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json() as { success?: boolean; error?: string }
      if (data.success) {
        setStatus('success')
      } else {
        setErrMsg(data.error || 'Something went wrong')
        setStatus('error')
      }
    } catch {
      setErrMsg('Network error, please try again')
      setStatus('error')
    }
  }

  return (
    <div className="rounded-2xl p-8 max-w-md mx-auto" style={{ backgroundColor: ET.surface, border: `1px solid ${ET.border}` }}>
      {status === 'success' ? (
        <div className="text-center py-4">
          <p className="text-2xl mb-2">🦆</p>
          <h3 className="text-lg font-bold mb-1" style={{ color: ET.ink }}>You&apos;re in!</h3>
          <p className="text-sm" style={{ color: ET.sub }}>Check your email — the system is on its way.</p>
        </div>
      ) : (
        <form onSubmit={submit}>
          <h3 className="text-lg font-bold mb-2" style={{ color: ET.ink }}>Want the Complete Duck OS Starter Kit?</h3>
          <p className="text-sm mb-6" style={{ color: ET.sub }}>Get 5 protocols, a Notion template, and quick-start guide — free.</p>
          <div className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={status === 'loading'}
              className="px-4 py-3 rounded-lg text-sm focus:outline-none disabled:opacity-50"
              style={{ border: `1px solid ${ET.border}`, backgroundColor: ET.bg, color: ET.ink }}
            />
            <button
              type="submit"
              disabled={status === 'loading' || !email}
              className="px-6 py-3 rounded-lg text-sm font-semibold transition-opacity hover:opacity-85 disabled:opacity-40"
              style={{ backgroundColor: ET.accent, color: ET.bg }}
            >
              {status === 'loading' ? 'Sending…' : 'Get the Kit (Free)'}
            </button>
          </div>
          {status === 'error' && (
            <p className="text-xs mt-3 text-red-400">{errMsg}</p>
          )}
          <p className="text-xs mt-4" style={{ color: ET.sub }}>No spam. Just systems that work. Unsubscribe anytime.</p>
        </form>
      )}
    </div>
  )
}
