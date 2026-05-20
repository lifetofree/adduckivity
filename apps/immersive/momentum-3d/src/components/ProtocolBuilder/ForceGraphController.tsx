'use client'

import { useFrame } from '@react-three/fiber'
import { useMemo, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { ProtocolNode, ProtocolEdge } from '@/lib/protocol-store'

interface ForceGraphControllerProps {
  nodes: ProtocolNode[];
  edges: ProtocolEdge[];
  updateNodes: (nodes: ProtocolNode[]) => void;
  enabled?: boolean;
}

// Physics constants — module-level to avoid re-evaluation per render
const REPULSION = 25.0
const SPRING_LENGTH = 3.0
const SPRING_STRENGTH = 0.8
const GRAVITY = 0.4
const DAMPING = 0.92
const MAX_VELOCITY = 0.5
const SETTLE_THRESHOLD = 0.01  // total movement below this → pause simulation
const MOVE_THRESHOLD = 0.005   // per-node velocity below this → skip position update

// Module-level temp vectors — zero allocation in hot paths
const _syncTemp = new THREE.Vector3()
const _diff = new THREE.Vector3()
const _forceVec = new THREE.Vector3()

export default function ForceGraphController({
  nodes,
  edges,
  updateNodes,
  enabled = true,
}: ForceGraphControllerProps) {
  // Re-memoize only when the set of node IDs changes
  const nodeIdsKey = nodes.map(n => n.id).join(',')
  const nodeStates = useMemo(() => {
    const states = new Map<string, { pos: THREE.Vector3, vel: THREE.Vector3 }>()
    nodes.forEach(node => {
      states.set(node.id, {
        pos: new THREE.Vector3(...node.position),
        vel: new THREE.Vector3(0, 0, 0),
      })
    })
    return states
  }, [nodeIdsKey]) // eslint-disable-line react-hooks/exhaustive-deps

  // Wake the simulation when the node set changes
  const isSettled = useRef(false)
  useEffect(() => { isSettled.current = false }, [nodeIdsKey])

  // Sync positions when nodes are moved externally (load / manual edit)
  useEffect(() => {
    nodes.forEach(node => {
      const state = nodeStates.get(node.id)
      if (!state) return
      _syncTemp.set(...node.position)
      if (state.pos.distanceTo(_syncTemp) > 0.1) {
        state.pos.copy(_syncTemp)
        state.vel.set(0, 0, 0)
        isSettled.current = false
      }
    })
  }, [nodes, nodeStates])

  useFrame((_, delta) => {
    if (!enabled || nodes.length === 0 || isSettled.current) return

    const dt = Math.min(delta, 0.05)

    // 1. Repulsion (O(n²) — acceptable for small protocol graphs)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const stateA = nodeStates.get(nodes[i].id)!
        const stateB = nodeStates.get(nodes[j].id)!

        _diff.subVectors(stateA.pos, stateB.pos)
        const distSq = _diff.lengthSq()

        if (distSq < 0.01) {
          _diff.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        }

        const force = REPULSION / (distSq + 1.0)
        _forceVec.copy(_diff).normalize().multiplyScalar(force * dt)

        stateA.vel.add(_forceVec)
        stateB.vel.sub(_forceVec)
      }
    }

    // 2. Spring forces along edges
    edges.forEach(edge => {
      const stateA = nodeStates.get(edge.source)
      const stateB = nodeStates.get(edge.target)
      if (!stateA || !stateB) return

      _diff.subVectors(stateB.pos, stateA.pos)
      const dist = _diff.length()
      if (dist < 0.01) return

      const force = (dist - SPRING_LENGTH) * SPRING_STRENGTH
      _forceVec.copy(_diff).normalize().multiplyScalar(force * dt)

      stateA.vel.add(_forceVec)
      stateB.vel.sub(_forceVec)
    })

    // 3. Gravity toward origin
    nodeStates.forEach(state => {
      _forceVec.copy(state.pos).multiplyScalar(-GRAVITY * dt)
      state.vel.add(_forceVec)
    })

    // 4. Integrate — only build nextNodes array when movement is meaningful
    let totalMovement = 0
    nodes.forEach(node => {
      const state = nodeStates.get(node.id)!
      state.vel.multiplyScalar(DAMPING)
      if (state.vel.length() > MAX_VELOCITY) state.vel.normalize().multiplyScalar(MAX_VELOCITY)
      if (state.vel.length() > MOVE_THRESHOLD) {
        state.pos.add(state.vel)
        totalMovement += state.vel.length()
      }
    })

    if (totalMovement < SETTLE_THRESHOLD) {
      isSettled.current = true
      return
    }

    const nextNodes: ProtocolNode[] = nodes.map(node => {
      const { pos } = nodeStates.get(node.id)!
      return { ...node, position: [pos.x, pos.y, pos.z] as [number, number, number] }
    })
    updateNodes(nextNodes)
  })

  return null
}
