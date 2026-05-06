'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { SceneLoader } from '@/components/shared/SceneLoader'

const ProtocolScene = dynamic(() => import('@/components/ProtocolBuilder/ProtocolScene'), {
  ssr: false,
  loading: () => <SceneLoader />
})

import ArchitectSidebar from '@/components/ProtocolBuilder/ArchitectSidebar'
import SystemBar from '@/components/ProtocolBuilder/SystemBar'
import SystemFooter from '@/components/ProtocolBuilder/SystemFooter'
import { IgnitionOverlay } from '@/components/ProtocolBuilder/IgnitionOverlay'
import IntroSlides, { useIntroSlides } from '@/components/ProtocolBuilder/IntroSlides'
import { loadProtocol, saveProtocol, ProtocolGraph, ProtocolNode, NodeType } from '@/lib/protocol-store'
import { useIgnitionStore } from '@/lib/ignition-store'

const EXECUTION_STORAGE_KEY = 'duckos:protocol:execution'

export default function ProtocolBuilderPage() {
  const router = useRouter()
  const { show: showIntro, done: doneIntro } = useIntroSlides()
  const [graph, setGraph] = useState<ProtocolGraph>({ nodes: [], edges: [] })
  const [mode, setMode] = useState<'build' | 'flow'>('build')
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const timerProcessedRef = useRef<string | null>(null)

  // Ignition State
  const { isActive: isIgnitionActive, targetNodeId, start: startIgnition, stop: stopIgnitionState } = useIgnitionStore()

  // Timer State
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  // -- Helpers & Callbacks --

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const updateNodes = useCallback((nodes: ProtocolNode[]) => {
    setGraph(prev => ({ ...prev, nodes }))
  }, [])

  const stopFlow = useCallback(() => {
    setMode('build')
    setActiveNodeId(null) // Reset active node when stopping flow
    stopIgnitionState() // Also ensure ignition state is cleared
    timerProcessedRef.current = null
  }, [stopIgnitionState])

  const activeNode = graph.nodes.find(n => n.id === activeNodeId) || null
  const outgoingEdges = graph.edges.filter(e => e.source === activeNodeId)
  const isActuallyLast = activeNodeId !== null && outgoingEdges.length === 0

  const nextNode = useCallback(() => {
    if (graph.nodes.length === 0 || !activeNodeId) return

    if (outgoingEdges.length > 0) {
      const nextId = outgoingEdges[0].target
      const nextNodeObj = graph.nodes.find(n => n.id === nextId)

      if (nextNodeObj?.type === 'ignition' && !isIgnitionActive) {
        const target = graph.edges.find(e => e.source === nextId)?.target
        startIgnition(target)
        return
      }

      setActiveNodeId(nextId)
    }
    // If no outgoing edges, user can continue clicking or stop manually
  }, [graph.nodes, graph.edges, outgoingEdges, activeNodeId, isIgnitionActive, startIgnition])

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

  // -- Effects --

  // Handle Ignition Completion Handoff
  useEffect(() => {
    if (!isIgnitionActive && targetNodeId) {
      // Ignition just completed, transition to the target node
      setMode('flow')
      setActiveNodeId(targetNodeId)
      // Clear the target node ID after use so it doesn't trigger again
      stopIgnitionState()
    }
  }, [isIgnitionActive, targetNodeId, stopIgnitionState])

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
      // Auto-select first node if none selected when entering flow mode
      if (!activeNodeId && graph.nodes.length > 0) {
        setActiveNodeId(graph.nodes[0].id)
        return
      }
      const node = graph.nodes.find(n => n.id === activeNodeId)
      if (node?.type === 'ignition' && !isIgnitionActive) {
        const firstTarget = graph.edges.find(edge => edge.source === node.id)?.target
        startIgnition(firstTarget)
      }
    }
    setPrevMode(mode)
  }, [mode, isInitialized, graph.nodes, graph.edges, activeNodeId, isIgnitionActive, startIgnition, prevMode])

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
  }, [activeNodeId, mode, isInitialized, graph.nodes, graph.edges, isIgnitionActive, startIgnition, prevActiveNodeId])

  // Reset completion state when active node changes
  useEffect(() => {
    // Reset timer processed ref when node changes
    if (activeNodeId !== timerProcessedRef.current) {
      timerProcessedRef.current = null
    }
  }, [activeNodeId])

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

  // Countdown Effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    let advanceTimeout: NodeJS.Timeout

    // Only auto-advance if it's actually a timer node and the timer finished
    if (isTimerRunning && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => (prev !== null ? prev - 1 : null))
      }, 1000)
    } else if (timeLeft === 0 && activeNode?.type === 'timer' && isTimerRunning && timerProcessedRef.current !== activeNodeId) {
      // Mark as processed immediately to prevent double-triggering during render cycles
      timerProcessedRef.current = activeNodeId;
      setIsTimerRunning(false)
      
      // nextNode handles both advancing and completing, so always call it
      advanceTimeout = setTimeout(() => {
        nextNode()
      }, 1500)
    }
    return () => {
      clearInterval(interval)
      if (advanceTimeout) clearTimeout(advanceTimeout)
    }
  }, [isTimerRunning, timeLeft, nextNode, activeNode?.type, outgoingEdges.length, graph.nodes, activeNodeId])

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
        {mode === 'flow' && activeNodeId && (
          <div className="flex gap-2">
            <button
              onClick={nextNode}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-widest transition-colors ${
                isActuallyLast
                  ? 'bg-emerald-500/20 border border-emerald-500/60 text-emerald-400 hover:bg-emerald-500/30'
                  : 'bg-white border-white text-black hover:bg-transparent hover:text-white'
              }`}
            >
              {isActuallyLast ? 'Protocol Complete ✓' : 'Next Step →'}
            </button>
            <button 
              onClick={stopFlow}
              className="px-4 py-2 bg-black/40 border border-white/10 text-white/50 text-xs font-mono uppercase tracking-widest hover:bg-white/10 transition-colors"
            >
              Stop Flow
            </button>
          </div>
        )}

        {/* Branching Options - shown when paths available */}
        {mode === 'flow' && outgoingEdges.length > 0 && (
          <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
            <p className="text-[10px] text-white/40 uppercase font-mono tracking-widest text-shadow-sm">Select Path:</p>
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
                  disabled={timeLeft === 0}
                  className={`w-full py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
                    timeLeft === 0
                      ? 'bg-white/5 border border-white/10 text-white/20 cursor-not-allowed'
                      : isTimerRunning 
                        ? 'bg-red-500/20 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white' 
                        : 'bg-cyan-500/20 border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black'
                  }`}
                >
                  {timeLeft === 0 
                    ? 'Protocol Done' 
                    : (isTimerRunning 
                      ? 'Pause Protocol' 
                      : (timeLeft === (activeNode.data?.duration || 25) * 60 
                        ? 'Initialize Countdown' 
                        : 'Resume Protocol'))}
                </button>
                <p className="text-[10px] text-white/40 uppercase font-mono text-center">
                  Focus Maintenance Protocol {timeLeft === 0 ? 'Finished' : (isTimerRunning ? 'Running' : 'Paused')}
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
      {showIntro && <IntroSlides onDone={doneIntro} />}
    </main>
  )
}
