'use client'
import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Line, Html } from '@react-three/drei'
import { ProtocolNode, ProtocolEdge } from '@/lib/protocol-store'
import CameraController from './CameraController'
import ForceGraphController from './ForceGraphController'
import { useIgnitionScene } from './useIgnitionScene'
import { useIgnitionStore } from '@/lib/ignition-store'

// ── Per-type config ──────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  action:   { color: '#00E5FF', abbrev: 'ACT'  },
  tool:     { color: '#a78bfa', abbrev: 'TOOL' },
  timer:    { color: '#f59e0b', abbrev: 'TMR'  },
  ignition: { color: '#f43f5e', abbrev: 'IGN'  },
} as const

function cfg(type: string) {
  return TYPE_CONFIG[type as keyof typeof TYPE_CONFIG] ?? TYPE_CONFIG.action
}

// ── Edge ────────────────────────────────────────────────────────────────────
const Connection = ({
  start, end, sourceType,
}: {
  start: [number, number, number]
  end: [number, number, number]
  sourceType?: string
}) => (
  <Line
    points={[start, end]}
    color={cfg(sourceType ?? 'action').color}
    lineWidth={1}
    transparent
    opacity={0.22}
  />
)

// ── Node ─────────────────────────────────────────────────────────────────────
interface NodeProps {
  node: ProtocolNode
  isActive?: boolean
  onSelect: (id: string | null) => void
  edges: ProtocolEdge[]
  hideLabel?: boolean
}

const Node = ({ node, isActive = false, onSelect, edges, hideLabel = false }: NodeProps) => {
  const startIgnition = useIgnitionStore(state => state.start)
  const { color, abbrev } = cfg(node.type)

  const handleClick = () => {
    if (isActive) { onSelect(null); return }
    if (node.type === 'ignition') {
      const firstTarget = edges.find(edge => edge.source === node.id)?.target
      startIgnition(firstTarget)
    }
    onSelect(node.id)
  }

  return (
    <group position={node.position}>
      {/* Circle node */}
      {!hideLabel && (
        <Html center distanceFactor={8} zIndexRange={isActive ? [30, 0] : [20, 0]}>
          <div
            onClick={handleClick}
            onMouseEnter={() => { document.body.style.cursor = 'pointer' }}
            onMouseLeave={() => { document.body.style.cursor = 'auto' }}
            style={{
              width: isActive ? 76 : 64,
              height: isActive ? 76 : 64,
              borderRadius: '50%',
              border: `2px solid ${color}`,
              backgroundColor: isActive ? `${color}20` : 'rgba(10,15,30,0.92)',
              boxShadow: isActive
                ? `0 0 22px ${color}60, 0 0 44px ${color}28, inset 0 0 14px ${color}18`
                : `0 0 10px ${color}40`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              userSelect: 'none',
            }}
          >
            {/* Type badge */}
            <span style={{
              fontFamily: 'ui-monospace, SFMono-Regular, monospace',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: isActive ? color : `${color}dd`,
              lineHeight: 1,
            }}>
              {abbrev}
            </span>
            {node.type === 'timer' && node.data?.duration && (
              <span style={{
                fontFamily: 'ui-monospace, monospace',
                fontSize: 9,
                color: `${color}99`,
                marginTop: 3,
                lineHeight: 1,
              }}>
                {node.data.duration}m
              </span>
            )}
          </div>
        </Html>
      )}

      {/* Node name below */}
      {!hideLabel && (
        <Html position={[0, -0.52, 0]} center distanceFactor={8} zIndexRange={[10, 0]}>
          <div style={{
            display: 'inline-block',
            backgroundColor: isActive ? `${color}22` : `${color}12`,
            border: `1px solid ${isActive ? color + '55' : color + '25'}`,
            borderRadius: 4,
            padding: '2px 7px',
            pointerEvents: 'none',
            userSelect: 'none',
          }}>
            <p style={{
              fontFamily: 'ui-monospace, SFMono-Regular, monospace',
              fontSize: 10,
              letterSpacing: '0.04em',
              color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.65)',
              whiteSpace: 'nowrap',
              margin: 0,
              fontWeight: isActive ? 600 : 400,
            }}>
              {node.label}
            </p>
          </div>
        </Html>
      )}
    </group>
  )
}

// ── Scene ────────────────────────────────────────────────────────────────────
function SceneContent({
  nodes, edges, activeNode, onSelectNode, updateNodes, mode,
}: {
  nodes: ProtocolNode[]
  edges: ProtocolEdge[]
  activeNode: ProtocolNode | null
  onSelectNode: (id: string | null) => void
  updateNodes: (nodes: ProtocolNode[]) => void
  mode: 'build' | 'flow'
}) {
  const { colors, uniforms } = useIgnitionScene()
  const ignitionActive = useIgnitionStore(state => state.isActive)
  const nodeMap = useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes])

  return (
    <>
      <color attach="background" args={[colors?.bg || '#0a0f1e']} />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0} />
      <ambientLight intensity={colors ? 0.8 + uniforms.pulseIntensity * 0.4 : 0.7} color={colors?.primary} />
      <pointLight position={[10, 10, 10]} intensity={colors ? 1.5 : 1} color={colors?.accent} />

      <CameraController activeNode={activeNode} />
      <ForceGraphController
        nodes={nodes}
        edges={edges}
        updateNodes={updateNodes}
        enabled={mode === 'build'}
      />

      {nodes.map(node => (
        <Node
          key={node.id}
          node={node}
          isActive={activeNode?.id === node.id}
          onSelect={onSelectNode}
          edges={edges}
          hideLabel={ignitionActive}
        />
      ))}

      {edges.map(edge => {
        const src = nodeMap.get(edge.source)
        const tgt = nodeMap.get(edge.target)
        if (!src || !tgt) return null
        return (
          <Connection
            key={edge.id}
            start={src.position}
            end={tgt.position}
            sourceType={src.type}
          />
        )
      })}

      <OrbitControls makeDefault enabled={!activeNode} />
    </>
  )
}

// ── Export ───────────────────────────────────────────────────────────────────
export default function ProtocolScene({
  nodes, edges, activeNode = null, onSelectNode, updateNodes, mode = 'build',
}: {
  nodes: ProtocolNode[]
  edges: ProtocolEdge[]
  activeNode?: ProtocolNode | null
  onSelectNode: (id: string | null) => void
  updateNodes: (nodes: ProtocolNode[]) => void
  mode?: 'build' | 'flow'
}) {
  return (
    <div className="w-full h-screen bg-[#0a0f1e]">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }} dpr={[1, 1.5]}>
        <SceneContent
          nodes={nodes}
          edges={edges}
          activeNode={activeNode}
          onSelectNode={onSelectNode}
          updateNodes={updateNodes}
          mode={mode}
        />
        {/* Background click plane — deselects active node */}
        {mode === 'build' && (
          <mesh onClick={(e) => {
            e.stopPropagation()
            if (activeNode) onSelectNode(null)
          }}>
            <planeGeometry args={[100, 100]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        )}
      </Canvas>
    </div>
  )
}
