'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProtocolScene from '@/components/ProtocolBuilder/ProtocolScene'
import ArchitectSidebar from '@/components/ProtocolBuilder/ArchitectSidebar'
import { loadProtocol, saveProtocol, ProtocolGraph, ProtocolNode, NodeType } from '@/lib/protocol-store'

const EXECUTION_STORAGE_KEY = 'duckos:protocol:execution'

export default function ProtocolBuilderPage() {
  const router = useRouter()
  const [graph, setGraph] = useState<ProtocolGraph>({ nodes: [], edges: [] })
  const [mode, setMode] = useState<'build' | 'flow'>('build')
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null)
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  // Initialize Graph and Execution State
  useEffect(() => {
    const init = async () => {
      const loaded = loadProtocol()
      if (loaded.nodes.length === 0) {
        // Seed initial nodes if none exist
        const nodes: ProtocolNode[] = [
          { id: '1', type: 'action', label: 'Morning Ritual', position: [0, 0, 0], data: {} },
          { id: '2', type: 'tool', label: 'Deep Work Session', position: [5, 2, -5], data: { toolId: 'atomizer' } },
          { id: '3', type: 'action', label: 'Recovery Walk', position: [2, -3, -10], data: {} },
        ];
        const edges = [
          { id: 'e1-2', source: '1', target: '2' },
          { id: 'e2-3', source: '2', target: '3' },
        ];
        setGraph({ nodes, edges })
      } else {
        setGraph(loaded)
      }

      // Load Execution State
      const savedExecution = localStorage.getItem(EXECUTION_STORAGE_KEY)
      if (savedExecution) {
        try {
          const { mode: savedMode, activeNodeId: savedId } = JSON.parse(savedExecution)
          setMode(savedMode)
          setActiveNodeId(savedId)
        } catch (e) {
          console.error('Failed to load execution state', e)
        }
      }
    }
    init()
  }, [])

  // Auto-save graph to localStorage
  useEffect(() => {
    saveProtocol(graph)
  }, [graph])

  // Auto-save execution state
  useEffect(() => {
    localStorage.setItem(EXECUTION_STORAGE_KEY, JSON.stringify({ mode, activeNodeId }))
  }, [mode, activeNodeId])

  const activeNode = graph.nodes.find(n => n.id === activeNodeId) || null
  const outgoingEdges = graph.edges.filter(e => e.source === activeNodeId)

  // Handle Timer Initialization when node changes
  useEffect(() => {
    if (activeNode?.type === 'timer') {
      setTimeLeft((activeNode.data?.duration || 25) * 60)
      setIsTimerRunning(false)
    } else {
      setTimeLeft(null)
      setIsTimerRunning(false)
    }
  }, [activeNodeId, activeNode?.type, activeNode?.data?.duration])

  const nextNode = useCallback(() => {
    if (graph.nodes.length === 0) return
    
    if (outgoingEdges.length === 1) {
      // Follow the single connection
      setActiveNodeId(outgoingEdges[0].target)
    } else if (outgoingEdges.length === 0) {
      // Fallback: cycle through nodes linearly if no outgoing connections
      const currentIndex = graph.nodes.findIndex(n => n.id === activeNodeId)
      const nextIndex = (currentIndex + 1) % graph.nodes.length
      setActiveNodeId(graph.nodes[nextIndex].id)
    }
    // If outgoingEdges.length > 1, the user must choose via HUD
  }, [graph.nodes, outgoingEdges, activeNodeId])

  // Countdown Effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    // Only auto-advance if it's actually a timer node and the timer finished
    if (isTimerRunning && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => (prev !== null ? prev - 1 : null))
      }, 1000)
    } else if (timeLeft === 0 && activeNode?.type === 'timer') {
      setIsTimerRunning(false)
      // Auto-advance only if there's a clear next path (0 or 1 edge)
      if (outgoingEdges.length <= 1) {
        setTimeout(() => {
          nextNode()
        }, 1500)
      }
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timeLeft, nextNode, activeNode?.type, outgoingEdges.length])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const updateNodes = (nodes: ProtocolNode[]) => {
    setGraph(prev => ({ ...prev, nodes }))
  }

  const addNode = (type: NodeType, toolId?: 'atomizer' | 'emergency') => {
    const newNode: ProtocolNode = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      label: type === 'tool' ? `New ${toolId} Node` : `New ${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
      position: [Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5],
      data: toolId ? { toolId } : (type === 'timer' ? { duration: 25 } : {})
    }
    setGraph(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }))
    setActiveNodeId(newNode.id)
  }

  const updateNode = (id: string, updates: Partial<ProtocolNode>) => {
    setGraph(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => n.id === id ? { ...n, ...updates } : n)
    }))
  }

  const deleteNode = (id: string) => {
    setGraph(prev => ({
      nodes: prev.nodes.filter(n => n.id !== id),
      edges: prev.edges.filter(e => e.source !== id && e.target !== id)
    }))
    if (activeNodeId === id) setActiveNodeId(null)
  }

  const addEdge = (source: string, target: string) => {
    const newEdge = { id: `e-${source}-${target}-${Date.now()}`, source, target }
    setGraph(prev => ({
      ...prev,
      edges: [...prev.edges, newEdge]
    }))
  }

  const deleteEdge = (id: string) => {
    setGraph(prev => ({
      ...prev,
      edges: prev.edges.filter(e => e.id !== id)
    }))
  }

  const toggleMode = () => {
    const newMode = mode === 'build' ? 'flow' : 'build'
    setMode(newMode)
    if (newMode === 'flow' && graph.nodes.length > 0 && !activeNodeId) {
      setActiveNodeId(graph.nodes[0].id)
    }
  }

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <ProtocolScene 
        nodes={graph.nodes} 
        edges={graph.edges} 
        activeNode={activeNode} 
        onSelectNode={setActiveNodeId}
        updateNodes={updateNodes}
        mode={mode}
      />
      
      {/* HUD: Status and Navigation */}
      <div className="absolute top-8 left-8 z-10 flex flex-col gap-6 max-w-sm">
        <div className="flex flex-col gap-1">
          <Link href="/" className="text-[10px] text-white/50 hover:text-cyan-500 font-mono uppercase tracking-widest mb-2 transition-colors">
            ← Back to Home
          </Link>
          <h1 className="text-2xl font-bold tracking-tighter text-white uppercase leading-none">System Architect</h1>
          <p className="text-[10px] text-cyan-500 font-mono">
            Status: {mode === 'build' ? 'Build Mode Active' : 'Flow Mode Active'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={toggleMode}
            className="px-4 py-2 bg-cyan-900/50 border border-cyan-500 text-cyan-500 text-xs font-mono uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-colors"
          >
            {mode === 'build' ? 'Initialize Flow' : 'Abort Flow'}
          </button>

          {mode === 'flow' && outgoingEdges.length <= 1 && (
            <button 
              onClick={nextNode}
              className="px-4 py-2 bg-white border border-white text-black text-xs font-mono uppercase tracking-widest hover:bg-transparent hover:text-white transition-colors"
            >
              Next Step →
            </button>
          )}
        </div>

        {/* Branching Options */}
        {mode === 'flow' && outgoingEdges.length > 1 && (
          <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
            <p className="text-[10px] text-white/40 uppercase font-mono tracking-widest">Select Next Path:</p>
            <div className="grid grid-cols-1 gap-2">
              {outgoingEdges.map(edge => {
                const targetNode = graph.nodes.find(n => n.id === edge.target)
                return (
                  <button
                    key={edge.id}
                    onClick={() => setActiveNodeId(edge.target)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-xs font-mono text-left uppercase hover:bg-cyan-500 hover:text-black hover:border-cyan-500 transition-all group flex items-center justify-between"
                  >
                    <span>{targetNode?.label || 'Unknown Node'}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Node Information Panel */}
        {activeNode && (
          <div className="mt-4 p-6 bg-black/40 border border-white/10 rounded-lg backdrop-blur-xl animate-in fade-in slide-in-from-left-4 duration-500">
            <p className="text-[10px] text-cyan-500 font-mono uppercase tracking-[0.2em] mb-1">
              {activeNode.type} Node
            </p>
            <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-4">
              {activeNode.label}
            </h2>
            
            {activeNode.type === 'tool' && activeNode.data?.toolId === 'atomizer' && (
              <div className="space-y-4">
                <div className="h-px bg-cyan-500/30 w-full" />
                <p className="text-xs text-white/70 leading-relaxed italic">
                  &quot;Law 1: System &gt; Emotion. Break the resistance.&quot;
                </p>
                <button 
                  onClick={() => router.push('/atomizer?returnTo=/protocol-builder')}
                  className="w-full px-4 py-3 bg-cyan-500 text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  Launch Atomizer
                </button>
              </div>
            )}

            {activeNode.type === 'timer' && (
              <div className="space-y-4">
                <div className="h-px bg-cyan-500/30 w-full" />
                <div className="text-4xl font-mono text-cyan-500 text-center py-4 bg-black/40 rounded-lg border border-white/5">
                  {timeLeft !== null ? formatTime(timeLeft) : '00:00'}
                </div>
                <button 
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`w-full py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
                    isTimerRunning 
                      ? 'bg-red-500/20 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white' 
                      : 'bg-cyan-500/20 border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black'
                  }`}
                >
                  {isTimerRunning ? 'Pause Protocol' : 'Initialize Countdown'}
                </button>
                <p className="text-[10px] text-white/40 uppercase font-mono text-center">
                  Focus Maintenance Protocol {isTimerRunning ? 'Running' : 'Paused'}
                </p>
              </div>
            )}

            {activeNode.type === 'action' && (
              <p className="text-xs text-white/50 font-mono">
                Awaiting manual completion of physical action.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Architect Sidebar */}
      {mode === 'build' && (
        <ArchitectSidebar 
          nodes={graph.nodes}
          edges={graph.edges}
          activeNodeId={activeNodeId}
          setActiveNodeId={setActiveNodeId}
          onAddNode={addNode}
          onUpdateNode={updateNode}
          onDeleteNode={deleteNode}
          onAddEdge={addEdge}
          onDeleteEdge={deleteEdge}
        />
      )}

      {/* Legend / Help */}
      <div className="absolute bottom-8 right-8 z-10 text-right pointer-events-none opacity-30">
        <p className="text-[10px] text-white font-mono uppercase tracking-widest">Protocol Visualization Engine v1.0</p>
        <p className="text-[10px] text-cyan-500 font-mono uppercase tracking-widest">Constellation Mapping Active</p>
      </div>
    </main>
  )
}
