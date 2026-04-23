'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Loader2, Wand2, Search, X, Upload } from 'lucide-react'
import { ET } from './theme'

/* ── Section accordion ── */
export function SideSection({
  label, open, onToggle, children,
}: {
  label: string; open: boolean; onToggle: () => void; children: React.ReactNode
}) {
  return (
    <div style={{ borderBottom: `1px solid ${ET.border}` }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wide transition-opacity hover:opacity-70"
        style={{ color: ET.sub }}
      >
        {label}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }}>
          <ChevronDown size={14} style={{ color: ET.ink }} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Labeled field ── */
export function Field({
  label, icon, children,
}: {
  label: string; icon?: React.ReactNode; children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: ET.sub }}>
        {icon}{label}
      </label>
      {children}
    </div>
  )
}

/* ── AI accordion section ── */
export function AISection({
  label, open, onToggle, loading, onRun, children,
}: {
  label: string; open: boolean; onToggle: () => void
  loading: boolean; onRun: () => void; children?: React.ReactNode
}) {
  return (
    <div style={{ borderBottom: `1px solid ${ET.border}` }}>
      <div className="flex items-center justify-between px-4 py-2.5">
        <button onClick={onToggle} className="flex-1 flex items-center gap-2 text-xs font-medium text-left" style={{ color: ET.mid }}>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }}>
            <ChevronDown size={12} style={{ color: ET.sub }} />
          </motion.div>
          {label}
        </button>
        <button
          onClick={onRun}
          disabled={loading}
          className="p-1.5 rounded-md transition-opacity hover:opacity-70 disabled:opacity-40"
          style={{ color: ET.accent }}
        >
          {loading ? <Loader2 size={13} className="animate-spin" /> : <Wand2 size={13} />}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Progress bar ── */
export function ProgressBar({
  value, max, optimal, className = '',
}: {
  value: number; max: number; optimal: [number, number]; className?: string
}) {
  const pct = Math.min((value / max) * 100, 100)
  const over = value > optimal[1]
  const inRange = value >= optimal[0] && value <= optimal[1]
  const color = over ? '#ef4444' : inRange ? '#22c55e' : ET.accent
  return (
    <div className={`h-1 rounded-full overflow-hidden ${className}`} style={{ backgroundColor: ET.muted }}>
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    </div>
  )
}

/* ── Markdown toolbar button ── */
export function ToolBtn({
  title, onClick, children,
}: {
  title: string; onClick: () => void; children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="p-1.5 rounded transition-opacity hover:opacity-60"
      style={{ color: ET.mid }}
    >
      {children}
    </button>
  )
}

/* ── Divider ── */
export function Divider() {
  return <div className="w-px h-5 mx-1" style={{ backgroundColor: ET.border }} />
}

/* ── Cover Image Picker ── */
interface UnsplashPhoto {
  id: string
  thumb: string
  full: string
  alt: string
  credit: string
  creditLink: string
}

