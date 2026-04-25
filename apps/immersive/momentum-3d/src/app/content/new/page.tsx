'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Copy, Check,
  Bold, Italic, List, ListOrdered, Link2, Code,
  Heading1, Heading2, Heading3, Quote, FileText, Tag, Hash,
} from 'lucide-react'
import {
  SideSection, Field, AISection, ProgressBar,
  ToolBtn, Divider, CoverImagePicker, ConfirmModal,
} from '@/components/editor/EditorShared'
import { ET, inputCss } from '@/lib/theme'

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 60)
}


type AiSection = 'titles' | 'excerpt' | 'outline' | 'seo' | 'tags'

async function callAI(action: AiSection, payload: Record<string, unknown>) {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...payload }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'AI request failed')
  return data.result
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'unsaved'

export default function NewPostPage() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savedSlugRef = useRef<string>('')
  const savedAtRef   = useRef<number>(0)

  const [title, setTitle]               = useState('')
  const [content, setContent]           = useState('')
  const [excerpt, setExcerpt]           = useState('')
  const [tags, setTags]                 = useState('')
  const [category, setCategory]         = useState('protocol')
  const [featuredImage, setFeaturedImage] = useState('')
  const [scene, setScene]               = useState('default')
  const [mood, setMood]                 = useState('neutral')
  const [slug, setSlug]                 = useState('')

  const wordCount  = content.replace(/[#*`[\]]/g, '').split(/\s+/).filter(Boolean).length
  const titleLen   = title.length
  const excerptLen = excerpt.length

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [savedAgo, setSavedAgo]     = useState('')
  const [toast, setToast]           = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)
  const [publishModal, setPublishModal] = useState(false)
  const [publishing, setPublishing]     = useState(false)

  const [aiLoading, setAiLoading] = useState<AiSection | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [aiResults, setAiResults] = useState<Record<string, any>>({})
  const [copied, setCopied]       = useState<string | null>(null)
  const [open, setOpen] = useState<Record<string, boolean>>({
    meta: true, image: true, titles: true, excerpt: false, outline: false, seo: false, tags: false,
  })
  const toggle = (k: string) => setOpen(p => ({ ...p, [k]: !p[k] }))

  // Auto-slug from title (only if user hasn't manually edited it)
  const slugEditedRef = useRef(false)
  useEffect(() => {
    if (title && !slugEditedRef.current && !savedSlugRef.current) {
      setSlug(toSlug(title))
    }
  }, [title])

  // Auto-save (upserts draft after 4s)
  const doAutoSave = useCallback(async (
    t: string, c: string, e: string, tg: string,
    cat: string, img: string, sc: string, md: string, sl: string
  ) => {
    if (!t) return
    const finalSlug = sl || toSlug(t)
    setSaveStatus('saving')
    try {
      const res = await fetch('/api/posts/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: finalSlug, title: t, content: c, excerpt: e,
          tags: tg.split(',').map(x => x.trim()).filter(Boolean),
          category: cat, featuredImage: img, scene: sc, mood: md, status: 'draft',
        }),
      })
      const saved = await res.json()
      savedSlugRef.current = saved.slug
      setSlug(saved.slug)
      savedAtRef.current = Date.now()
      setSaveStatus('saved')
      setSavedAgo('just now')
    } catch {
      setSaveStatus('unsaved')
    }
  }, [])

  const scheduleAutoSave = useCallback(() => {
    if (!title) return
    setSaveStatus('unsaved')
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      doAutoSave(title, content, excerpt, tags, category, featuredImage, scene, mood, savedSlugRef.current || slug)
    }, 4000)
  }, [title, content, excerpt, tags, category, featuredImage, scene, mood, slug, doAutoSave])

  useEffect(() => { scheduleAutoSave() }, [title, content, excerpt, tags, category, featuredImage, scene, mood])

  // Markdown insert
  const insert = useCallback((before: string, after = '', placeholder = '') => {
    const ta = textareaRef.current; if (!ta) return
    const s = ta.selectionStart, e = ta.selectionEnd
    const sel = content.slice(s, e) || placeholder
    setContent(content.slice(0, s) + before + sel + after + content.slice(e))
    setTimeout(() => { ta.focus(); ta.setSelectionRange(s + before.length, s + before.length + sel.length) }, 0)
  }, [content])

  // Publish
  const doPublish = async () => {
    setPublishModal(false)
    setPublishing(true)
    try {
      const finalSlug = savedSlugRef.current || slug || toSlug(title)
      const res = await fetch('/api/posts/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: finalSlug, title, content, excerpt,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          category, featuredImage, scene, mood, status: 'published',
        }),
      })
      const post = await res.json()
      showToast('ok', 'Published!')
      setTimeout(() => { window.location.href = `/content/edit?slug=${post.slug}` }, 900)
    } catch {
      showToast('err', 'Publish failed')
    } finally {
      setPublishing(false)
    }
  }

  // AI
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
    setToast({ type, msg }); setTimeout(() => setToast(null), 3500)
  }

  const saveLabel =
    saveStatus === 'saving'  ? 'Auto-saving…' :
    saveStatus === 'saved'   ? `Saved ${savedAgo}` :
    saveStatus === 'unsaved' ? 'Unsaved changes' : ''

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: ET.bg, color: ET.ink }}>

      {/* Header */}
      <header className="shrink-0 h-12 flex items-center justify-between px-5 border-b z-30" style={{ backgroundColor: ET.surface, borderColor: ET.border }}>
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="hover:opacity-70 transition-opacity shrink-0">
            <Image src="/logo.png" alt="Adduckivity" width={22} height={22} className="rounded-md" />
          </Link>
          <span style={{ color: ET.border }}>/</span>
          <Link href="/content" className="text-xs transition-opacity hover:opacity-70 shrink-0" style={{ color: ET.sub }}>Content</Link>
          <span style={{ color: ET.border }}>/</span>
          <span className="text-xs font-semibold" style={{ color: ET.ink }}>New Post</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ backgroundColor: ET.accentL, color: ET.accent }}>Draft</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {saveLabel && (
            <span className="text-[11px] hidden md:block" style={{ color: saveStatus === 'unsaved' ? ET.accent : ET.sub }}>
              {saveLabel}
            </span>
          )}
          <button
            onClick={() => setPublishModal(true)}
            disabled={publishing || !title || !content}
            className="h-8 px-4 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{ backgroundColor: ET.ink, color: ET.surface }}
          >
            {publishing ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">

        {/* Left: metadata */}
        <aside className="w-64 shrink-0 border-r overflow-y-auto" style={{ backgroundColor: ET.surface, borderColor: ET.border }}>
          <SideSection label="Cover Image" open={open.image} onToggle={() => toggle('image')}>
            <CoverImagePicker value={featuredImage} onChange={setFeaturedImage} />
          </SideSection>

          <SideSection label="Post Metadata" open={open.meta} onToggle={() => toggle('meta')}>
            <Field label="Slug" icon={<Hash size={13} />}>
              <input
                value={slug}
                onChange={e => { slugEditedRef.current = true; setSlug(e.target.value) }}
                placeholder="auto-generated"
                className="et-input font-mono"
              />
              <p className="text-[10px] mt-0.5" style={{ color: ET.sub }}>Auto-filled from title</p>
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
              <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Brief summary for SEO…" rows={3} className="et-input resize-none text-xs leading-relaxed" />
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-[10px]" style={{ color: ET.sub }}>{excerptLen}/160</span>
                <ProgressBar value={excerptLen} max={160} optimal={[120, 160]} className="w-20" />
              </div>
            </Field>
            <Field label="Tags" icon={<Tag size={13} />}>
              <input value={tags} onChange={e => setTags(e.target.value)} placeholder="adhd, system, protocol" className="et-input font-mono" />
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
          </div>

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

      <ConfirmModal
        open={publishModal}
        title="Publish this post?"
        body="The post will be marked as published and appear in the public listing."
        confirmLabel="Publish"
        onConfirm={doPublish}
        onCancel={() => setPublishModal(false)}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-5 right-5 px-5 py-3 rounded-lg shadow-lg text-sm font-medium z-50"
            style={{ backgroundColor: toast.type === 'ok' ? '#16a34a' : '#ef4444', color: '#fff' }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{inputCss(ET)}</style>
    </div>
  )
}
