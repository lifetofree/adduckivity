export interface AtomicStep {
  id: string;
  text: string;
  completed: boolean;
}

export interface AtomizerTask {
  originalTask: string;
  steps: AtomicStep[];
  energyCheckCount: number;
  createdAt: string;
}

export const STORAGE_KEY = 'duckos:atomizer:active_task';

export function saveAtomizerTask(task: AtomizerTask | null) {
  if (typeof window === 'undefined') return;
  if (!task) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(task));
  }
}

export function loadAtomizerTask(): AtomizerTask | null {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
}
