export const runtime = 'edge'

import { NextResponse } from 'next/server'

interface Task {
  id: string
  text: string
  completed: boolean
  filePath: string
}

interface Phase {
  title: string
  tasks: Task[]
}

/**
 * GET /api/roadmap
 * Returns static roadmap milestone data.
 *
 * File-system reads are not safe in an edge runtime — any host that sets
 * `Host: localhost` could trigger them on production workers. Static data
 * is always returned instead.
 */
export async function GET() {
  return NextResponse.json({ phases: getStaticRoadmap() })
}

function getStaticRoadmap(): Phase[] {
  return [
    {
      title: 'Foundation',
      tasks: [
        { id: 'f1', text: 'Set up Next.js 16 project with Cloudflare Pages', completed: true, filePath: '' },
        { id: 'f2', text: 'Configure KV and R2 bindings', completed: true, filePath: '' },
        { id: 'f3', text: 'Deploy core routes', completed: true, filePath: '' },
      ]
    },
    {
      title: 'Content Studio',
      tasks: [
        { id: 'c1', text: 'Build CMS with auto-save and scheduling', completed: true, filePath: '' },
        { id: 'c2', text: 'Integrate WordPress REST API', completed: true, filePath: '' },
        { id: 'c3', text: 'Add Facebook auto-post on publish', completed: true, filePath: '' },
      ]
    },
    {
      title: 'Protocols',
      tasks: [
        { id: 'p1', text: 'Build Emergency Recovery (Momentum Protocol)', completed: true, filePath: '' },
        { id: 'p2', text: 'Build The Atomizer (AI task decomposition)', completed: true, filePath: '' },
        { id: 'p3', text: 'Build Protocol Builder (3D constellation)', completed: true, filePath: '' },
        { id: 'p4', text: 'Build Ignition (600s power-up sequence)', completed: true, filePath: '' },
      ]
    },
    {
      title: 'Optimization',
      tasks: [
        { id: 'o1', text: 'Dynamic imports for 3D components', completed: true, filePath: '' },
        { id: 'o2', text: 'Gradient lock model implementation', completed: true, filePath: '' },
        { id: 'o3', text: 'SEO metadata from Jetpack', completed: true, filePath: '' },
      ]
    },
    {
      title: 'Revenue',
      tasks: [
        { id: 'r1', text: 'Launch free Emergency Protocol', completed: true, filePath: '' },
        { id: 'r2', text: 'Launch paid Recovery Protocol', completed: false, filePath: '' },
        { id: 'r3', text: 'Build digital product funnel', completed: false, filePath: '' },
      ]
    }
  ]
}
