'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { ProtocolNode } from '@/lib/protocol-store'

interface NodeProps {
  node: ProtocolNode;
}

const Node = ({ node }: NodeProps) => (
  <mesh position={node.position}>
    <sphereGeometry args={[0.5, 32, 32]} />
    <meshStandardMaterial 
      color={node.type === 'tool' ? '#00f3ff' : '#ffffff'} 
      emissive={node.type === 'tool' ? '#00f3ff' : '#000000'}
      emissiveIntensity={0.5}
    />
  </mesh>
)

export default function ProtocolScene({ nodes }: { nodes: ProtocolNode[] }) {
  return (
    <div className="w-full h-screen bg-[#0a0f1e]">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <color attach="background" args={['#0a0f1e']} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {nodes.map(node => <Node key={node.id} node={node} />)}
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  )
}
