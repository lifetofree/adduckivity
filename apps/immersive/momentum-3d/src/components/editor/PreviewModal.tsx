'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { ET } from '@/lib/theme'
import { renderMarkdown, extractHeadings } from '@/lib/markdown'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  content: string
  featuredImage?: string
  imageAlt?: string
  excerpt?: string
  category?: string
  tags?: string
  readingTime?: string
}

export default function PreviewModal({
  open, onClose,
  title, content, featuredImage, imageAlt, excerpt, category, tags, readingTime,
}: Props) {
  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  const tagList  = tags ? tags.split(',').map(t => t.trim().replace(/^#+/, '')).filter(Boolean) : []
  const bodyHtml = renderMarkdown(content || '')
  const headings = extractHeadings(content || '')

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex flex-col overflow-hidden"
          style={{ backgroundColor: ET.bg }}
        >
          {/* Preview bar */}
          <div
            className="shrink-0 h-11 flex items-center justify-between px-5 border-b"
            style={{ backgroundColor: ET.surface, borderColor: ET.border }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: ET.accentL, color: ET.accent }}>
                Preview
              </span>
              <span className="text-xs truncate max-w-xs hidden sm:block" style={{ color: ET.sub }}>
                {title || 'Untitled'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs border transition-opacity hover:opacity-70"
              style={{ borderColor: ET.border, color: ET.mid, backgroundColor: ET.bg }}
            >
              <X size={12} />
              Close preview
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-6 py-12">

              {/* Category + reading time */}
              {(category || readingTime) && (
                <div className="flex items-center gap-3 mb-6">
                  {category && (
                    <span className="text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border"
                      style={{ color: ET.accent, borderColor: ET.border, backgroundColor: ET.accentL }}>
                      {category}
                    </span>
                  )}
                  {readingTime && (
                    <span className="text-xs" style={{ color: ET.sub }}>{readingTime}</span>
                  )}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" style={{ color: ET.ink }}>
                {title || <span style={{ color: ET.sub }}>Untitled</span>}
              </h1>

              {/* Excerpt */}
              {excerpt && (
                <p className="text-lg mb-8 leading-relaxed" style={{ color: ET.mid }}>{excerpt}</p>
              )}

              {/* Cover image */}
              {featuredImage && (
                <div className="relative w-full rounded-xl overflow-hidden mb-10" style={{ aspectRatio: '16 / 9', backgroundColor: ET.muted }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredImage}
                    alt={imageAlt || title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Table of Contents */}
              {headings.length >= 2 && (
                <nav className="rounded-xl border mb-10 p-5" style={{ backgroundColor: ET.surface, borderColor: ET.border }}>
                  <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: ET.sub }}>Contents</p>
                  <ol className="space-y-1.5">
                    {headings.map((h, i) => (
                      <li key={i} style={{ paddingLeft: h.level === 1 ? 0 : h.level === 2 ? '0.75rem' : '1.5rem' }}>
                        <a href={`#${h.id}`} className="text-sm transition-opacity hover:opacity-70 leading-snug block" style={{ color: h.level === 1 ? ET.ink : ET.mid }}>
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              {/* Body */}
              <article
                className="prose-et"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />

              {/* Tags */}
              {tagList.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-8 border-t mt-12" style={{ borderColor: ET.border }}>
                  {tagList.map(t => (
                    <span key={t} className="text-xs px-3 py-1 rounded-full border"
                      style={{ borderColor: ET.border, color: ET.sub, backgroundColor: ET.surface }}>
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <style>{`
            .prose-et p   { margin: 0 0 1.25rem; line-height: 1.8; color: ${ET.mid}; font-size: 1rem; }
            .prose-et h1  { font-size: 1.75rem; font-weight: 700; color: ${ET.ink}; margin: 2rem 0 1rem; line-height: 1.3; }
            .prose-et h2  { font-size: 1.35rem; font-weight: 700; color: ${ET.ink}; margin: 2rem 0 0.75rem; }
            .prose-et h3  { font-size: 1.1rem;  font-weight: 600; color: ${ET.ink}; margin: 1.5rem 0 0.5rem; }
            .prose-et ul, .prose-et ol { padding-left: 1.5rem; margin: 0 0 1.25rem; color: ${ET.mid}; }
            .prose-et li  { margin-bottom: 0.4rem; line-height: 1.7; }
            .prose-et blockquote {
              border-left: 3px solid ${ET.accent}; margin: 1.5rem 0;
              padding: 0.5rem 0 0.5rem 1.25rem; color: ${ET.sub}; font-style: italic;
              background: ${ET.accentL}; border-radius: 0 0.5rem 0.5rem 0;
            }
            .prose-et code { font-size: 0.85em; background: ${ET.muted}; color: ${ET.accent}; padding: 0.15em 0.4em; border-radius: 0.25rem; }
            .prose-et pre  { background: ${ET.muted}; color: ${ET.ink}; border-radius: 0.75rem; padding: 1.25rem 1.5rem; overflow-x: auto; margin: 1.5rem 0; font-size: 0.875rem; line-height: 1.7; }
            .prose-et pre code { background: none; color: inherit; padding: 0; }
            .prose-et a   { color: ${ET.accent}; text-decoration: underline; text-decoration-color: ${ET.accentL}; text-underline-offset: 3px; }
            .prose-et a:hover { text-decoration-color: ${ET.accent}; }
            .prose-et hr  { border: none; border-top: 1px solid ${ET.border}; margin: 2.5rem 0; }
            .prose-et strong { color: ${ET.ink}; font-weight: 600; }
            .prose-et table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; }
            .prose-et th { background: ${ET.muted}; color: ${ET.ink}; font-weight: 600; text-align: left; padding: 0.6rem 1rem; border: 1px solid ${ET.border}; }
            .prose-et td { color: ${ET.mid}; padding: 0.55rem 1rem; border: 1px solid ${ET.border}; }
            .prose-et tr:nth-child(even) td { background: ${ET.surface}; }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
