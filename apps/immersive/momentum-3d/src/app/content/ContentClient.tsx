'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ET } from '@/lib/theme'
import DeleteButton from './DeleteButton'

interface Post {
  slug: string
  title: string
  date: string
  status: 'draft' | 'published' | 'scheduled'
  category: string
  featuredImage?: string
}

export default function ContentClient() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json() as Promise<{ posts?: Post[] }>)
      .then(data => {
        setPosts(data.posts || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: ET.bg }}><p style={{ color: ET.sub }}>Loading...</p></div>
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: ET.bg, color: ET.ink }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b" style={{ borderColor: ET.border }}>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: ET.ink }}>Content Management</h1>
            <p className="text-sm" style={{ color: ET.sub }}>
              {posts.length} {posts.length === 1 ? 'post' : 'posts'} total
            </p>
          </div>
          <Link
            href="/content/new"
            className="px-6 py-3 rounded-xl font-semibold text-sm border transition-all hover:opacity-80"
            style={{ borderColor: ET.accent, color: ET.accent, backgroundColor: 'rgba(0,229,255,0.05)' }}
          >
            + New Post
          </Link>
        </div>

        {/* Posts Table */}
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: ET.surface, borderColor: ET.border }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: ET.muted, borderBottom: `1px solid ${ET.border}` }}>
                  <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider" style={{ color: ET.sub }}>Post</th>
                  <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider" style={{ color: ET.sub }}>Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider" style={{ color: ET.sub }}>Category</th>
                  <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider" style={{ color: ET.sub }}>Date</th>
                  <th className="px-6 py-4 text-right font-semibold text-xs uppercase tracking-wider" style={{ color: ET.sub }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm" style={{ color: ET.sub }}>
                      No posts yet. Create your first post!
                    </td>
                  </tr>
                ) : (
                  posts.map(post => (
                    <tr
                      key={post.slug}
                      className="border-b transition-colors hover:bg-black/20"
                      style={{ borderColor: ET.border }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {post.featuredImage && (
                            <div className="relative w-16 h-9 rounded overflow-hidden shrink-0" style={{ backgroundColor: ET.muted }}>
                              <Image
                                src={post.featuredImage}
                                alt={post.title}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            </div>
                          )}
                          <div className="min-w-0">
                            <Link
                              href={`/content/edit?slug=${post.slug}`}
                              className="font-semibold text-sm hover:opacity-70 transition-opacity block truncate"
                              style={{ color: ET.ink }}
                            >
                              {post.title}
                            </Link>
                            <p className="text-xs mt-0.5" style={{ color: ET.sub }}>/{post.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${
                            post.status === 'published' ? 'bg-green-500/10 text-green-500' :
                            post.status === 'scheduled' ? 'bg-purple-500/10 text-purple-500' :
                            'bg-gray-500/10 text-gray-500'
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs" style={{ color: ET.mid }}>{post.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono" style={{ color: ET.sub }}>{post.date}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all hover:opacity-80"
                            style={{ borderColor: ET.border, color: ET.mid }}
                          >
                            View
                          </Link>
                          <Link
                            href={`/content/edit?slug=${post.slug}`}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all hover:opacity-80"
                            style={{ borderColor: ET.border, color: ET.mid }}
                          >
                            Edit
                          </Link>
                          <DeleteButton slug={post.slug} title={post.title} status={post.status} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
