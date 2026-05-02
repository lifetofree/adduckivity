export type NodeType = 'action' | 'tool' | 'timer' | 'ignition';

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

/**
 * Saves the protocol graph to localStorage
 */
export const saveProtocol = (graph: ProtocolGraph): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(graph));
  }
};

/**
 * Loads the protocol graph from localStorage.
 * Returns an empty graph if nothing is stored.
 */
export const loadProtocol = (): ProtocolGraph => {
  if (typeof window === 'undefined') return { nodes: [], edges: [] };

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return { nodes: [], edges: [] };

  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse protocol from localStorage:', e);
    return { nodes: [], edges: [] };
  }
};
