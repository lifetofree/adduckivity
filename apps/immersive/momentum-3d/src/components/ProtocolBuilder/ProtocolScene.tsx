'use client'
import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Line } from '@react-three/drei'
import { ProtocolNode, ProtocolEdge } from '@/lib/protocol-store'
import CameraController from './CameraController'
import ForceGraphController from './ForceGraphController'

interface NodeProps {
  node: ProtocolNode;
  isActive?: boolean;
  onSelect: (id: string) => void;
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

const Node = ({ node, isActive = false, onSelect }: NodeProps) => (
  <mesh 
    position={node.position}
    onClick={(e) => {
      e.stopPropagation();
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
      color={isActive ? '#00f3ff' : (node.type === 'tool' ? '#00f3ff' : '#ffffff')} 
      emissive={isActive ? '#00f3ff' : (node.type === 'tool' ? '#00f3ff' : '#000000')}
      emissiveIntensity={isActive ? 2 : 0.5}
    />
  </mesh>
)

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
  const nodeMap = useMemo(() => new Map(nodes.map(node => [node.id, node.position])), [nodes]);

  return (
    <div className="w-full h-screen bg-[#0a0f1e]">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <color attach="background" args={['#0a0f1e']} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
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
          />
        ))}
        {edges.map(edge => {
          const start = nodeMap.get(edge.source);
          const end = nodeMap.get(edge.target);
          if (!start || !end) return null;
          return <Connection key={edge.id} start={start} end={end} />;
        })}
        <OrbitControls makeDefault enabled={!activeNode} />
      </Canvas>
    </div>
  )
}
