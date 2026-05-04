'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProtocolScene from '@/components/ProtocolBuilder/ProtocolScene'
import ArchitectSidebar from '@/components/ProtocolBuilder/ArchitectSidebar'
import SystemBar from '@/components/ProtocolBuilder/SystemBar'
import SystemFooter from '@/components/ProtocolBuilder/SystemFooter'
import { IgnitionOverlay } from '@/components/ProtocolBuilder/IgnitionOverlay'
import { loadProtocol, saveProtocol, ProtocolGraph, ProtocolNode, NodeType } from '@/lib/protocol-store'
import { useIgnitionStore } from '@/lib/ignition-store'

const EXECUTION_STORAGE_KEY = 'duckos:protocol:execution'

export default function ProtocolBuilderPage() {
  const router = useRouter()
  const [graph, setGraph] = useState<ProtocolGraph>({ nodes: [], edges: [] })
  const [mode, setMode] = useState<'build' | 'flow'>('build')
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Ignition State
  const { isActive: isIgnitionActive, targetNodeId, start: startIgnition } = useIgnitionStore()
  
  // Handle Ignition Completion Handoff
  useEffect(() => {
    if (!isIgnitionActive && targetNodeId) {
      // Ignition just completed, transition to the target node
      setMode('flow')
      setActiveNodeId(targetNodeId)
    }
  }, [isIgnitionActive, targetNodeId])
  
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
          // Only restore if the saved activeNodeId still exists in the loaded graph
          const idExists = loaded.nodes.some(n => n.id === savedId)
          setMode(savedMode || 'build')
          setActiveNodeId(idExists ? savedId : null)
        } catch (e) {
          console.error('Failed to load execution state', e)
        }
      }
      
      // Mark as initialized after loading state
      setIsInitialized(true)
    }
    init()
  }, [])

  // Auto-save graph to localStorage with syncing indicator
  useEffect(() => {
    if (!isInitialized) return // Prevent overwriting with initial state
    saveProtocol(graph)
    setIsSyncing(true)
    const timer = setTimeout(() => setIsSyncing(false), 800)
    return () => clearTimeout(timer)
  }, [graph, isInitialized])

  // Auto-save execution state (only after initialization to avoid overwriting with defaults)
  useEffect(() => {
    if (!isInitialized) return
    localStorage.setItem(EXECUTION_STORAGE_KEY, JSON.stringify({ mode, activeNodeId }))
  }, [mode, activeNodeId, isInitialized])

  // Ignition Auto-Trigger: Only triggers when switching TO flow mode with an ignition node selected
  const [prevMode, setPrevMode] = useState<'build' | 'flow'>('build')
  useEffect(() => {
    if (!isInitialized) return
    // Only trigger when transitioning TO flow mode (not every render)
    if (mode === 'flow' && prevMode === 'build') {
      const node = graph.nodes.find(n => n.id === activeNodeId)
      if (node?.type === 'ignition' && !isIgnitionActive) {
        const firstTarget = graph.edges.find(edge => edge.source === node.id)?.target
        startIgnition(firstTarget)
      }
    }
    setPrevMode(mode)
  }, [mode, isInitialized, graph.nodes, activeNodeId, isIgnitionActive, startIgnition])

  // Ignition Auto-Trigger: When activeNodeId changes TO an ignition node (while already in flow mode)
  const [prevActiveNodeId, setPrevActiveNodeId] = useState<string | null>(null)
  useEffect(() => {
    if (!isInitialized) return
    // Trigger when navigating to ignition node via Next Step (already in flow mode)
    if (mode === 'flow' && activeNodeId !== prevActiveNodeId) {
      const node = graph.nodes.find(n => n.id === activeNodeId)
      if (node?.type === 'ignition' && !isIgnitionActive) {
        const firstTarget = graph.edges.find(edge => edge.source === node.id)?.target
        startIgnition(firstTarget)
      }
    }
    setPrevActiveNodeId(activeNodeId)
  }, [activeNodeId, mode, isInitialized, graph.nodes, isIgnitionActive, startIgnition, prevActiveNodeId])

  const activeNode = graph.nodes.find(n => n.id === activeNodeId) || null
  const outgoingEdges = graph.edges.filter(e => e.source === activeNodeId)
  
  // Check if current node is the last one (no outgoing edges and at end of graph)
  const isLastNode = activeNode && outgoingEdges.length === 0 && 
    graph.nodes.findIndex(n => n.id === activeNodeId) === graph.nodes.length - 1
  
  // Timer is still running on last node
  const isTimerRunningOnLastNode = isLastNode && activeNode?.type === 'timer' && timeLeft !== null && timeLeft > 0
  
  // Timer just completed on last node (show "Protocol Complete")
  const isTimerCompletedOnLastNode = isLastNode && activeNode?.type === 'timer' && timeLeft === 0

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
    
    const currentNode = graph.nodes.find(n => n.id === activeNodeId)
    
    if (outgoingEdges.length === 1) {
      // Follow the single connection
      const nextId = outgoingEdges[0].target
      const nextNodeObj = graph.nodes.find(n => n.id === nextId)
      
      // If the next node is ignition, trigger it and let handoff handle activation
      if (nextNodeObj?.type === 'ignition' && !isIgnitionActive) {
        const target = graph.edges.find(e => e.source === nextId)?.target
        startIgnition(target)
        return // Don't set activeNodeId here — handoff will after ignition finishes
      }
      
      setActiveNodeId(nextId)
    } else if (outgoingEdges.length === 0) {
      // Dead end — ignition nodes have no next step
      if (currentNode?.type === 'ignition') {
        setMode('build')
        setActiveNodeId(null)
        return
      }
      
      // Check if this is the last node in the graph
      const isLastNode = graph.nodes.length === 1 || 
        graph.nodes.findIndex(n => n.id === activeNodeId) === graph.nodes.length - 1
      
      if (isLastNode) {
        // Don't advance - stay on last node
        return
      }
      
      // Fallback: cycle through nodes linearly if no outgoing connections
      const currentIndex = graph.nodes.findIndex(n => n.id === activeNodeId)
      const nextIndex = (currentIndex + 1) % graph.nodes.length
      setActiveNodeId(graph.nodes[nextIndex].id)
    }
    // If outgoingEdges.length > 1, the user must choose via HUD
  }, [graph.nodes, outgoingEdges, activeNodeId, startIgnition])

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
      // Don't auto-advance if this is the last node
      if (!isLastNode && outgoingEdges.length > 0) {
        setTimeout(() => {
          nextNode()
        }, 1500)
      }
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timeLeft, nextNode, activeNode?.type, outgoingEdges.length, isLastNode])

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

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <SystemBar 
        title="Architect" 
        mode={mode} 
        setMode={setMode} 
        isSyncing={isSyncing} 
        showModeSwitcher={true}
        activeNodeId={activeNodeId}
      />

      <div className={mode === 'build' && activeNode?.type === 'tool' ? 'pointer-events-none' : ''}>
        <ProtocolScene 
          nodes={graph.nodes} 
          edges={graph.edges} 
          activeNode={activeNode} 
          onSelectNode={setActiveNodeId}
          updateNodes={updateNodes}
          mode={mode}
        />
      </div>
      
      {/* HUD: Task Controls */}
      <div className="absolute top-24 left-8 z-10 flex flex-col gap-6 max-w-sm">
        {mode === 'flow' && (
          <div className="flex gap-2">
            {outgoingEdges.length <= 1 && (
              <button 
                onClick={nextNode}
                disabled={isLastNode === true}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-widest transition-colors ${
                  isLastNode
                    ? 'bg-white/10 border border-white/10 text-white/30 cursor-not-allowed opacity-50'
                    : 'bg-white border-white text-black hover:bg-transparent hover:text-white'
                }`}
              >
                {isLastNode 
                  ? (isTimerRunningOnLastNode ? 'Next Step →' : '✓ Protocol Complete')
                  : 'Next Step →'
                }
              </button>
            )}
            <button 
              onClick={() => setMode('build')}
              className="px-4 py-2 bg-black/40 border border-white/10 text-white/50 text-xs font-mono uppercase tracking-widest hover:bg-white/10 transition-colors"
            >
              Stop Flow
            </button>
          </div>
        )}

        {/* Branching Options */}
        {mode === 'flow' && outgoingEdges.length > 1 && (
          <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
            <p className="text-[10px] text-white/40 uppercase font-mono tracking-widest text-shadow-sm">Select Next Path:</p>
            <div className="grid grid-cols-1 gap-2">
              {outgoingEdges.map(edge => {
                const targetNode = graph.nodes.find(n => n.id === edge.target)
                return (
                  <button
                    key={edge.id}
                    onClick={() => setActiveNodeId(edge.target)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-xs font-mono text-left uppercase hover:bg-cyan-500 hover:text-black hover:border-cyan-500 transition-all group flex items-center justify-between backdrop-blur-md"
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
        {activeNode && mode === 'flow' && (
          <div className="p-6 bg-black/40 border border-white/10 rounded-lg backdrop-blur-xl animate-in fade-in slide-in-from-left-4 duration-500 shadow-2xl">
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
        <p className="text-[10px] text-white font-mono uppercase tracking-widest">Protocol Visualization Engine v1.1</p>
        <p className="text-[10px] text-cyan-500 font-mono uppercase tracking-widest">Constellation Mapping Active</p>
      </div>

      {/* System Footer (Hidden in Flow Mode for full immersion) */}
      <div className={`mt-auto transition-opacity duration-700 ${mode === 'flow' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <SystemFooter />
      </div>

      {/* Ignition Overlay */}
      <IgnitionOverlay />
    </main>
  )
}
