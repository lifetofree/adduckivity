'use client'
import { useState, useEffect } from 'react'
import ProtocolScene from '@/components/ProtocolBuilder/ProtocolScene'
import { loadProtocol, ProtocolGraph, ProtocolNode } from '@/lib/protocol-store'

export default function ProtocolBuilderPage() {
  const [graph, setGraph] = useState<ProtocolGraph>({ nodes: [], edges: [] })
  const [mode, setMode] = useState<'build' | 'flow'>('build')
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null)

  useEffect(() => {
    const loaded = loadProtocol()
    if (loaded.nodes.length === 0) {
      // Seed initial node
      const seedNode: ProtocolNode = { id: 'seed', type: 'action', label: 'Initial Seed', position: [0, 0, 0], data: {} };
      setGraph({
        nodes: [seedNode],
        edges: []
      })
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

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <ProtocolScene 
        nodes={graph.nodes} 
        edges={graph.edges} 
        activeNode={activeNode} 
      />
      <div className="absolute top-8 left-8 z-10">
        <h1 className="text-2xl font-bold tracking-tighter text-white uppercase">System Architect</h1>
        <p className="text-[10px] text-cyan-500 font-mono">
          Status: {mode === 'build' ? 'Build Mode Active' : 'Flow Mode Active'}
        </p>
        <button 
          onClick={toggleMode}
          className="mt-4 px-4 py-2 bg-cyan-900/50 border border-cyan-500 text-cyan-500 text-xs font-mono uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-colors"
        >
          Switch to {mode === 'build' ? 'Flow' : 'Build'}
        </button>
      </div>
    </main>
  )
}
