'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Link as LinkIcon, Edit2, Settings2, Box } from 'lucide-react'
import { ProtocolNode, ProtocolEdge, NodeType } from '@/lib/protocol-store'
import { useState } from 'react'

interface ArchitectSidebarProps {
  nodes: ProtocolNode[];
  edges: ProtocolEdge[];
  activeNodeId: string | null;
  setActiveNodeId: (id: string | null) => void;
  onAddNode: (type: NodeType, toolId?: 'atomizer' | 'emergency') => void;
  onUpdateNode: (id: string, updates: Partial<ProtocolNode>) => void;
  onDeleteNode: (id: string) => void;
  onAddEdge: (source: string, target: string) => void;
  onDeleteEdge: (id: string) => void;
}

export default function ArchitectSidebar({
  nodes,
  edges,
  activeNodeId,
  setActiveNodeId,
  onAddNode,
  onUpdateNode,
  onDeleteNode,
  onAddEdge,
  onDeleteEdge,
}: ArchitectSidebarProps) {
  const activeNode = nodes.find(n => n.id === activeNodeId)
  const [targetNodeId, setTargetNodeId] = useState<string>('')

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-screen w-80 bg-black/80 backdrop-blur-xl border-l border-cyan-500/30 z-50 flex flex-col"
    >
      <div className="p-6 border-b border-cyan-500/20">
        <h2 className="text-lg font-bold text-white uppercase tracking-tighter flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-cyan-500" />
          Protocol Architect
        </h2>
        <p className="text-[10px] text-cyan-500/50 font-mono mt-1">DATA_MUTATOR_V1.0</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Node List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Nodes</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => onAddNode('action')}
                className="p-1 hover:bg-cyan-500/20 rounded transition-colors text-cyan-500 cursor-pointer"
                title="Add Action Node"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onAddNode('tool', 'atomizer')}
                className="p-1 hover:bg-cyan-500/20 rounded transition-colors text-cyan-500 cursor-pointer"
                title="Add Atomizer Tool"
              >
                <Box className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            {nodes.map(node => (
              <button
                key={node.id}
                onClick={() => setActiveNodeId(node.id)}
                className={`w-full text-left p-3 rounded border transition-all cursor-pointer ${
                  activeNodeId === node.id 
                    ? 'bg-cyan-500/20 border-cyan-500 text-white' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium truncate">{node.label}</span>
                  <span className="text-[8px] font-mono uppercase opacity-50 px-1.5 py-0.5 rounded bg-black/50">
                    {node.type}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Edit Section */}
        <AnimatePresence mode="wait">
          {activeNode ? (
            <motion.section
              key={activeNode.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 pt-6 border-t border-white/10"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">Edit Node</h3>
                <button 
                  onClick={() => {
                    if (confirm('Delete this node and all its connections?')) {
                      onDeleteNode(activeNode.id)
                    }
                  }}
                  className="text-red-500/50 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase font-mono">Label</label>
                  <input 
                    type="text"
                    value={activeNode.label}
                    onChange={(e) => onUpdateNode(activeNode.id, { label: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase font-mono">Type</label>
                  <select 
                    value={activeNode.type}
                    onChange={(e) => onUpdateNode(activeNode.id, { type: e.target.value as NodeType })}
                    className="w-full bg-black/50 border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                  >
                    <option value="action">Action</option>
                    <option value="tool">Tool</option>
                    <option value="timer">Timer</option>
                  </select>
                </div>

                {activeNode.type === 'tool' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase font-mono">Tool ID</label>
                    <select 
                      value={activeNode.data?.toolId || ''}
                      onChange={(e) => onUpdateNode(activeNode.id, { 
                        data: { ...activeNode.data, toolId: e.target.value as 'atomizer' | 'emergency' } 
                      })}
                      className="w-full bg-black/50 border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                    >
                      <option value="atomizer">Atomizer</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>
                )}

                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-[10px] text-white/40 uppercase font-mono mb-3 flex items-center gap-2">
                    <LinkIcon className="w-3 h-3" />
                    Connections
                  </h4>
                  
                  {/* Current Edges */}
                  <div className="space-y-1 mb-4">
                    {edges.filter(e => e.source === activeNode.id).map(edge => (
                      <div key={edge.id} className="flex items-center justify-between bg-white/5 rounded px-2 py-1.5 group">
                        <span className="text-[10px] text-white/70">
                          → {nodes.find(n => n.id === edge.target)?.label || 'Unknown'}
                        </span>
                        <button 
                          onClick={() => onDeleteEdge(edge.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-500 transition-opacity cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Edge */}
                  <div className="flex gap-2">
                    <select 
                      value={targetNodeId}
                      onChange={(e) => setTargetNodeId(e.target.value)}
                      className="flex-1 bg-black/50 border border-white/10 rounded p-2 text-[10px] text-white focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                    >
                      <option value="">Connect to...</option>
                      {nodes
                        .filter(n => n.id !== activeNode.id && !edges.some(e => e.source === activeNode.id && e.target === n.id))
                        .map(n => (
                          <option key={n.id} value={n.id}>{n.label}</option>
                        ))
                      }
                    </select>
                    <button 
                      onClick={() => {
                        if (targetNodeId) {
                          onAddEdge(activeNode.id, targetNodeId)
                          setTargetNodeId('')
                        }
                      }}
                      disabled={!targetNodeId}
                      className="px-3 bg-cyan-500/20 border border-cyan-500/50 text-cyan-500 rounded disabled:opacity-30 disabled:border-white/10 disabled:text-white/30 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-40 text-center space-y-2 opacity-20"
            >
              <Edit2 className="w-8 h-8" />
              <p className="text-[10px] uppercase font-mono">Select a node to architect</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="p-6 border-t border-white/10 bg-black/40">
        <div className="flex items-center justify-between text-[8px] font-mono text-white/30 uppercase tracking-[0.2em]">
          <span>System Status</span>
          <span className="text-cyan-500 animate-pulse">Syncing...</span>
        </div>
      </div>
    </motion.div>
  )
}
