'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Hash, ImageIcon, Tag, FileText, Sparkles, Wand2, ChevronDown,
  Loader2, Copy, Check, Bold, Italic, List, ListOrdered,
  Link2, Code, Heading1, Heading2, Heading3, Quote, ExternalLink,
} from 'lucide-react'
import { suggestTitles, autoExcerpt, buildOutline, seoTips, suggestTags } from '@/lib/gemini'

export const dynamic = 'force-dynamic'

type AiSection = 'titles' | 'excerpt' | 'outline' | 'seo' | 'tags'

export default function EditPostPage() {
  const { slug } = useParams() as { slug: string }
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [tags, setTags] = useState('')
  const [category, setCategory] = useState('protocol')
  const [featuredImage, setFeaturedImage] = useState('')
  const [scene, setScene] = useState('default')
  const [mood, setMood] = useState('neutral')
  const [currentSlug, setCurrentSlug] = useState(slug)

  const wordCount = content.replace(/[#*`[\]]/g, '').split(/\s+/).filter(Boolean).length
  const charCount = content.length
  const titleLen = title.length
  const excerptLen = excerpt.length

  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)
  const [aiLoading, setAiLoading] = useState<AiSection | null>(null)
  const [aiResults, setAiResults] = useState<Record<string, any>>({})
  const [copied, setCopied] = useState<string | null>(null)
  const [open, setOpen] = useState<Record<string, boolean>>({ meta: true, titles: true, excerpt: false, outline: false, seo: false, tags: false })
  const toggle = (k: string) => setOpen(p => ({ ...p, [k]: !p[k] }))

  useEffect(() => {
    fetch(`/api/posts?slug=${slug}`).then(r => r.json()).then(data => {
      setTitle(data.title); setContent(data.content); setExcerpt(data.excerpt)
      setTags(data.tags.join(', ')); setCategory(data.category)
      setFeaturedImage(data.featuredImage || ''); setScene(data.scene || 'default')
      setMood(data.mood || 'neutral'); setCurrentSlug(slug)
    }).catch(console.error).finally(() => setLoading(false))
  }, [slug])

  const insert = useCallback((before: string, after = '', placeholder = '') => {
    const ta = textareaRef.current
    if (!ta) return
    const s = ta.selectionStart, e = ta.selectionEnd
    const sel = content.slice(s, e) || placeholder
    setContent(content.slice(0, s) + before + sel + after + content.slice(e))
    setTimeout(() => { ta.focus(); ta.setSelectionRange(s + before.length, s + before.length + sel.length) }, 0)
  }, [content])

  const runAI = async (section: AiSection) => {
    setAiLoading(section)
    try {
      switch (section) {
        case 'titles': { const r = await suggestTitles(content, title); setAiResults(p => ({ ...p, titles: r })); break }
        case 'excerpt': { const r = await autoExcerpt(title, content); setAiResults(p => ({ ...p, excerpt: r })); break }
        case 'outline': { const r = await buildOutline(title, content); setAiResults(p => ({ ...p, outline: r })); break }
        case 'seo': { const r = await seoTips(title, excerpt, content, tags.split(',').map(t => t.trim()).filter(Boolean)); setAiResults(p => ({ ...p, seo: r })); break }
        case 'tags': { const r = await suggestTags(title, content); setAiResults(p => ({ ...p, tags: r })); break }
      }
    } catch { setToast({ type: 'err', msg: 'AI request failed' }) }
    finally { setAiLoading(null) }
  }

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 1800)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setToast(null)
    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, excerpt, tags: tags.split(',').map(t => t.trim()).filter(Boolean), category, featuredImage, scene, mood }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed')
      setToast({ type: 'ok', msg: 'Saved!' })
    } catch (err: any) { setToast({ type: 'err', msg: err.message }) }
    finally { setSaving(false) }
  }

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#FBFBFA] text-gray-400 text-sm">Loading…</div>

  return (
    <div className="h-screen flex flex-col bg-[#FBFBFA] text-[#141414] overflow-hidden">
      <header className="shrink-0 h-12 flex items-center justify-between px-5 border-b border-[#E8E8E6] bg-white z-30">
        <div className="flex items-center gap-3 text-sm">
          <Link href="/content" className="text-gray-400 hover:text-gray-700 transition-colors">← Posts</Link>
          <span className="text-gray-200">/</span>
          <span className="font-medium truncate max-w-48">{title || 'Edit Post'}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          {wordCount > 0 && <><span>{wordCount.toLocaleString()} words</span><span>·</span><span>{charCount.toLocaleString()} chars</span></>}
          <Link href={`/content/preview/${slug}`} target="_blank" className="p-1.5 text-gray-400 hover:text-gray-700 rounded transition-colors"><ExternalLink size={15} /></Link>
          <button onClick={handleSave} disabled={saving || !title || !content} className="h-8 px-5 rounded-md bg-[#141414] text-white text-xs font-medium hover:bg-[#2a2a2a] disabled:opacity-40 transition-colors">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Metadata */}
        <aside className="w-64 shrink-0 border-r border-[#E8E8E6] bg-white overflow-y-auto">
          <SideSection label="Post Metadata" open={open.meta} onToggle={() => toggle('meta')}>
            <Field label="Slug" icon={<Hash size={13} />}>
              <input value={currentSlug} onChange={e => setCurrentSlug(e.target.value)} className="mono-input" placeholder="post-slug" />
            </Field>
            <Field label="Category" icon={<FileText size={13} />}>
              <select value={category} onChange={e => setCategory(e.target.value)} className="base-select">
                <option value="protocol">Protocol</option>
                <option value="tutorial">Tutorial</option>
                <option value="case-study">Case Study</option>
                <option value="system">System</option>
              </select>
            </Field>
            <Field label="Cover Image" icon={<ImageIcon size={13} />}>
              <input type="url" value={featuredImage} onChange={e => setFeaturedImage(e.target.value)} placeholder="https://..." className="base-input" />
            </Field>
            <Field label="Excerpt">
              <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Brief summary for SEO…" rows={3} className="base-input resize-none text-xs leading-relaxed" />
              <ProgressBar value={excerptLen} max={160} optimal={[120, 160]} /><span className="text-[10px] text-gray-400 mt-0.5 block">{excerptLen}/160</span>
            </Field>
            <Field label="Tags" icon={<Tag size={13} />}>
              <input value={tags} onChange={e => setTags(e.target.value)} placeholder="adhd, system, protocol" className="mono-input" />
              <p className="text-[10px] text-gray-400 mt-0.5">Comma separated</p>
            </Field>
            <Field label="3D Scene">
              <select value={scene} onChange={e => setScene(e.target.value)} className="base-select">
                <option value="default">Default</option>
                <option value="momentum-flywheel">Momentum Flywheel</option>
              </select>
            </Field>
            <Field label="Mood">
              <select value={mood} onChange={e => setMood(e.target.value)} className="base-select">
                <option value="neutral">Neutral</option>
                <option value="energetic">Energetic</option>
                <option value="calm">Calm</option>
                <option value="focused">Focused</option>
              </select>
            </Field>
          </SideSection>
        </aside>

        {/* Center: Editor */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="px-10 pt-8 pb-3 border-b border-[#E8E8E6]">
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title…" required className="w-full bg-transparent text-[2rem] font-bold leading-tight placeholder-gray-200 focus:outline-none" />
            <div className="flex items-center justify-between mt-2">
              <span className={`text-[11px] ${titleLen > 60 ? 'text-red-500' : 'text-gray-400'}`}>{titleLen}/60 characters</span>
              <ProgressBar value={titleLen} max={60} optimal={[40, 60]} className="w-24" />
            </div>
          </div>
          <div className="px-10 py-2 flex items-center gap-0.5 border-b border-[#E8E8E6] bg-white">
            <ToolBtn title="Bold" onClick={() => insert('**', '**', 'bold')}><Bold size={15} /></ToolBtn>
            <ToolBtn title="Italic" onClick={() => insert('*', '*', 'italic')}><Italic size={15} /></ToolBtn>
            <div className="w-px h-5 bg-gray-200 mx-1.5" />
            <ToolBtn title="H1" onClick={() => insert('# ', '', '')}><Heading1 size={15} /></ToolBtn>
            <ToolBtn title="H2" onClick={() => insert('## ', '', '')}><Heading2 size={15} /></ToolBtn>
            <ToolBtn title="H3" onClick={() => insert('### ', '', '')}><Heading3 size={15} /></ToolBtn>
            <div className="w-px h-5 bg-gray-200 mx-1.5" />
            <ToolBtn title="Bullet list" onClick={() => insert('- ', '', '')}><List size={15} /></ToolBtn>
            <ToolBtn title="Numbered list" onClick={() => insert('1. ', '', '')}><ListOrdered size={15} /></ToolBtn>
            <ToolBtn title="Blockquote" onClick={() => insert('> ', '', '')}><Quote size={15} /></ToolBtn>
            <ToolBtn title="Code" onClick={() => insert('`', '`', 'code')}><Code size={15} /></ToolBtn>
            <ToolBtn title="Link" onClick={() => insert('[', '](url)', '')}><Link2 size={15} /></ToolBtn>
          </div>
          <div className="flex-1 overflow-y-auto px-10 py-6">
            <textarea ref={textareaRef} name="content" value={content} onChange={e => setContent(e.target.value)} placeholder="Start writing…" required className="w-full h-full min-h-[500px] bg-transparent text-base leading-8 placeholder-gray-200 focus:outline-none resize-none" />
          </div>
        </main>

        {/* Right: AI */}
        <aside className="w-72 shrink-0 border-l border-[#E8E8E6] bg-white overflow-y-auto">
          <div className="px-4 py-3 border-b border-[#E8E8E6] flex items-center gap-2">
            <Sparkles size={14} className="text-violet-500" />
            <span className="text-xs font-semibold tracking-wide uppercase text-gray-500">AI Assistant</span>
          </div>
          <AISection label="Title Suggestions" sectionKey="titles" open={open.titles} onToggle={() => toggle('titles')} loading={aiLoading === 'titles'} onRun={() => runAI('titles')} color="violet">
            {aiResults.titles?.map((t: string, i: number) => (
              <div key={i} className="flex items-start gap-2 group py-1">
                <span className="text-[10px] text-violet-400 font-mono mt-0.5 shrink-0">{i + 1}.</span>
                <button onClick={() => setTitle(t)} className="flex-1 text-left text-xs text-gray-700 hover:text-violet-700 leading-relaxed transition-colors">{t}</button>
                <button onClick={() => copyText(t, `t-${i}`)} className="opacity-0 group-hover:opacity-100 shrink-0 mt-0.5 transition-opacity">
                  {copied === `t-${i}` ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-gray-300" />}
                </button>
              </div>
            ))}
          </AISection>
          <AISection label="Auto Excerpt" sectionKey="excerpt" open={open.excerpt} onToggle={() => toggle('excerpt')} loading={aiLoading === 'excerpt'} onRun={() => runAI('excerpt')} color="blue">
            {aiResults.excerpt && <div className="space-y-2"><p className="text-xs text-gray-600 leading-relaxed">{aiResults.excerpt}</p><button onClick={() => setExcerpt(aiResults.excerpt)} className="text-[11px] px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Apply</button></div>}
          </AISection>
          <AISection label="Outline" sectionKey="outline" open={open.outline} onToggle={() => toggle('outline')} loading={aiLoading === 'outline'} onRun={() => runAI('outline')} color="green">
            {aiResults.outline && <div className="max-h-52 overflow-y-auto space-y-0.5">{aiResults.outline.map((line: string, i: number) => <p key={i} className="text-xs text-gray-600 font-mono leading-relaxed whitespace-pre">{line}</p>)}</div>}
          </AISection>
          <AISection label="SEO Tips" sectionKey="seo" open={open.seo} onToggle={() => toggle('seo')} loading={aiLoading === 'seo'} onRun={() => runAI('seo')} color="amber">
            {aiResults.seo?.map((tip: string, i: number) => <p key={i} className="text-xs text-gray-600 leading-relaxed py-0.5 border-b border-gray-100 last:border-0">{tip}</p>)}
          </AISection>
          <AISection label="Auto Tags" sectionKey="tags" open={open.tags} onToggle={() => toggle('tags')} loading={aiLoading === 'tags'} onRun={() => runAI('tags')} color="pink">
            {aiResults.tags && <div className="space-y-2"><div className="flex flex-wrap gap-1.5">{aiResults.tags.map((t: string, i: number) => <span key={i} className="px-2 py-0.5 bg-pink-50 text-pink-700 text-[11px] rounded-full border border-pink-200">{t}</span>)}</div><button onClick={() => setTags(aiResults.tags.join(', '))} className="text-[11px] px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors">Apply Tags</button></div>}
          </AISection>
        </aside>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className={`fixed bottom-5 right-5 px-5 py-3 rounded-lg shadow-lg text-sm font-medium ${toast.type === 'ok' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .base-input { @apply w-full text-xs rounded-md border border-[#E8E8E6] bg-[#FBFBFA] px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#141414] transition-shadow placeholder-gray-300; }
        .mono-input { @apply w-full text-xs rounded-md border border-[#E8E8E6] bg-[#FBFBFA] px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#141414] transition-shadow placeholder-gray-300 font-mono; }
        .base-select { @apply w-full text-xs rounded-md border border-[#E8E8E6] bg-[#FBFBFA] px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#141414] transition-shadow; }
      `}</style>
    </div>
  )
}

function SideSection({ label, open, onToggle, children }: { label: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="border-b border-[#E8E8E6]">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:bg-gray-50 transition-colors">
        {label}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}><ChevronDown size={14} /></motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-4 pb-4 space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">{icon}{label}</label>
      {children}
    </div>
  )
}

