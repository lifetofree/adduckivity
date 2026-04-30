'use client'
import { useState, useEffect } from 'react'
import ProtocolScene from '@/components/ProtocolBuilder/ProtocolScene'
import { loadProtocol, ProtocolNode } from '@/lib/protocol-store'

export default function ProtocolBuilderPage() {
  const [graph, setGraph] = useState({ nodes: [] as ProtocolNode[], edges: [] })

  useEffect(() => {
    const loaded = loadProtocol()
    if (loaded.nodes.length === 0) {
      // Seed initial node
      setGraph({
        nodes: [{ id: 'seed', type: 'action', label: 'Initial Seed', position: [0, 0, 0], data: {} }],
        edges: []
      })
    } else {
      setGraph(loaded)
    }
  }, [])

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <ProtocolScene nodes={graph.nodes} />
      <div className="absolute top-8 left-8 z-10">
        <h1 className="text-2xl font-bold tracking-tighter text-white uppercase">System Architect</h1>
        <p className="text-[10px] text-cyan-500 font-mono">Status: Build Mode Active</p>
      </div>
    </main>
  )
}
