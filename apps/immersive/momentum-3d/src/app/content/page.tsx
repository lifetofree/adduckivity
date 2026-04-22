import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export default function ContentDashboard() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      <header className="bg-white border-b border-[#E8E8E6] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-700 text-sm transition-colors">← Home</Link>
          <span className="text-gray-200">/</span>
          <span className="text-sm font-medium text-gray-900">Content</span>
        </div>
        <Link
          href="/content/new"
          className="px-4 py-2 bg-[#141414] text-white text-sm font-medium rounded-md hover:bg-[#2a2a2a] transition-colors"
        >
          + New Post
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[#141414]">Posts</h1>
          <p className="text-sm text-gray-400 mt-1">{posts.length} {posts.length === 1 ? 'post' : 'posts'}</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E8E8E6] overflow-hidden">
          {posts.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-gray-400 text-sm">No posts yet.</p>
              <Link href="/content/new" className="mt-3 inline-block text-sm text-[#141414] underline underline-offset-2">
                Create your first post
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8E8E6] text-left">
                  <th className="px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Title</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Category</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Tags</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Date</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Read</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E6]">
                {posts.map(post => (
                  <tr key={post.slug} className="hover:bg-[#FBFBFA] transition-colors">
                    <td className="px-5 py-3.5">
                      <Link href={`/content/${post.slug}`} className="font-medium text-[#141414] hover:text-gray-500 transition-colors">
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{post.category}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map(t => (
                          <span key={t} className="px-2 py-0.5 bg-violet-50 text-violet-700 text-xs rounded-full">{t}</span>
                        ))}
                        {post.tags.length > 3 && <span className="text-xs text-gray-400">+{post.tags.length - 3}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 font-mono text-xs">
                      {new Date(post.date).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{post.readingTime}</td>
                    <td className="px-5 py-3.5 text-right">
                      <Link href={`/content/${post.slug}`} className="text-xs text-gray-400 hover:text-[#141414] transition-colors">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
