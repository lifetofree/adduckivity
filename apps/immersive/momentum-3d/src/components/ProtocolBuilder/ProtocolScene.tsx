'use client'
import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Line, Html } from '@react-three/drei'
import { ProtocolNode, ProtocolEdge } from '@/lib/protocol-store'
import CameraController from './CameraController'
import ForceGraphController from './ForceGraphController'
import { useIgnitionScene } from './useIgnitionScene'
import { useIgnitionStore } from '@/lib/ignition-store'

interface NodeProps {
  node: ProtocolNode;
  isActive?: boolean;
  onSelect: (id: string) => void;
  edges: ProtocolEdge[];
}

const Connection = ({ start, end }: { start: [number, number, number], end: [number, number, number] }) => (
  <Line
    points={[start, end]}
    color="#00f3ff"
    lineWidth={1}
    transparent
    opacity={0.3}
  />
)

const Node = ({ node, isActive = false, onSelect, edges }: NodeProps) => {
  const startIgnition = useIgnitionStore(state => state.start)
  
  const nodeColor = useMemo(() => {
    if (isActive) return '#00f3ff';
    if (node.type === 'ignition') return '#f43f5e';
    if (node.type === 'tool') return '#00f3ff';
    return '#ffffff';
  }, [isActive, node.type]);

  return (
    <mesh 
      position={node.position}
      onClick={(e) => {
        e.stopPropagation();
        if (node.type === 'ignition') {
          const firstTarget = edges.find(edge => edge.source === node.id)?.target;
          startIgnition(firstTarget);
        }
        onSelect(node.id);
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      <sphereGeometry args={[isActive ? 0.6 : 0.5, 32, 32]} />
      <meshStandardMaterial 
        color={nodeColor} 
        emissive={nodeColor}
        emissiveIntensity={isActive ? 2 : (node.type === 'ignition' ? 1.5 : 0.5)}
      />
      
      <Html 
        position={[0, 1.2, 0]} 
        center 
        distanceFactor={15}
        className="pointer-events-none select-none"
      >
        <div 
          className={`px-2 py-1 rounded border whitespace-nowrap transition-all duration-300 ${
            isActive 
              ? (node.type === 'ignition' ? 'bg-rose-500 text-white border-rose-400' : 'bg-cyan-500 text-black border-cyan-400') + ' font-bold scale-110 shadow-[0_0_15px_rgba(6,182,212,0.5)]' 
              : 'bg-black/60 text-white/70 border-white/10 backdrop-blur-sm'
          }`}
        >
          <p className="text-[10px] uppercase font-mono tracking-widest">{node.label}</p>
          {node.type === 'timer' && node.data?.duration && (
            <p className={`text-[8px] font-mono mt-0.5 opacity-50 ${isActive ? 'text-black' : 'text-cyan-500'}`}>
              {node.data.duration} MIN
            </p>
          )}
          {node.type === 'ignition' && (
            <p className={`text-[8px] font-mono mt-0.5 opacity-50 ${isActive ? 'text-white' : 'text-rose-500'}`}>
              600s BOOT
            </p>
          )}
        </div>
      </Html>
    </mesh>
  );
}

function SceneContent({ 
  nodes, 
  edges, 
  activeNode,
  onSelectNode,
  updateNodes,
  mode
}: { 
  nodes: ProtocolNode[], 
  edges: ProtocolEdge[],
  activeNode: ProtocolNode | null,
  onSelectNode: (id: string) => void,
  updateNodes: (nodes: ProtocolNode[]) => void,
  mode: 'build' | 'flow'
}) {
  const { colors, uniforms } = useIgnitionScene();
  const nodeMap = useMemo(() => new Map(nodes.map(node => [node.id, node.position])), [nodes]);

  return (
    <>
      <color attach="background" args={[colors?.bg || '#0a0f1e']} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={colors ? 0.8 + uniforms.pulseIntensity * 0.4 : 0.5} color={colors?.primary} />
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
        />
      ))}
      {edges.map(edge => {
        const start = nodeMap.get(edge.source);
        const end = nodeMap.get(edge.target);
        if (!start || !end) return null;
        return <Connection key={edge.id} start={start} end={end} />;
      })}
      <OrbitControls makeDefault enabled={!activeNode} />
    </>
  )
}

export default function ProtocolScene({ 
  nodes, 
  edges, 
  activeNode = null,
  onSelectNode,
  updateNodes,
  mode = 'build'
}: { 
  nodes: ProtocolNode[], 
  edges: ProtocolEdge[],
  activeNode?: ProtocolNode | null,
  onSelectNode: (id: string) => void,
  updateNodes: (nodes: ProtocolNode[]) => void,
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
      </Canvas>
    </div>
  )
}
