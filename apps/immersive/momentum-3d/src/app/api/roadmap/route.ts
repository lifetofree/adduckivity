export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'

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
 * Returns parsed roadmap data from ROADMAP.md
 * 
 * In local development: reads directly from markdown files
 * In production: returns static milestone data
 */
export async function GET(req: NextRequest) {
  // Localhost only check
  const host = req.headers.get('host') || ''
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1')
  
  if (!isLocalhost) {
    return NextResponse.json({ phases: getStaticRoadmap() })
  }

  try {
    // Dynamic import for Node.js modules (only works in local dev)
    const { readFileSync } = await import('fs')
    const pathModule = await import('path')
    
    const PROJECT_ROOT = pathModule.resolve(process.cwd(), '../../..')
    const ROADMAP_PATH = pathModule.join(PROJECT_ROOT, 'ROADMAP.md')
    
    const content = readFileSync(ROADMAP_PATH, 'utf-8')
    const phases = parseMarkdownRoadmap(content)

    return NextResponse.json({ phases })
  } catch (err) {
    console.error('Failed to read roadmap, using static:', err)
    return NextResponse.json({ phases: getStaticRoadmap() })
  }
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

function parseMarkdownRoadmap(content: string): Phase[] {
  const phases: Phase[] = []
  const lines = content.split('\n')
  let currentPhase: Phase | null = null
  let taskIndex = 0

  for (const line of lines) {
    const headerMatch = line.match(/^#{2,3}\s+(.+)$/)
    if (headerMatch) {
      if (currentPhase) {
        phases.push(currentPhase)
      }
      currentPhase = { title: headerMatch[1], tasks: [] }
      taskIndex = 0
      continue
    }

    const taskMatch = line.match(/^\s*[-*]\s+\[([ xX])\]\s+(.+)$/)
    if (taskMatch && currentPhase) {
      const completed = taskMatch[1].toLowerCase() === 'x'
      const text = taskMatch[2].trim()
      currentPhase.tasks.push({
        id: `task-${phases.length}-${taskIndex++}`,
        text,
        completed,
        filePath: 'ROADMAP.md'
      })
    }
  }

  if (currentPhase) {
    phases.push(currentPhase)
  }

  return phases.length > 0 ? phases : getStaticRoadmap()
}
