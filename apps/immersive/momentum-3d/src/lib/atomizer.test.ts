import { describe, it, expect, beforeEach } from 'vitest'
import { saveAtomizerTask, loadAtomizerTask, STORAGE_KEY, AtomizerTask } from './atomizer'

describe('atomizer library', () => {
  beforeEach(() => {
    // Mock localStorage
    const mockStorage: { [key: string]: string } = {}
    global.localStorage = {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, value: string) => { mockStorage[key] = value },
      removeItem: (key: string) => { delete mockStorage[key] },
      clear: () => { for (const key in mockStorage) delete mockStorage[key] },
      length: 0,
      key: (index: number) => Object.keys(mockStorage)[index] || null,
    }
  })

  it('saves and loads a task', () => {
    const mockTask: AtomizerTask = {
      originalTask: 'Test Task',
      steps: [
        { id: '1', text: 'Step 1', completed: false }
      ],
      energyCheckCount: 0,
      createdAt: new Date().toISOString()
    }

    saveAtomizerTask(mockTask)
    const loadedTask = loadAtomizerTask()

    expect(loadedTask).toEqual(mockTask)
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(mockTask))
  })

  it('removes task when saving null', () => {
    const mockTask: AtomizerTask = {
      originalTask: 'Test Task',
      steps: [],
      energyCheckCount: 0,
      createdAt: new Date().toISOString()
    }

    saveAtomizerTask(mockTask)
    expect(loadAtomizerTask()).not.toBeNull()

    saveAtomizerTask(null)
    expect(loadAtomizerTask()).toBeNull()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('returns null if no task is saved', () => {
    expect(loadAtomizerTask()).toBeNull()
  })
})
