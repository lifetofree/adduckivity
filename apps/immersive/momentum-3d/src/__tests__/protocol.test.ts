import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveProtocol, loadProtocol, STORAGE_KEY } from '../lib/protocol-store';
import type { ProtocolGraph } from '../lib/protocol-store';

describe('Protocol Store', () => {
  beforeEach(() => {
    // Mock localStorage
    const mockStorage: { [key: string]: string } = {};
    global.localStorage = {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, value: string) => { mockStorage[key] = value },
      removeItem: (key: string) => { delete mockStorage[key] },
      clear: () => { for (const key in mockStorage) delete mockStorage[key] },
      length: 0,
      key: (index: number) => Object.keys(mockStorage)[index] || null,
    };
    vi.clearAllMocks();
  });

  it('should return an empty graph if no protocol is saved', () => {
    const protocol = loadProtocol();
    expect(protocol).toEqual({ nodes: [], edges: [] });
  });

  it('should save and load a protocol graph', () => {
    const mockGraph: ProtocolGraph = {
      nodes: [
        {
          id: '1',
          type: 'action',
          label: 'Test Action',
          position: [0, 0, 0],
          data: { content: 'Test Content' }
        }
      ],
      edges: [
        {
          id: 'e1',
          source: '1',
          target: '2'
        }
      ]
    };

    saveProtocol(mockGraph);
    const loadedGraph = loadProtocol();
    expect(loadedGraph).toEqual(mockGraph);
  });

  it('should persist data in localStorage', () => {
    const mockGraph: ProtocolGraph = {
      nodes: [],
      edges: []
    };

    saveProtocol(mockGraph);
    const storedValue = localStorage.getItem(STORAGE_KEY);
    expect(storedValue).toBe(JSON.stringify(mockGraph));
  });

  it('should handle invalid JSON in localStorage gracefully', () => {
    localStorage.setItem(STORAGE_KEY, '{ invalid json');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const loadedGraph = loadProtocol();
    
    expect(loadedGraph).toEqual({ nodes: [], edges: [] });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
