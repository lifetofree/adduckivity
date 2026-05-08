# 3D Protocol Builder (The Constellation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an immersive 3D utility for architecting and executing momentum protocols as interconnected constellations.

**Architecture:** A React Three Fiber (R3F) canvas for 3D visualization combined with a React-based side-panel for data entry. Protocols are stored as a graph (Nodes/Edges) in `localStorage`.

**Tech Stack:** Next.js (App Router), React Three Fiber (Three.js), Framer Motion, Tailwind CSS.

---

### Task 1: Data Store & Types

**Files:**
- Create: `apps/immersive/momentum-3d/src/lib/protocol-store.ts`
- Test: `apps/immersive/momentum-3d/src/__tests__/protocol.test.ts`

- [ ] **Step 1: Write types and storage functions**

```typescript
// apps/immersive/momentum-3d/src/lib/protocol-store.ts
export type NodeType = 'action' | 'tool' | 'timer';

export interface ProtocolNode {
  id: string;
  type: NodeType;
  label: string;
  position: [number, number, number];
  data: {
    duration?: number;
    toolId?: 'atomizer' | 'emergency';
    content?: string;
  };
}

export interface ProtocolEdge {
  id: string;
  source: string;
  target: string;
}

export interface ProtocolGraph {
  nodes: ProtocolNode[];
  edges: ProtocolEdge[];
}

export const STORAGE_KEY = 'duckos:protocol:graph';

export const saveProtocol = (graph: ProtocolGraph) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(graph));
};

export const loadProtocol = (): ProtocolGraph => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { nodes: [], edges: [] };
};
```

- [ ] **Step 2: Write tests for persistence**

```typescript
// apps/immersive/momentum-3d/src/__tests__/protocol.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { saveProtocol, loadProtocol, ProtocolGraph } from '../lib/protocol-store';

describe('Protocol Store', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should save and load a protocol graph', () => {
    const mockGraph: ProtocolGraph = {
      nodes: [{ id: '1', type: 'action', label: 'Test', position: [0, 0, 0], data: {} }],
      edges: []
    };
    saveProtocol(mockGraph);
    const loaded = loadProtocol();
    expect(loaded.nodes[0].label).toBe('Test');
  });
});
```

- [ ] **Step 3: Run tests**
Run: `npx vitest apps/immersive/momentum-3d/src/__tests__/protocol.test.ts`
Expected: PASS

- [x] **Step 4: Commit**
`git add apps/immersive/momentum-3d/src/lib/protocol-store.ts apps/immersive/momentum-3d/src/__tests__/protocol.test.ts && git commit -m "feat: protocol store and types"`

---

### Task 2: Basic 3D Scene & Node Rendering

**Files:**
- Create: `apps/immersive/momentum-3d/src/components/ProtocolBuilder/ProtocolScene.tsx`
- Create: `apps/immersive/momentum-3d/src/app/protocol-builder/page.tsx`

- [x] **Step 1: Implement the 3D Scene with R3F**

```tsx
// apps/immersive/momentum-3d/src/components/ProtocolBuilder/ProtocolScene.tsx
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
```

- [x] **Step 2: Create the entry page**

```tsx
// apps/immersive/momentum-3d/src/app/protocol-builder/page.tsx
'use client'
import { useState, useEffect } from 'react'
import ProtocolScene from '@/components/ProtocolBuilder/ProtocolScene'
import { loadProtocol, ProtocolNode } from '@/lib/protocol-store'

export default function ProtocolBuilderPage() {
  const [graph, setGraph] = useState({ nodes: [] as ProtocolNode[], edges: [] })

  useEffect(() => {
    const loaded = loadProtocol()
    if (loaded.nodes.length === 0) {
      // Seed initial node
      setGraph({
        nodes: [{ id: 'seed', type: 'action', label: 'Initial Seed', position: [0, 0, 0], data: {} }],
        edges: []
      })
    } else {
      setGraph(loaded)
    }
  }, [])

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <ProtocolScene nodes={graph.nodes} />
      <div className="absolute top-8 left-8 z-10">
        <h1 className="text-2xl font-bold tracking-tighter text-white uppercase">System Architect</h1>
        <p className="text-[10px] text-cyan-500 font-mono">Status: Build Mode Active</p>
      </div>
    </main>
  )
}
```

- [x] **Step 3: Commit**
`git commit -m "feat: basic 3d protocol scene and entry page"`

---

### Task 3: Edge Rendering (Links)

**Files:**
- Modify: `apps/immersive/momentum-3d/src/components/ProtocolBuilder/ProtocolScene.tsx`

- [x] **Step 1: Add Edge rendering to the scene**

```tsx
// Inside ProtocolScene.tsx
import { Line } from '@react-three/drei'
import { ProtocolEdge } from '@/lib/protocol-store'

const Connection = ({ start, end }: { start: [number, number, number], end: [number, number, number] }) => (
  <Line
    points={[start, end]}
    color="#00f3ff"
    lineWidth={1}
    transparent
    opacity={0.3}
  />
)

// Update ProtocolScene to accept edges
export default function ProtocolScene({ nodes, edges }: { nodes: ProtocolNode[], edges: ProtocolEdge[] }) {
  return (
    <div className="w-full h-screen bg-[#0a0f1e]">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        {/* ... existing scene setup ... */}
        {nodes.map(node => <Node key={node.id} node={node} />)}
        {edges.map(edge => {
          const source = nodes.find(n => n.id === edge.source);
          const target = nodes.find(n => n.id === edge.target);
          if (!source || !target) return null;
          return <Connection key={edge.id} start={source.position} end={target.position} />;
        })}
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 2: Update page.tsx to pass edges**
`git commit -m "feat: render 3d connections between nodes"`

---

### Task 4: Flow Mode (Camera Flight)

**Files:**
- Modify: `apps/immersive/momentum-3d/src/components/ProtocolBuilder/ProtocolScene.tsx`
- Modify: `apps/immersive/momentum-3d/src/app/protocol-builder/page.tsx`

- [ ] **Step 1: Implement Camera Controller for "Flow Mode"**

```tsx
// apps/immersive/momentum-3d/src/components/ProtocolBuilder/CameraController.tsx
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
```

- [ ] **Step 2: Add Mode Toggle and active node tracking in page.tsx**
`git commit -m "feat: camera flight system for flow mode"`

---

### Task 5: Tool Integration (Atomizer Node)

**Files:**
- Modify: `apps/immersive/momentum-3d/src/app/protocol-builder/page.tsx`

- [ ] **Step 1: Handle Tool Node activation**
When a node of type 'tool' with `toolId: 'atomizer'` is reached in Flow Mode, overlay the Atomizer component or redirect.

- [ ] **Step 2: Final testing and polish**
`git commit -m "feat: tool integration and final polish"`
