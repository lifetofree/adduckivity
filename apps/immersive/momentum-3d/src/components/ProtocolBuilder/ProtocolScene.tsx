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
      {/* Circle node — full Html so clicks work anywhere inside the circle */}
      {!hideLabel && (
        <Html center distanceFactor={8} zIndexRange={isActive ? [30, 0] : [20, 0]}>
          <div
            onClick={handleClick}
            onMouseEnter={() => { document.body.style.cursor = 'pointer' }}
            onMouseLeave={() => { document.body.style.cursor = 'auto' }}
            style={{
              width: isActive ? 70 : 58,
              height: isActive ? 70 : 58,
              borderRadius: '50%',
              border: `2px solid ${color}`,
              backgroundColor: isActive ? `${color}18` : 'rgba(10,15,30,0.9)',
              boxShadow: isActive
                ? `0 0 20px ${color}55, 0 0 40px ${color}25, inset 0 0 12px ${color}15`
                : `0 0 8px ${color}35`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(6px)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              userSelect: 'none',
            }}
          >
            <span style={{
              fontFamily: 'ui-monospace, SFMono-Regular, monospace',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: isActive ? color : `${color}cc`,
              lineHeight: 1,
            }}>
              {abbrev}
            </span>
            {node.type === 'timer' && node.data?.duration && (
              <span style={{
                fontFamily: 'ui-monospace, monospace',
                fontSize: 7,
                color: `${color}80`,
                marginTop: 2,
              }}>
                {node.data.duration}M
              </span>
            )}
          </div>
        </Html>
      )}

      {/* Node name below the circle */}
      {!hideLabel && (
        <Html position={[0, -1.0, 0]} center distanceFactor={8} zIndexRange={[10, 0]}>
          <p style={{
            fontFamily: 'ui-monospace, SFMono-Regular, monospace',
            fontSize: 8,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: isActive ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            userSelect: 'none',
            margin: 0,
          }}>
            {node.label}
          </p>
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
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
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
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
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
            if (activeNode) onSelectNode('')
          }}>
            <planeGeometry args={[100, 100]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        )}
      </Canvas>
    </div>
  )
}
