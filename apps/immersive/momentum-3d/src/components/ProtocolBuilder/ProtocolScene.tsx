'use client'
import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Line } from '@react-three/drei'
import { ProtocolNode, ProtocolEdge } from '@/lib/protocol-store'
import CameraController from './CameraController'

interface NodeProps {
  node: ProtocolNode;
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

const Node = ({ node, isActive = false }: NodeProps & { isActive?: boolean }) => (
  <mesh position={node.position}>
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
  activeNode = null 
}: { 
  nodes: ProtocolNode[], 
  edges: ProtocolEdge[],
  activeNode?: ProtocolNode | null
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
        {nodes.map(node => (
          <Node 
            key={node.id} 
            node={node} 
            isActive={activeNode?.id === node.id} 
          />
        ))}
        {edges.map(edge => {
          const start = nodeMap.get(edge.source);
          const end = nodeMap.get(edge.target);
          if (!start || !end) return null;
          return <Connection key={edge.id} start={start} end={end} />;
        })}
        <OrbitControls makeDefault disabled={!!activeNode} />
      </Canvas>
    </div>
  )
}
