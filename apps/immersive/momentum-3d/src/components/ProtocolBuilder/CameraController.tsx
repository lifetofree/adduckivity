'use client'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { ProtocolNode } from '@/lib/protocol-store'

const _targetPos = new Vector3()
const _offset = new Vector3(0, 0, 5)
const _lookAtPos = new Vector3()

export default function CameraController({ activeNode }: { activeNode: ProtocolNode | null }) {
  useFrame((state) => {
    if (activeNode) {
      const [x, y, z] = activeNode.position
      _targetPos.set(x, y, z).add(_offset)
      _lookAtPos.set(x, y, z)
      
      state.camera.position.lerp(_targetPos, 0.05)
      state.camera.lookAt(_lookAtPos)
    }
  })
  return null
}
