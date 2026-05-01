'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteButton({ slug, title, status }: { slug: string; title: string; status: 'draft' | 'published' | 'scheduled' }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  // Prevent deletion of published posts
  const canDelete = status !== 'published'

  const handleDelete = async () => {
    if (!canDelete) {
      alert('Published posts cannot be deleted. Please unpublish the post first.')
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/posts?slug=${slug}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.refresh()
      } else {
        alert('Failed to delete post')
        setIsDeleting(false)
        setShowConfirm(false)
      }
    } catch (err) {
      console.error('Delete error:', err)
      alert('Failed to delete post')
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  return (
    <div className="flex justify-end">
      {!showConfirm ? (
        <button
          onClick={() => canDelete && setShowConfirm(true)}
          className={`text-xs font-semibold transition-opacity ${canDelete ? 'hover:opacity-70 text-red-500' : 'text-gray-500 cursor-not-allowed opacity-50'}`}
          disabled={!canDelete || isDeleting}
          title={canDelete ? 'Delete this post' : 'Published posts cannot be deleted'}
        >
          🗑️
        </button>
      ) : (
        <div className="flex gap-1">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-xs font-semibold px-2 py-0.5 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
          >
            {isDeleting ? '...' : 'Yes'}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
            className="text-xs font-semibold px-2 py-0.5 rounded border border-gray-500 hover:bg-gray-800 disabled:opacity-50"
          >
            No
          </button>
        </div>
      )}
    </div>
  )
}
