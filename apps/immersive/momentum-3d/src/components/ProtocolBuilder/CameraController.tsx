'use client'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { ProtocolNode } from '@/lib/protocol-store'

export default function CameraController({ activeNode }: { activeNode: ProtocolNode | null }) {
  useFrame((state) => {
    if (activeNode) {
      const targetPos = new Vector3(...activeNode.position).add(new Vector3(0, 0, 5))
      state.camera.position.lerp(targetPos, 0.05)
      state.camera.lookAt(...activeNode.position)
    }
  })
  return null
}
