import Link from 'next/link'
import Image from 'next/image'
import { ET } from '@/lib/theme'

export default function SiteFooter() {
  return (
    <footer style={{ backgroundColor: ET.surface }}>
      <div style={{ height: 1, background: `linear-gradient(90deg, transparent 0%, rgba(0,229,255,0.35) 50%, transparent 100%)` }} />

      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-12 gap-10">

        {/* Brand */}
        <div className="md:col-span-5 flex flex-col gap-5">
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <Image src="/logo.png" alt="Adduckivity" width={36} height={36} className="rounded-xl opacity-80 group-hover:opacity-100 transition-opacity" />
            <span className="font-bold text-base" style={{ color: ET.ink }}>Adduckivity</span>
          </Link>
          <p className="text-xs leading-relaxed max-w-xs" style={{ color: ET.sub }}>
            Life architecture for neurodivergent creators.
            Evidence-based OS tools built for ADHD and MDD brains — not hustle culture.
          </p>
          <span
            className="font-mono text-[10px] uppercase tracking-[0.18em] px-3 py-1.5 rounded-lg border w-fit"
            style={{ color: ET.sub, borderColor: ET.border, backgroundColor: ET.bg }}
          >
            Duck OS · v1.0 · STABLE
          </span>
        </div>

        {/* Navigate */}
        <div className="md:col-span-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-5" style={{ color: ET.sub }}>Navigate</p>
          <nav className="flex flex-col gap-3">
            {[
              { label: 'Blog', href: '/blog', internal: true },
              { label: '3D Experience', href: '/momentum', internal: true },
              { label: 'Tools', href: 'https://duckshort.cc', internal: false },
            ].map(l => l.internal
              ? <Link key={l.label} href={l.href} className="text-xs transition-all hover:translate-x-0.5 hover:opacity-100 opacity-60 w-fit" style={{ color: ET.mid }}>{l.label}</Link>
              : <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="text-xs transition-all hover:translate-x-0.5 hover:opacity-100 opacity-60 w-fit" style={{ color: ET.mid }}>{l.label}</a>
            )}
          </nav>
        </div>

        {/* OS Tools */}
        <div className="md:col-span-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-5" style={{ color: ET.sub }}>OS Tools</p>
          <nav className="flex flex-col gap-3">
            {[
              { label: 'Emergency Recovery', href: '/momentum', accent: '#ff4444', guide: '/momentum/guide' },
              { label: 'Protocol Builder', href: '/protocol-builder', accent: ET.accent, guide: '/protocol-builder/guide' },
              { label: 'The Atomizer', href: '/atomizer', accent: ET.accent, guide: '/atomizer/guide' },
              { label: 'Ignite Momentum', href: '/ignition', accent: '#f43f5e', guide: '/ignition/guide' },
            ].map(t => (
              <div key={t.label} className="flex flex-col gap-1">
                <Link
                  href={t.href}
                  className="text-xs flex items-center gap-2 group w-fit transition-all opacity-60 hover:opacity-100"
                  style={{ color: ET.mid }}
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 transition-all group-hover:scale-125" style={{ backgroundColor: t.accent }} />
                  {t.label}
                </Link>
                <Link
                  href={t.guide}
                  className="text-[10px] pl-5 opacity-40 hover:opacity-70 transition-opacity w-fit"
                  style={{ color: t.accent }}
                >
                  ↳ Read guide
                </Link>
              </div>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t px-6" style={{ borderColor: ET.border }}>
        <div className="max-w-7xl mx-auto h-11 flex items-center justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-25" style={{ color: ET.sub }}>
            Duck OS · Life Architecture for Neurodivergent Creators
          </p>
          <p className="font-mono text-[10px] opacity-30 shrink-0" style={{ color: ET.sub }}>© 2026 Adduckivity</p>
        </div>
      </div>
    </footer>
  )
}
