'use client'

import { Suspense } from 'react'
import EditPostInner from './EditPostInner'

export default function EditPostPage() {
  return (
    <Suspense fallback={null}>
      <EditPostInner />
    </Suspense>
  )
}
