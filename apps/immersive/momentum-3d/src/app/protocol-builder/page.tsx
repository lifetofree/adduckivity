'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProtocolScene from '@/components/ProtocolBuilder/ProtocolScene'
import { loadProtocol, ProtocolGraph, ProtocolNode } from '@/lib/protocol-store'

export default function ProtocolBuilderPage() {
  const router = useRouter()
  const [graph, setGraph] = useState<ProtocolGraph>({ nodes: [], edges: [] })
  const [mode, setMode] = useState<'build' | 'flow'>('build')
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null)

  useEffect(() => {
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
  }, [])

  const activeNode = graph.nodes.find(n => n.id === activeNodeId) || null

  const toggleMode = () => {
    const newMode = mode === 'build' ? 'flow' : 'build'
    setMode(newMode)
    if (newMode === 'flow' && graph.nodes.length > 0) {
      setActiveNodeId(graph.nodes[0].id)
    } else {
      setActiveNodeId(null)
    }
  }

  const nextNode = () => {
    if (graph.nodes.length === 0) return
    const currentIndex = graph.nodes.findIndex(n => n.id === activeNodeId)
    const nextIndex = (currentIndex + 1) % graph.nodes.length
    setActiveNodeId(graph.nodes[nextIndex].id)
  }

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <ProtocolScene 
        nodes={graph.nodes} 
        edges={graph.edges} 
        activeNode={activeNode} 
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

          {mode === 'flow' && (
            <button 
              onClick={nextNode}
              className="px-4 py-2 bg-white border border-white text-black text-xs font-mono uppercase tracking-widest hover:bg-transparent hover:text-white transition-colors"
            >
              Next Step →
            </button>
          )}
        </div>

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
                  onClick={() => router.push('/atomizer')}
                  className="w-full px-4 py-3 bg-cyan-500 text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  Launch Atomizer
                </button>
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

      {/* Legend / Help */}
      <div className="absolute bottom-8 right-8 z-10 text-right pointer-events-none opacity-30">
        <p className="text-[10px] text-white font-mono uppercase tracking-widest">Protocol Visualization Engine v1.0</p>
        <p className="text-[10px] text-cyan-500 font-mono uppercase tracking-widest">Constellation Mapping Active</p>
      </div>
    </main>
  )
}