export function CoverImagePicker({
  value,
  onChange,
}: {
  value: string
  onChange: (url: string) => void
}) {
  const [tab, setTab] = useState<'upload' | 'url' | 'unsplash'>('upload')
  const [query, setQuery] = useState('')
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([])
  const [searching, setSearching] = useState(false)
  const [searchErr, setSearchErr] = useState('')

  // Upload state
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadErr, setUploadErr] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadErr('Please select an image file')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadErr('File too large (max 10 MB)')
      return
    }
    setUploading(true)
    setUploadErr('')
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      onChange(data.url)
    } catch (err) {
      setUploadErr(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    e.target.value = ''
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  const search = async () => {
    if (!query.trim()) return
    setSearching(true)
    setSearchErr('')
    setPhotos([])
    try {
      const res = await fetch(`/api/unsplash?q=${encodeURIComponent(query.trim())}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Search failed')
      setPhotos(data.photos || [])
    } catch (err) {
      setSearchErr(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="space-y-2">
      {/* 16:9 Preview */}
      <div
        className="relative w-full rounded-lg overflow-hidden"
        style={{ aspectRatio: '16/9', backgroundColor: ET.muted }}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Cover preview" className="w-full h-full object-cover" />
            <button
              onClick={() => onChange('')}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(44,31,20,0.7)', color: '#FAF5EC' }}
            >
              <X size={11} />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 120 68" className="w-16 opacity-25" fill="none">
              <rect width="120" height="68" rx="4" fill={ET.border} />
              <circle cx="42" cy="28" r="10" fill={ET.sub} />
              <path d="M0 52 L30 32 L55 48 L80 30 L120 52 L120 68 L0 68 Z" fill={ET.sub} opacity="0.5" />
            </svg>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex rounded-lg overflow-hidden border text-[11px] font-medium" style={{ borderColor: ET.border }}>
        {(['upload', 'url', 'unsplash'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-1.5 transition-colors capitalize"
            style={{
              backgroundColor: tab === t ? ET.accent : ET.bg,
              color: tab === t ? ET.surface : ET.sub,
            }}
          >
            {t === 'upload' ? 'Upload' : t === 'url' ? 'URL' : 'Unsplash'}
          </button>
        ))}
      </div>

      {/* Upload tab */}
      {tab === 'upload' && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            disabled={uploading}
            className="w-full rounded-lg border-2 border-dashed py-5 flex flex-col items-center gap-2 transition-colors disabled:opacity-50"
            style={{
              borderColor: dragOver ? ET.accent : ET.border,
              backgroundColor: dragOver ? ET.accentL : ET.bg,
              color: ET.sub,
            }}
          >
            {uploading
              ? <Loader2 size={18} className="animate-spin" style={{ color: ET.accent }} />
              : <Upload size={18} style={{ color: ET.sub }} />
            }
            <span className="text-[11px] text-center leading-relaxed" style={{ color: ET.sub }}>
              {uploading
                ? 'Converting to WebP…'
                : <>Click or drag an image<br />Saved as <strong>.webp</strong></>
              }
            </span>
          </button>
          {uploadErr && (
            <p className="text-[11px]" style={{ color: '#ef4444' }}>{uploadErr}</p>
          )}
        </div>
      )}

      {/* URL tab */}
      {tab === 'url' && (
        <input
          type="url"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://…"
          className="et-input"
        />
      )}

      {/* Unsplash tab */}
      {tab === 'unsplash' && (
        <div className="space-y-2">
          <div className="flex gap-1.5">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder="Search images…"
              className="et-input flex-1"
            />
            <button
              onClick={search}
              disabled={searching}
              className="px-2.5 rounded-lg flex items-center transition-opacity hover:opacity-80 disabled:opacity-40"
              style={{ backgroundColor: ET.accent, color: ET.surface }}
            >
              {searching ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
            </button>
          </div>

          {searchErr && <p className="text-[11px]" style={{ color: '#ef4444' }}>{searchErr}</p>}

          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-1 max-h-48 overflow-y-auto">
              {photos.map(p => (
                <button
                  key={p.id}
                  onClick={() => onChange(p.full)}
                  className="relative overflow-hidden rounded group"
                  style={{ aspectRatio: '16/9', backgroundColor: ET.muted }}
                  title={`Photo by ${p.credit}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.thumb}
                    alt={p.alt}
                    className="w-full h-full object-cover transition-opacity group-hover:opacity-80"
                  />
                  {value === p.full && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: `${ET.accent}aa` }}>
                      <span className="text-white text-[10px] font-bold">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Confirmation modal ── */
export function ConfirmModal({
  open,
  title,
  body,
  confirmLabel,
  confirmStyle,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  body: string
  confirmLabel: string
  confirmStyle?: React.CSSProperties
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(44,31,20,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-sm rounded-2xl p-6 shadow-xl"
            style={{ backgroundColor: ET.surface, border: `1px solid ${ET.border}` }}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-bold text-base mb-2" style={{ color: ET.ink }}>{title}</h3>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: ET.sub }}>{body}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-70"
                style={{ border: `1px solid ${ET.border}`, color: ET.mid, backgroundColor: ET.bg }}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-5 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-85"
                style={confirmStyle || { backgroundColor: ET.accent, color: ET.surface }}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
