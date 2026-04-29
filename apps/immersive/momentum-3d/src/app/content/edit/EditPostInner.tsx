'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Copy, Check,
  Bold, Italic, List, ListOrdered, Link2, Code,
  Heading1, Heading2, Heading3, Quote, ImageIcon, Table,
  FileText, Tag, Eye,
} from 'lucide-react'
import {
  SideSection, Field, AISection, ProgressBar,
  ToolBtn, Divider, CoverImagePicker, ConfirmModal,
} from '@/components/editor/EditorShared'
import PreviewModal from '@/components/editor/PreviewModal'
import { ET, inputCss } from '@/lib/theme'


type AiSection = 'titles' | 'excerpt' | 'outline' | 'seo' | 'tags'

async function callAI(action: AiSection, payload: Record<string, unknown>) {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...payload }),
  })
  const data = await res.json() as { error?: string; result?: unknown }
  if (!res.ok) throw new Error(data.error || 'AI request failed')
  return data.result
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'unsaved'

export default function EditPostPage() {
  const searchParams = useSearchParams()
  const initialSlug = searchParams.get('slug') || ''
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savedAtRef = useRef<number>(0)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [slug, setSlug] = useState(initialSlug)
  const [originalSlug, setOriginalSlug] = useState(initialSlug) // Track the original slug
  const [excerpt, setExcerpt] = useState('')
  const [tags, setTags] = useState('')
  const [category, setCategory] = useState('protocol')
  const [featuredImage, setFeaturedImage] = useState('')
  const [imageAlt, setImageAlt]         = useState('')
  const [scene, setScene]               = useState('default')
  const [mood, setMood]                 = useState('neutral')
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft')
  const [scheduledAt, setScheduledAt] = useState('')
  const [scheduleModal, setScheduleModal] = useState(false)

  const wordCount = content.replace(/[#*`[\]]/g, '').split(/\s+/).filter(Boolean).length
  const titleLen  = title.length
  const excerptLen = excerpt.length

  const [saveStatus, setSaveStatus]   = useState<SaveStatus>('idle')
  const [savedAgo, setSavedAgo]       = useState('')
  const [toast, setToast]             = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)
  const [publishModal, setPublishModal]     = useState(false)
  const [unpublishModal, setUnpublishModal] = useState(false)
  const [preview, setPreview]               = useState(false)

  const [publishing, setPublishing]         = useState(false)

  const [aiLoading, setAiLoading] = useState<AiSection | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [aiResults, setAiResults] = useState<Record<string, any>>({})
  const [copied, setCopied]       = useState<string | null>(null)
  const [open, setOpen] = useState<Record<string, boolean>>({
    meta: true, image: true, titles: true, excerpt: false, outline: false, seo: false, tags: false,
  })
  const toggle = (k: string) => setOpen(p => ({ ...p, [k]: !p[k] }))

  // ── Load post ──────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`/api/posts?slug=${initialSlug}`)
      .then(async r => {
        const d = await r.json() as import('@/lib/posts').Post & { error?: string }
        if (!r.ok || d.error) return
        setTitle(d.title || '')
        setContent(d.content || '')
        setSlug(d.slug || initialSlug)
        setOriginalSlug(d.slug || initialSlug)
        setExcerpt(d.excerpt || '')
        setTags((d.tags || []).join(', '))
        setCategory(d.category || 'protocol')
        setFeaturedImage(d.featuredImage || '')
        setImageAlt(d.imageAlt || '')
        setScene(d.scene || 'default')
        setMood(d.mood || 'neutral')
        setStatus(d.status || 'draft')
        if (d.scheduledAt) {
          const dt = new Date(d.scheduledAt)
          const pad = (n: number) => String(n).padStart(2, '0')
          setScheduledAt(`${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`)
        } else {
          setScheduledAt('')
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [initialSlug])

  // ── "Saved Xs ago" ticker ──────────────────────────────────────────────────
  useEffect(() => {
    tickRef.current = setInterval(() => {
      if (savedAtRef.current && saveStatus === 'saved') {
        const secs = Math.floor((Date.now() - savedAtRef.current) / 1000)
        setSavedAgo(secs < 5 ? 'just now' : `${secs}s ago`)
      }
    }, 3000)
    return () => { if (tickRef.current) clearInterval(tickRef.current) }
  }, [saveStatus])

  // ── Auto-save (4s debounce, preserves current status) ────────────────────
  const doAutoSave = useCallback(async (
    t: string, c: string, e: string, tg: string, cat: string,
    img: string, alt: string, sc: string, md: string, st: 'draft' | 'published' | 'scheduled', sl: string, origSl: string, schAt: string
  ) => {
    if (!t || publishing) return
    setSaveStatus('saving')
    try {
      await fetch(`/api/posts?slug=${origSl}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: sl, title: t, content: c, excerpt: e,
          tags: tg.split(',').map(x => x.trim()).filter(Boolean),
          category: cat, featuredImage: img, imageAlt: alt || undefined,
          scene: sc, mood: md, status: st,
          scheduledAt: schAt ? new Date(schAt).toISOString() : undefined,
        }),
      })
      savedAtRef.current = Date.now()
      setSaveStatus('saved')
      setSavedAgo('just now')
      // Update originalSlug after successful auto-save
      setOriginalSlug(sl)
    } catch {
      setSaveStatus('unsaved')
    }
  }, [publishing])

  const scheduleAutoSave = useCallback(() => {
    if (publishing) return
    setSaveStatus('unsaved')
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      doAutoSave(title, content, excerpt, tags, category, featuredImage, imageAlt, scene, mood, status, slug, originalSlug, scheduledAt)
    }, 4000)
  }, [title, content, excerpt, tags, category, featuredImage, imageAlt, scene, mood, status, slug, originalSlug, scheduledAt, publishing, doAutoSave])

  // Trigger auto-save on any field change
  useEffect(() => {
    if (!loading) scheduleAutoSave()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, excerpt, tags, category, featuredImage, imageAlt, scene, mood, status, slug, scheduledAt, scheduleAutoSave])

  // ── Markdown insert ────────────────────────────────────────────────────────
  const insert = useCallback((before: string, after = '', placeholder = '') => {
    const ta = textareaRef.current
    if (!ta) return
    const s = ta.selectionStart, e = ta.selectionEnd
    const sel = content.slice(s, e) || placeholder
    setContent(content.slice(0, s) + before + sel + after + content.slice(e))
    setTimeout(() => { ta.focus(); ta.setSelectionRange(s + before.length, s + before.length + sel.length) }, 0)
  }, [content])

  // ── Save Draft ────────────────────────────────────────────────────────────
  const saveDraft = async () => {
    setPublishing(true)
    setSaveStatus('saving')
    try {
      await fetch(`/api/posts?slug=${originalSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug, title, content, excerpt,
          tags: tags.split(',').map(t => t.trim().replace(/^#+/, '')).filter(Boolean),
          category, featuredImage, imageAlt: imageAlt || undefined,
          scene, mood, status,
          scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
        }),
      })
      savedAtRef.current = Date.now()
      setSaveStatus('saved')
      setSavedAgo('just now')
      showToast('ok', 'Draft saved')
      // Update originalSlug after successful save
      setOriginalSlug(slug)
    } catch {
      setSaveStatus('unsaved')
      showToast('err', 'Save failed')
    } finally {
      setPublishing(false)
    }
  }

  // ── Publish ───────────────────────────────────────────────────────────────
  const doPublish = async () => {
    setPublishModal(false)
    setPublishing(true)
    setSaveStatus('saving')
    try {
      const res = await fetch(`/api/posts?slug=${originalSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug, title, content, excerpt,
          tags: tags.split(',').map(t => t.trim().replace(/^#+/, '')).filter(Boolean),
          category, featuredImage, imageAlt: imageAlt || undefined,
          scene, mood, status: 'published', scheduledAt: undefined,
        }),
      })
      const data = await res.json() as { error?: string; facebook?: { ok: boolean; error?: string } }
      if (!res.ok) {
        setSaveStatus('unsaved')
        showToast('err', `Publish failed: ${data.error || res.status}`)
        return
      }
      setStatus('published')
      savedAtRef.current = Date.now()
      setSaveStatus('saved')
      setOriginalSlug(slug)
      if (data.facebook?.ok) {
        showToast('ok', 'Published! Posted to Facebook.')
      } else if (data.facebook?.error) {
        showToast('ok', `Published! Facebook: ${data.facebook.error}`)
      } else {
        showToast('ok', 'Published!')
      }
    } catch {
      setSaveStatus('unsaved')
      showToast('err', 'Publish failed')
    } finally {
      setPublishing(false)
    }
  }

  // ── Unpublish ─────────────────────────────────────────────────────────────
  const doUnpublish = async () => {
    setUnpublishModal(false)
    setPublishing(true)
    setSaveStatus('saving')
    try {
      await fetch(`/api/posts?slug=${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug, title, content, excerpt,
          tags: tags.split(',').map(t => t.trim().replace(/^#+/, '')).filter(Boolean),
          category, featuredImage, imageAlt: imageAlt || undefined,
          scene, mood, status: 'draft',
        }),
      })
      setStatus('draft')
      savedAtRef.current = Date.now()
      setSaveStatus('saved')
      showToast('ok', 'Moved to drafts')
    } catch {
      setSaveStatus('unsaved')
      showToast('err', 'Failed')
    } finally {
      setPublishing(false)
    }
  }

  // ── Schedule ─────────────────────────────────────────────────────────────
  const doSchedule = async () => {
    if (!scheduledAt) return
    setScheduleModal(false)
    setPublishing(true)
    setSaveStatus('saving')
    try {
      const res = await fetch(`/api/posts?slug=${originalSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug, title, content, excerpt,
          tags: tags.split(',').map(t => t.trim().replace(/^#+/, '')).filter(Boolean),
          category, featuredImage, imageAlt: imageAlt || undefined,
          scene, mood, status: 'scheduled', scheduledAt: new Date(scheduledAt).toISOString(),
        }),
      })
      const data = await res.json() as { error?: string }
      if (!res.ok) { showToast('err', `Failed: ${data.error || res.status}`); setSaveStatus('unsaved'); return }
      setStatus('scheduled')
      setSaveStatus('saved')
      setOriginalSlug(slug)
      showToast('ok', `Scheduled for ${new Date(scheduledAt).toLocaleString()}`)
    } catch {
      setSaveStatus('unsaved')
      showToast('err', 'Schedule failed')
    } finally {
      setPublishing(false)
    }
  }

  // ── AI ────────────────────────────────────────────────────────────────────
  const runAI = async (section: AiSection) => {
    setAiLoading(section)
    try {
      const tagList = tags.split(',').map(t => t.trim()).filter(Boolean)
      let result: unknown
      switch (section) {
        case 'titles':  result = await callAI('titles',  { content, title }); break
        case 'excerpt': result = await callAI('excerpt', { title, content }); break
        case 'outline': result = await callAI('outline', { title, content }); break
        case 'seo':     result = await callAI('seo',     { title, excerpt, content, tags: tagList }); break
        case 'tags':    result = await callAI('tags',    { title, content }); break
      }
      setAiResults(p => ({ ...p, [section]: result }))
    } catch (err) {
      showToast('err', err instanceof Error ? err.message : 'AI failed')
    } finally {
      setAiLoading(null)
    }
  }

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text); setCopied(id)
    setTimeout(() => setCopied(null), 1800)
  }

  const showToast = (type: 'ok' | 'err', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }

  // ── Save status label ─────────────────────────────────────────────────────
  const saveLabel =
    saveStatus === 'saving'  ? 'Saving…' :
    saveStatus === 'saved'   ? `Saved ${savedAgo}` :
    saveStatus === 'unsaved' ? 'Unsaved changes' : ''

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-sm" style={{ backgroundColor: ET.bg, color: ET.sub }}>
        Loading…
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: ET.bg, color: ET.ink }}>

      {/* ── Header ── */}
      <header
        className="shrink-0 h-12 flex items-center justify-between px-5 border-b z-30"
        style={{ backgroundColor: ET.surface, borderColor: ET.border }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="hover:opacity-70 transition-opacity shrink-0">
            <Image src="/logo.png" alt="Adduckivity" width={22} height={22} className="rounded-md" />
          </Link>
          <span style={{ color: ET.border }}>/</span>
          <Link href="/content" className="text-xs transition-opacity hover:opacity-70 shrink-0" style={{ color: ET.sub }}>
            Content
          </Link>
          <span style={{ color: ET.border }}>/</span>
          <span className="text-xs truncate max-w-36" style={{ color: ET.sub }}>{title || slug}</span>

          {/* Status badge */}
          {status === 'published' ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0" style={{ backgroundColor: 'rgba(22,163,74,0.12)', color: '#16a34a' }}>Published</span>
          ) : status === 'scheduled' ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0" style={{ backgroundColor: 'rgba(234,179,8,0.12)', color: '#ca8a04' }}>Scheduled</span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0" style={{ backgroundColor: ET.accentL, color: ET.accent }}>Draft</span>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Auto-save status */}
          {saveLabel && (
            <span className="text-[11px] hidden md:block" style={{
              color: saveStatus === 'unsaved' ? ET.accent : ET.sub
            }}>
              {saveLabel}
            </span>
          )}

          {/* Preview */}
          <button
            onClick={() => setPreview(true)}
            disabled={!title && !content}
            className="h-8 px-3 rounded-lg text-xs font-medium border transition-opacity hover:opacity-80 disabled:opacity-40 flex items-center gap-1.5"
            style={{ borderColor: ET.border, color: ET.mid, backgroundColor: ET.bg }}
          >
            <Eye size={12} />
            Preview
          </button>

          {/* Save Draft */}
          <button
            onClick={saveDraft}
            disabled={!title}
            className="h-8 px-3 rounded-lg text-xs font-medium border transition-opacity hover:opacity-80 disabled:opacity-40 flex items-center gap-1.5"
            style={{ borderColor: ET.border, color: ET.mid, backgroundColor: ET.bg }}
          >
            Save Draft
          </button>

          {/* Publish / Schedule / Unpublish */}
          {status === 'draft' || status === 'scheduled' ? (
            <>
              <button
                onClick={() => setScheduleModal(true)}
                disabled={!title || !content}
                className="h-8 px-3 rounded-lg text-xs font-medium border transition-opacity hover:opacity-80 disabled:opacity-40"
                style={{ borderColor: ET.border, color: ET.mid, backgroundColor: ET.bg }}
              >
                Schedule
              </button>
              <button
                onClick={() => setPublishModal(true)}
                disabled={!title || !content}
                className="h-8 px-4 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
                style={{ backgroundColor: ET.ink, color: ET.surface }}
              >
                Publish
              </button>
            </>
          ) : (
            <button
              onClick={() => setUnpublishModal(true)}
              className="h-8 px-4 rounded-lg text-xs font-semibold border transition-opacity hover:opacity-80"
              style={{ borderColor: ET.border, color: ET.mid, backgroundColor: ET.bg }}
            >
              Unpublish
            </button>
          )}
        </div>
      </header>

      {/* ── Three columns ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left: metadata */}
        <aside
          className="w-64 shrink-0 border-r overflow-y-auto"
          style={{ backgroundColor: ET.surface, borderColor: ET.border }}
        >
          <SideSection label="Cover Image" open={open.image} onToggle={() => toggle('image')}>
            <CoverImagePicker value={featuredImage} onChange={setFeaturedImage} />
            <Field label="Alt Text" icon={<Tag size={13} />}>
              <input
                value={imageAlt}
                onChange={e => setImageAlt(e.target.value)}
                placeholder="Describe the image for SEO"
                className="et-input"
              />
              <p className="text-[10px] mt-0.5" style={{ color: ET.sub }}>Used in OG tags and screen readers</p>
            </Field>
          </SideSection>

          <SideSection label="Post Metadata" open={open.meta} onToggle={() => toggle('meta')}>
            <Field label="Slug" icon={<Tag size={13} />}>
              <input
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="url-friendly-slug"
                className="et-input font-mono"
              />
              <p className="text-[10px] mt-0.5" style={{ color: ET.sub }}>URL-friendly identifier</p>
            </Field>
            <Field label="Category" icon={<FileText size={13} />}>
              <select value={category} onChange={e => setCategory(e.target.value)} className="et-select">
                <option value="protocol">Protocol</option>
                <option value="tutorial">Tutorial</option>
                <option value="case-study">Case Study</option>
                <option value="system">System</option>
              </select>
            </Field>
            <Field label="Excerpt">
              <textarea
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                placeholder="Brief summary for SEO…"
                rows={3}
                className="et-input resize-none text-xs leading-relaxed"
              />
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-[10px]" style={{ color: ET.sub }}>{excerptLen}/160</span>
                <ProgressBar value={excerptLen} max={160} optimal={[120, 160]} className="w-20" />
              </div>
            </Field>
            <Field label="Tags" icon={<Tag size={13} />}>
              <input
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="adhd, system, protocol"
                className="et-input font-mono"
              />
              <p className="text-[10px] mt-0.5" style={{ color: ET.sub }}>Comma separated</p>
            </Field>
            <Field label="3D Scene">
              <select value={scene} onChange={e => setScene(e.target.value)} className="et-select">
                <option value="default">Default</option>
                <option value="momentum-flywheel">Momentum Flywheel</option>
              </select>
            </Field>
            <Field label="Mood">
              <select value={mood} onChange={e => setMood(e.target.value)} className="et-select">
                <option value="neutral">Neutral</option>
                <option value="energetic">Energetic</option>
                <option value="calm">Calm</option>
                <option value="focused">Focused</option>
              </select>
            </Field>
          </SideSection>
        </aside>

        {/* Center: editor */}
        <main className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: ET.bg }}>
          {/* Title */}
          <div className="px-10 pt-8 pb-3 border-b" style={{ borderColor: ET.border }}>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Post title…"
              className="w-full bg-transparent text-[2rem] font-bold leading-tight focus:outline-none"
              style={{ color: ET.ink }}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px]" style={{ color: titleLen > 60 ? '#ef4444' : ET.sub }}>
                {titleLen}/60 · {wordCount.toLocaleString()} words
              </span>
              <ProgressBar value={titleLen} max={60} optimal={[40, 60]} className="w-24" />
            </div>
          </div>

          {/* Toolbar */}
          <div className="px-10 py-2 flex items-center gap-0.5 border-b" style={{ backgroundColor: ET.surface, borderColor: ET.border }}>
            <ToolBtn title="Bold"          onClick={() => insert('**', '**', 'bold')}><Bold size={15} /></ToolBtn>
            <ToolBtn title="Italic"        onClick={() => insert('*', '*', 'italic')}><Italic size={15} /></ToolBtn>
            <Divider />
            <ToolBtn title="H1"            onClick={() => insert('# ', '', '')}><Heading1 size={15} /></ToolBtn>
            <ToolBtn title="H2"            onClick={() => insert('## ', '', '')}><Heading2 size={15} /></ToolBtn>
            <ToolBtn title="H3"            onClick={() => insert('### ', '', '')}><Heading3 size={15} /></ToolBtn>
            <Divider />
            <ToolBtn title="Bullet list"   onClick={() => insert('- ', '', '')}><List size={15} /></ToolBtn>
            <ToolBtn title="Numbered list" onClick={() => insert('1. ', '', '')}><ListOrdered size={15} /></ToolBtn>
            <ToolBtn title="Blockquote"    onClick={() => insert('> ', '', '')}><Quote size={15} /></ToolBtn>
            <ToolBtn title="Code"          onClick={() => insert('`', '`', 'code')}><Code size={15} /></ToolBtn>
            <ToolBtn title="Link"          onClick={() => insert('[', '](url)', '')}><Link2 size={15} /></ToolBtn>
            <ToolBtn title="Image"         onClick={() => insert('![', '](image-url)', 'alt text')}><ImageIcon size={15} /></ToolBtn>
            <ToolBtn title="Table"         onClick={() => insert('', '', '| Column 1 | Column 2 | Column 3 |\n| --- | --- | --- |\n| Cell 1 | Cell 2 | Cell 3 |\n| Cell 4 | Cell 5 | Cell 6 |')}><Table size={15} /></ToolBtn>
          </div>

          {/* Writing area */}
          <div className="flex-1 overflow-y-auto px-10 py-6">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Start writing…"
              className="w-full h-full min-h-[500px] bg-transparent text-base leading-8 focus:outline-none resize-none"
              style={{ color: ET.mid }}
            />
          </div>
        </main>

        {/* Right: AI */}
        <aside className="w-72 shrink-0 border-l overflow-y-auto" style={{ backgroundColor: ET.surface, borderColor: ET.border }}>
          <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: ET.border }}>
            <Sparkles size={14} style={{ color: ET.accent }} />
            <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: ET.sub }}>AI Assistant</span>
          </div>

          <AISection label="Title Suggestions" open={open.titles} onToggle={() => toggle('titles')} loading={aiLoading === 'titles'} onRun={() => runAI('titles')}>
            {aiResults.titles?.map((t: string, i: number) => (
              <div key={i} className="flex items-start gap-2 group py-1">
                <span className="text-[10px] font-mono mt-0.5 shrink-0" style={{ color: ET.accent }}>{i + 1}.</span>
                <button onClick={() => setTitle(t)} className="flex-1 text-left text-xs leading-relaxed transition-opacity hover:opacity-70" style={{ color: ET.mid }}>{t}</button>
                <button onClick={() => copyText(t, `t-${i}`)} className="opacity-0 group-hover:opacity-100 shrink-0 mt-0.5 transition-opacity">
                  {copied === `t-${i}` ? <Check size={12} className="text-green-500" /> : <Copy size={12} style={{ color: ET.border }} />}
                </button>
              </div>
            ))}
          </AISection>

          <AISection label="Auto Excerpt" open={open.excerpt} onToggle={() => toggle('excerpt')} loading={aiLoading === 'excerpt'} onRun={() => runAI('excerpt')}>
            {aiResults.excerpt && (
              <div className="space-y-2">
                <p className="text-xs leading-relaxed" style={{ color: ET.mid }}>{aiResults.excerpt}</p>
                <button onClick={() => setExcerpt(aiResults.excerpt)} className="text-[11px] px-3 py-1 rounded-lg transition-opacity hover:opacity-80" style={{ backgroundColor: ET.accent, color: ET.surface }}>Apply</button>
              </div>
            )}
          </AISection>

          <AISection label="Outline" open={open.outline} onToggle={() => toggle('outline')} loading={aiLoading === 'outline'} onRun={() => runAI('outline')}>
            {aiResults.outline && (
              <div className="max-h-52 overflow-y-auto space-y-0.5">
                {aiResults.outline.map((line: string, i: number) => (
                  <p key={i} className="text-xs font-mono leading-relaxed whitespace-pre" style={{ color: ET.mid }}>{line}</p>
                ))}
              </div>
            )}
          </AISection>

          <AISection label="SEO Tips" open={open.seo} onToggle={() => toggle('seo')} loading={aiLoading === 'seo'} onRun={() => runAI('seo')}>
            {aiResults.seo?.map((tip: string, i: number) => (
              <p key={i} className="text-xs leading-relaxed py-0.5 border-b last:border-0" style={{ color: ET.mid, borderColor: ET.border }}>{tip}</p>
            ))}
          </AISection>

          <AISection label="Auto Tags" open={open.tags} onToggle={() => toggle('tags')} loading={aiLoading === 'tags'} onRun={() => runAI('tags')}>
            {aiResults.tags && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {aiResults.tags.map((t: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 rounded-full text-[11px] border" style={{ borderColor: ET.border, color: ET.sub }}>#{t}</span>
                  ))}
                </div>
                <button onClick={() => setTags(aiResults.tags.join(', '))} className="text-[11px] px-3 py-1 rounded-lg transition-opacity hover:opacity-80" style={{ backgroundColor: ET.accent, color: ET.surface }}>Apply Tags</button>
              </div>
            )}
          </AISection>
        </aside>
      </div>

      {/* ── Modals ── */}
      <ConfirmModal
        open={publishModal}
        title="Publish this post?"
        body="It will be marked as published and visible in the public listing."
        confirmLabel="Publish"
        onConfirm={doPublish}
        onCancel={() => setPublishModal(false)}
      />
      <ConfirmModal
        open={unpublishModal}
        title="Move back to drafts?"
        body="The post will become a draft and will no longer appear as published."
        confirmLabel="Unpublish"
        confirmStyle={{ backgroundColor: ET.mid, color: ET.surface }}
        onConfirm={doUnpublish}
        onCancel={() => setUnpublishModal(false)}
      />

      {/* ── Schedule Modal ── */}
      {scheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="rounded-2xl p-6 w-full max-w-sm shadow-xl" style={{ backgroundColor: ET.surface, border: `1px solid ${ET.border}` }}>
            <h3 className="text-base font-bold mb-2" style={{ color: ET.ink }}>Schedule Post</h3>
            <p className="text-xs mb-4" style={{ color: ET.sub }}>Post will go live automatically at this date and time.</p>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={e => setScheduledAt(e.target.value)}
              min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
              className="w-full px-3 py-2 rounded-lg text-sm mb-4"
              style={{ border: `1px solid ${ET.border}`, backgroundColor: ET.bg, color: ET.ink }}
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setScheduleModal(false)} className="px-4 py-2 rounded-lg text-xs" style={{ color: ET.mid }}>Cancel</button>
              <button
                onClick={doSchedule}
                disabled={!scheduledAt}
                className="px-4 py-2 rounded-lg text-xs font-semibold disabled:opacity-40"
                style={{ backgroundColor: '#ca8a04', color: '#fff' }}
              >
                Confirm Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-5 right-5 px-5 py-3 rounded-lg shadow-lg text-sm font-medium z-50"
            style={{ backgroundColor: toast.type === 'ok' ? '#16a34a' : '#ef4444', color: '#fff' }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{inputCss(ET)}</style>

      <PreviewModal
        open={preview}
        onClose={() => setPreview(false)}
        title={title}
        content={content}
        featuredImage={featuredImage}
        imageAlt={imageAlt}
        excerpt={excerpt}
        category={category}
        tags={tags}
      />
    </div>
  )
}
