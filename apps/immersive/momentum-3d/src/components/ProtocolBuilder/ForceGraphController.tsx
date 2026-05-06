'use client'

import { useFrame } from '@react-three/fiber'
import { useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { ProtocolNode, ProtocolEdge } from '@/lib/protocol-store'

interface ForceGraphControllerProps {
  nodes: ProtocolNode[];
  edges: ProtocolEdge[];
  updateNodes: (nodes: ProtocolNode[]) => void;
  enabled?: boolean;
}

/**
 * A simple force-directed layout engine for the Protocol Builder.
 * Calculates repulsion, spring, and gravity forces to auto-arrange nodes.
 */
export default function ForceGraphController({
  nodes,
  edges,
  updateNodes,
  enabled = true,
}: ForceGraphControllerProps) {
  // Use a map to store the physical state of each node (position and velocity)
  // Re-memoize only if the set of node IDs changes
  const nodeIdsKey = nodes.map(n => n.id).join(',')
  const nodeStates = useMemo(() => {
    const states = new Map<string, { pos: THREE.Vector3, vel: THREE.Vector3 }>();
    nodes.forEach(node => {
      states.set(node.id, {
        pos: new THREE.Vector3(...node.position),
        vel: new THREE.Vector3(0, 0, 0)
      });
    });
    return states;
  }, [nodeIdsKey]);

  // Sync internal positions if nodes are moved externally (e.g. on initial load or manual edit)
  useEffect(() => {
    nodes.forEach(node => {
      const state = nodeStates.get(node.id);
      if (state) {
        const currentPos = new THREE.Vector3(...node.position);
        // Only sync if the difference is significant to avoid fighting the simulation
        if (state.pos.distanceTo(currentPos) > 0.1) {
          state.pos.copy(currentPos);
          state.vel.set(0, 0, 0); // Reset velocity on manual move
        }
      }
    });
  }, [nodes, nodeStates]);

  // Physics constants
  const REPULSION = 25.0;     // Push nodes apart
  const SPRING_LENGTH = 3.0;   // Desired distance between connected nodes
  const SPRING_STRENGTH = 0.8; // Pull/push strength for connections
  const GRAVITY = 0.4;         // Pull towards center (0,0,0)
  const DAMPING = 0.92;        // Friction to eventually stop movement
  const MAX_VELOCITY = 0.5;    // Prevent explosive movement

  // Reusable vectors for calculations to avoid GC pressure
  const _diff = useMemo(() => new THREE.Vector3(), []);
  const _forceVec = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    if (!enabled || nodes.length === 0) return;

    // Limit delta to prevent physics glitches on low frame rates
    const dt = Math.min(delta, 0.05);

    // 1. Repulsion Forces (Node-Node collision avoidance)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const idA = nodes[i].id;
        const idB = nodes[j].id;
        const stateA = nodeStates.get(idA)!;
        const stateB = nodeStates.get(idB)!;
        
        _diff.subVectors(stateA.pos, stateB.pos);
        const distSq = _diff.lengthSq();
        
        // Add a small offset if they are exactly overlapping
        if (distSq < 0.01) {
          _diff.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
        }
        
        const force = REPULSION / (distSq + 1.0);
        _forceVec.copy(_diff).normalize().multiplyScalar(force * dt);
        
        stateA.vel.add(_forceVec);
        stateB.vel.sub(_forceVec);
      }
    }

    // 2. Spring Forces (Attraction between connected nodes)
    edges.forEach(edge => {
      const stateA = nodeStates.get(edge.source);
      const stateB = nodeStates.get(edge.target);
      if (!stateA || !stateB) return;

      _diff.subVectors(stateB.pos, stateA.pos);
      const dist = _diff.length();
      if (dist < 0.01) return;
      
      const force = (dist - SPRING_LENGTH) * SPRING_STRENGTH;
      _forceVec.copy(_diff).normalize().multiplyScalar(force * dt);
      
      stateA.vel.add(_forceVec);
      stateB.vel.sub(_forceVec);
    });

    // 3. Central Gravity (Keep the whole graph centered)
    nodeStates.forEach((state) => {
      _forceVec.copy(state.pos).multiplyScalar(-GRAVITY * dt);
      state.vel.add(_forceVec);
    });

    // 4. Update positions and check for significant movement
    let totalMovement = 0;
    const nextNodes: ProtocolNode[] = [];

    nodes.forEach(node => {
      const state = nodeStates.get(node.id)!;
      
      // Apply damping (friction)
      state.vel.multiplyScalar(DAMPING);
      
      // Cap velocity for stability
      if (state.vel.length() > MAX_VELOCITY) {
        state.vel.normalize().multiplyScalar(MAX_VELOCITY);
      }

      // Update position
      if (state.vel.length() > 0.005) {
        state.pos.add(state.vel);
        totalMovement += state.vel.length();
      }

      nextNodes.push({
        ...node,
        position: [state.pos.x, state.pos.y, state.pos.z]
      });
    });

    // Only update React state if there was meaningful movement
    if (totalMovement > 0.01) {
      updateNodes(nextNodes);
    }
  });

  return null;
}
