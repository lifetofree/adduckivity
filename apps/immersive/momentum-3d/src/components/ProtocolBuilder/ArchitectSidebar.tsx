'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Link as LinkIcon, Edit2, Settings2, Box, Clock, Zap, Flame } from 'lucide-react'
import { ProtocolNode, ProtocolEdge, NodeType } from '@/lib/protocol-store'
import { useState, useMemo } from 'react'
import { useIgnitionStore } from '@/lib/ignition-store'

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
  const activeNode = useMemo(() => nodes.find(n => n.id === activeNodeId), [nodes, activeNodeId])
  const [targetNodeId, setTargetNodeId] = useState<string>('')
  const { start: startIgnition } = useIgnitionStore()

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-14 h-[calc(100vh-3.5rem)] w-80 bg-black/40 backdrop-blur-xl border-l border-white/5 z-50 flex flex-col"
    >
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-cyan-500" />
          Node Architect
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Quick Ignition */}
        <section className="p-4 bg-gradient-to-br from-rose-500/10 to-orange-500/10 border border-rose-500/20 rounded-lg">
          <button 
            onClick={() => startIgnition(activeNodeId)}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-bold uppercase tracking-[0.2em] hover:from-rose-400 hover:to-orange-400 transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(244,63,94,0.3)]"
          >
            <Flame className="w-5 h-5" />
            Ignite Momentum
          </button>
          <p className="text-[9px] text-white/40 text-center mt-2 font-mono uppercase tracking-wider">
            600s Quick Launch Protocol
          </p>
        </section>

        {/* Node List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-widest">System Nodes</h3>
            <div className="flex gap-1">
              <button 
                onClick={() => onAddNode('action')}
                className="p-1.5 hover:bg-cyan-500/20 rounded transition-colors text-cyan-500 cursor-pointer"
                title="Add Action Node"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onAddNode('timer')}
                className="p-1.5 hover:bg-cyan-500/20 rounded transition-colors text-cyan-500 cursor-pointer"
                title="Add Timer Node"
              >
                <Clock className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onAddNode('tool', 'atomizer')}
                className="p-1.5 hover:bg-cyan-500/20 rounded transition-colors text-cyan-500 cursor-pointer"
                title="Add Atomizer Tool"
              >
                <Box className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            {nodes.length === 0 && (
              <p className="text-[10px] text-white/20 italic text-center py-4 border border-dashed border-white/5 rounded">No nodes in constellation</p>
            )}
            {nodes.map(node => (
              <button
                key={node.id}
                onClick={() => setActiveNodeId(activeNodeId === node.id ? null : node.id)}
                className={`w-full text-left p-3 rounded border transition-all cursor-pointer ${
                  activeNodeId === node.id 
                    ? 'bg-cyan-500/10 border-cyan-500/50 text-white shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                    : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium truncate">{node.label}</span>
                  <span className="text-[8px] font-mono uppercase px-1.5 py-0.5 rounded bg-black/50 opacity-30">
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
              className="space-y-6 pt-6 border-t border-white/5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">Edit Properties</h3>
                <button 
                  onClick={() => {
                    if (window.confirm(`Permanently delete node "${activeNode.label}"?`)) {
                      onDeleteNode(activeNode.id)
                    }
                  }}
                  className="p-2 -m-2 text-red-500/50 hover:text-red-500 transition-colors cursor-pointer group"
                  title="Delete Node"
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
                    className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase font-mono">Type</label>
                  <select 
                    value={activeNode.type}
                    onChange={(e) => {
                      const newType = e.target.value as NodeType;
                      const newData = { ...activeNode.data };
                      if (newType === 'timer' && !newData.duration) newData.duration = 25;
                      onUpdateNode(activeNode.id, { type: newType, data: newData });
                    }}
                    className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-colors cursor-pointer"
                  >
                    <option value="action">Action</option>
                    <option value="tool">Tool</option>
                    <option value="timer">Timer</option>
                  </select>
                </div>

                {activeNode.type === 'timer' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase font-mono">Duration (Minutes)</label>
                    <input 
                      type="number"
                      min="1"
                      max="120"
                      value={activeNode.data?.duration || 25}
                      onChange={(e) => onUpdateNode(activeNode.id, { 
                        data: { ...activeNode.data, duration: parseInt(e.target.value) || 1 } 
                      })}
                      className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                  </div>
                )}

                {activeNode.type === 'tool' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase font-mono">Tool ID</label>
                    <select 
                      value={activeNode.data?.toolId || ''}
                      onChange={(e) => onUpdateNode(activeNode.id, { 
                        data: { ...activeNode.data, toolId: e.target.value as 'atomizer' } 
                      })}
                      className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-colors cursor-pointer"
                    >
                      <option value="atomizer">Atomizer</option>
                    </select>
                  </div>
                )}

                <div className="pt-4 border-t border-white/5">
                  <h4 className="text-[10px] text-white/40 uppercase font-mono mb-3 flex items-center gap-2">
                    <LinkIcon className="w-3 h-3" />
                    Momentum Path
                  </h4>
                  
                  {/* Current Edges */}
                  <div className="space-y-1 mb-4">
                    {edges.filter(e => e.source === activeNode.id).length === 0 && (
                      <p className="text-[10px] text-white/20 italic">No outgoing connections</p>
                    )}
                    {edges.filter(e => e.source === activeNode.id).map(edge => (
                      <div key={edge.id} className="flex items-center justify-between bg-white/5 rounded px-2 py-1.5 group">
                        <span className="text-[10px] text-white/70">
                          → {nodes.find(n => n.id === edge.target)?.label || 'Unknown'}
                        </span>
                        <button 
                          onClick={() => onDeleteEdge(edge.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-500 transition-opacity cursor-pointer p-1"
                          title="Delete Connection"
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
                      className="flex-1 bg-black/40 border border-white/10 rounded p-2 text-[10px] text-white focus:outline-none focus:border-cyan-500/50 transition-colors cursor-pointer"
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
                      className="px-3 bg-cyan-500/20 border border-cyan-500/30 text-cyan-500 rounded disabled:opacity-30 disabled:border-white/10 disabled:text-white/30 cursor-pointer disabled:cursor-not-allowed transition-all"
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
              className="flex flex-col items-center justify-center h-40 text-center space-y-2 opacity-10"
            >
              <Edit2 className="w-8 h-8" />
              <p className="text-[10px] uppercase font-mono tracking-[0.2em]">Select node to edit</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