const colorMap: Record<string, string> = { violet: 'text-violet-600 hover:bg-violet-50', blue: 'text-blue-600 hover:bg-blue-50', green: 'text-green-600 hover:bg-green-50', amber: 'text-amber-600 hover:bg-amber-50', pink: 'text-pink-600 hover:bg-pink-50' }

function AISection({ label, sectionKey, open, onToggle, loading, onRun, color, children }: { label: string; sectionKey: string; open: boolean; onToggle: () => void; loading: boolean; onRun: () => void; color: string; children?: React.ReactNode }) {
  return (
    <div className="border-b border-[#E8E8E6]">
      <div className="flex items-center justify-between px-4 py-2.5">
        <button onClick={onToggle} className="flex-1 flex items-center gap-2 text-xs font-medium text-gray-700 text-left">
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}><ChevronDown size={12} className="text-gray-400" /></motion.div>
          {label}
        </button>
        <button onClick={onRun} disabled={loading} className={`p-1.5 rounded-md transition-colors ${colorMap[color]}`}>{loading ? <Loader2 size={13} className="animate-spin" /> : <Wand2 size={13} />}</button>
      </div>
      <AnimatePresence initial={false}>
        {open && children && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-4 pb-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ProgressBar({ value, max, optimal, className = '' }: { value: number; max: number; optimal: [number, number]; className?: string }) {
  const pct = Math.min((value / max) * 100, 100)
  const over = value > optimal[1], inRange = value >= optimal[0] && value <= optimal[1]
  const color = over ? '#ef4444' : inRange ? '#22c55e' : '#3b82f6'
  return (
    <div className={`h-1 rounded-full bg-gray-100 overflow-hidden ${className}`}>
      <motion.div className="h-full rounded-full" style={{ backgroundColor: color }} animate={{ width: `${pct}%` }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
    </div>
  )
}

function ToolBtn({ title, onClick, children }: { title: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" title={title} onClick={onClick} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">{children}</button>
  )
}
