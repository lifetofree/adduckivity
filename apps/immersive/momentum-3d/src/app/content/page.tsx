export const runtime = 'edge'

import Link from 'next/link'
import Image from 'next/image'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getAllPosts, promoteScheduledPosts } from '@/lib/posts'
import { ET } from '@/lib/theme'
import { getMockKV } from '@/lib/dev-kv'

export default async function ContentDashboard() {
  const isDev = process.env.NODE_ENV === 'development'
  const context = isDev ? null : getRequestContext<CloudflareEnv>()
  const kv = isDev ? getMockKV() : context!.env.POSTS_KV
  const env = isDev ? undefined : context!.env

  const allPosts  = await promoteScheduledPosts(kv, await getAllPosts(kv), env)
  const statusOrder = { draft: 0, scheduled: 1, published: 2 } as const
  const posts = [...allPosts].sort((a, b) => {
    const sd = statusOrder[a.status] - statusOrder[b.status]
    if (sd !== 0) return sd
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
  const published = posts.filter(p => p.status === 'published').length
  const scheduled = posts.filter(p => p.status === 'scheduled').length
  const drafts    = posts.filter(p => p.status === 'draft').length

  return (
    <div className="min-h-screen" style={{ backgroundColor: ET.bg, color: ET.ink }}>

      {/* ── Sticky header ── */}
      <header
        className="sticky top-0 z-10 border-b px-6 py-4 flex items-center justify-between"
        style={{
          backgroundColor: 'rgba(10,15,30,0.92)',
          borderColor: ET.border,
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Image src="/logo.png" alt="Adduckivity" width={26} height={26} className="rounded-md" />
          </Link>
          <span style={{ color: ET.border }}>/</span>
          <span className="text-sm font-semibold" style={{ color: ET.ink }}>Content</span>
        </div>

        <Link
          href="/content/new"
          className="h-8 px-4 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-opacity hover:opacity-80"
          style={{ backgroundColor: ET.ink, color: ET.surface }}
        >
          + New Post
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* ── Stats row ── */}
        <div className="flex items-center gap-8 mb-10">
          <Stat value={posts.length}  label={posts.length === 1 ? 'post' : 'posts'} />
          <div className="w-px h-8"  style={{ backgroundColor: ET.border }} />
          <Stat value={published}     label="published" color="#16a34a" />
          <div className="w-px h-8"  style={{ backgroundColor: ET.border }} />
          <Stat value={scheduled}     label="scheduled" color="#ca8a04" />
          <div className="w-px h-8"  style={{ backgroundColor: ET.border }} />
          <Stat value={drafts}        label={drafts === 1 ? 'draft' : 'drafts'} color={ET.accent} />
        </div>

        {/* ── Empty state ── */}
        {posts.length === 0 && (
          <div
            className="rounded-2xl border py-24 text-center"
            style={{ backgroundColor: ET.surface, borderColor: ET.border }}
          >
            <p className="text-sm mb-4" style={{ color: ET.sub }}>No posts yet.</p>
            <Link
              href="/content/new"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ backgroundColor: ET.accent, color: ET.surface }}
            >
              + Create your first post
            </Link>
          </div>
        )}

        {/* ── Table ── */}
        {posts.length > 0 && (
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: ET.border }}
          >
            {/* Head */}
            <div
              className="grid items-center px-5 py-2.5 border-b text-[11px] font-semibold uppercase tracking-wide"
              style={{
                gridTemplateColumns: '1fr 90px 100px 52px',
                gap: '1rem',
                backgroundColor: ET.muted,
                borderColor: ET.border,
                color: ET.sub,
              }}
            >
              <span>Post</span>
              <span className="text-right">Category</span>
              <span className="text-right">Date</span>
              <span className="text-right">Edit</span>
            </div>

            {/* Rows */}
            {posts.map(post => (
              <Row key={post.slug} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function Row({ post }: { post: import('@/lib/posts').Post }) {
  return (
    <div
      className="group grid items-start px-5 py-4 border-b last:border-0 transition-colors"
      style={{
        gridTemplateColumns: '1fr 90px 100px 52px',
        gap: '1rem',
        borderColor: ET.border,
        backgroundColor: ET.surface,
      }}
    >
      {/* Title block */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/content/edit?slug=${post.slug}`}
            className="font-semibold text-sm leading-snug transition-opacity hover:opacity-70 truncate"
            style={{ color: ET.ink }}
          >
            {post.title || <span style={{ color: ET.sub }}>Untitled</span>}
          </Link>
          {post.status === 'published' ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0" style={{ backgroundColor: 'rgba(22,163,74,0.12)', color: '#16a34a' }}>Published</span>
          ) : post.status === 'scheduled' ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0" style={{ backgroundColor: 'rgba(202,138,4,0.12)', color: '#ca8a04' }}>Scheduled</span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0" style={{ backgroundColor: ET.accentL, color: ET.accent }}>Draft</span>
          )}
        </div>
        {post.excerpt && (
          <p className="text-xs leading-relaxed line-clamp-1 mt-0.5" style={{ color: ET.sub }}>
            {post.excerpt}
          </p>
        )}
        {post.tags.length > 0 && (
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {post.tags.slice(0, 4).map(t => (
              <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full border" style={{ borderColor: ET.border, color: ET.sub }}>
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Category */}
      <div className="flex justify-end pt-0.5">
        <span
          className="text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize"
          style={{ backgroundColor: ET.accentL, color: ET.accent }}
        >
          {post.category}
        </span>
      </div>

      {/* Date */}
      <p className="font-mono text-[11px] text-right pt-0.5" style={{ color: ET.sub }}>
        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </p>

      {/* Edit */}
      <p className="text-right pt-0.5">
        <Link
          href={`/content/edit?slug=${post.slug}`}
          className="text-xs font-semibold transition-opacity hover:opacity-70"
          style={{ color: ET.accent }}
        >
          Edit →
        </Link>
      </p>
    </div>
  )
}

function Stat({ value, label, color }: { value: number; label: string; color?: string }) {
  return (
    <div>
      <p className="text-3xl font-bold leading-none" style={{ color: color || ET.ink }}>{value}</p>
      <p className="text-xs mt-1" style={{ color: ET.sub }}>{label}</p>
    </div>
  )
}
