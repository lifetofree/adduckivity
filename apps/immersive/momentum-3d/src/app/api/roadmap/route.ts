// This route requires Node.js runtime — uses fs/path which are unavailable on edge.
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

// Paths relative to the project root
// process.cwd() is apps/immersive/momentum-3d
const PROJECT_ROOT = path.resolve(process.cwd(), '../../..')
const ROADMAP_PATH = path.join(PROJECT_ROOT, 'ROADMAP.md')
const PLANS_DIR = path.join(PROJECT_ROOT, 'docs/superpowers/plans')

/**
 * Returns true if `target` resolves to a path inside `root`.
 * Prevents path traversal via "../" segments.
 */
function isInside(root: string, target: string): boolean {
  const r = path.resolve(root)
  const t = path.resolve(target)
  return t === r || t.startsWith(r + path.sep)
}

/** Stable, content-addressed task ID — survives line moves and edits to other tasks. */
function stableTaskId(filePath: string, taskText: string): string {
  const hash = crypto.createHash('sha1').update(taskText).digest('hex').slice(0, 8)
  return `${path.basename(filePath)}-${hash}`
}

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
 * Parses a markdown file for phases and tasks.
 * Looks for headers (Phases) and checklist items ([ ] or [x]).
 */
function parseMarkdown(filePath: string): Phase[] {
  if (!fs.existsSync(filePath)) return []
  
  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split('\n')
  const phases: Phase[] = []
  let currentPhase: Phase | null = null

  lines.forEach((line, index) => {
    // Match headers like "## Phase 1: ..." or "### Phase 1: ..."
    const headerMatch = line.match(/^#{2,3}\s+(.+)$/)
    if (headerMatch) {
      if (currentPhase && currentPhase.tasks.length > 0) {
        phases.push(currentPhase)
      }
      currentPhase = { title: headerMatch[1], tasks: [] }
    }

    // Match checklist items: - [ ] Task or - [x] Task
    const taskMatch = line.match(/^\s*[-*]\s+\[([ xX])\]\s+(.+)$/)
    if (taskMatch && currentPhase) {
      const taskText = taskMatch[2].trim()
      currentPhase.tasks.push({
        id: stableTaskId(filePath, taskText),
        text: taskText,
        completed: taskMatch[1].toLowerCase() === 'x',
        filePath: path.relative(PROJECT_ROOT, filePath)
      })
    }
  })

  // TypeScript narrows the closure-mutated currentPhase to `null` here; cast to recover.
  const lastPhase = currentPhase as Phase | null
  if (lastPhase && lastPhase.tasks.length > 0) {
    phases.push(lastPhase)
  }

  return phases
}

/**
 * GET /api/roadmap
 * Returns the parsed roadmap and plans.
 */
export async function GET() {
  try {
    const roadmapPhases = parseMarkdown(ROADMAP_PATH)
    
    let allPhases = [...roadmapPhases]
    
    if (fs.existsSync(PLANS_DIR)) {
      const planFiles = fs.readdirSync(PLANS_DIR).filter(f => f.endsWith('.md'))
      planFiles.forEach(file => {
        const planPhases = parseMarkdown(path.join(PLANS_DIR, file))
        allPhases = [...allPhases, ...planPhases]
      })
    }

    return NextResponse.json({ phases: allPhases })
  } catch (error) {
    console.error('Failed to read roadmap:', error)
    return NextResponse.json({ error: 'Failed to read roadmap' }, { status: 500 })
  }
}

/**
 * POST /api/roadmap
 * Toggles a task's completion status in the markdown file.
 */
export async function POST(req: NextRequest) {
  try {
    const { filePath, text, completed } = await req.json() as {
      filePath?: string; text?: string; completed?: boolean
    }
    if (typeof filePath !== 'string' || typeof text !== 'string') {
      return NextResponse.json({ error: 'filePath and text are required strings' }, { status: 400 })
    }

    const fullPath = path.resolve(PROJECT_ROOT, filePath)
    // Path traversal guard: must stay inside project root.
    if (!isInside(PROJECT_ROOT, fullPath)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }
    // Only allow editing .md files (further hardening).
    if (!fullPath.endsWith('.md')) {
      return NextResponse.json({ error: 'Only markdown files can be updated' }, { status: 400 })
    }

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const content = fs.readFileSync(fullPath, 'utf8')
    const lines = content.split('\n')
    let updated = false

    const newLines = lines.map(line => {
      // Look for the exact task line
      // Use regex to find the checklist part and match the text
      const taskRegex = new RegExp(`^(\\s*[-*]\\s+\\[)[ xX](\\]\\s+)${escapeRegExp(text)}\\s*$`)
      if (!updated && taskRegex.test(line)) {
        updated = true
        return line.replace(/\[[ xX]\]/, completed ? '[x]' : '[ ]')
      }
      return line
    })

    if (updated) {
      fs.writeFileSync(fullPath, newLines.join('\n'), 'utf8')
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Task not found in file' }, { status: 404 })
    }
  } catch (error) {
    console.error('Failed to update task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
