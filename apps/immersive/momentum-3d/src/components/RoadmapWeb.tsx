'use client'

import React, { useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Html, Sphere, Line } from '@react-three/drei'
import * as THREE from 'three'
import { ET } from '@/lib/theme'
import { Check, X } from 'lucide-react'

interface Task {
  id: string
  text: string
  completed: boolean
  filePath: string
}

interface Phase {
  title: string
  tasks: Task[]
}

interface RoadmapWebProps {
  isVisible: boolean
}

export default function RoadmapWeb({ isVisible }: RoadmapWebProps) {
  const [phases, setPhases] = useState<Phase[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isVisible) return
    setLoading(true)
    fetch('/api/roadmap')
      .then(res => res.json() as Promise<{ phases?: Phase[] }>)
      .then(data => {
        setPhases(data.phases || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch roadmap:', err)
        setLoading(false)
      })
  }, [isVisible])

  const toggleTask = async (task: Task) => {
    // Optimistic update — toggle just the matching task ID via a functional update.
    setPhases(prev => prev.map(p => ({
      ...p,
      tasks: p.tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t)
    })))

    try {
      const res = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: task.filePath,
          text: task.text,
          completed: !task.completed
        })
      })
      if (!res.ok) throw new Error('Failed to update')
    } catch (err) {
      console.error('Sync failed:', err)
      // Rollback only the specific task that failed, using the latest state (#51).
      setPhases(prev => prev.map(p => ({
        ...p,
        tasks: p.tasks.map(t => t.id === task.id ? { ...t, completed: task.completed } : t)
      })))
    }
  }

  if (!isVisible) return null

  return (
    <group>
      {loading && (
        <Html position={[0, 0, 0]} center>
          <div className="text-[10px] font-mono text-cyan-400 animate-pulse tracking-widest uppercase">
            Parsing Log...
          </div>
        </Html>
      )}

      {phases.map((phase, pIdx) => {
        // Calculate phase position in a circle around the center
        const pAngle = (pIdx / phases.length) * Math.PI * 2
        const pRadius = 6
        const pX = Math.cos(pAngle) * pRadius
        const pY = Math.sin(pAngle) * pRadius
        // Empty phases must NOT render as complete — guard against vacuous .every() (#50).
        const isPhaseDone = phase.tasks.length > 0 && phase.tasks.every(t => t.completed)

        return (
          <group key={pIdx} position={[pX, pY, -2]}>
            {/* Phase Node */}
            <mesh>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial
                color={isPhaseDone ? ET.accent : '#555'}
                emissive={isPhaseDone ? ET.accent : '#333'}
                emissiveIntensity={0.5}
              />
            </mesh>
            
            <Text
              position={[0, 0.6, 0]}
              fontSize={0.2}
              color="white"
              anchorX="center"
              maxWidth={2}
            >
              {phase.title.toUpperCase()}
            </Text>

            {/* Connection to center */}
            <Line 
              points={[[0, 0, 0], [-pX, -pY, 2]]} 
              color={ET.accent} 
              lineWidth={0.5} 
              transparent 
              opacity={0.2} 
            />

            {/* Tasks */}
            {phase.tasks.map((task, tIdx) => {
              // Arrange tasks in a small arc around the phase
              const tAngle = ((tIdx / phase.tasks.length) - 0.5) * 1.5
              const tRadius = 1.5
              const tX = Math.cos(tAngle) * tRadius
              const tY = Math.sin(tAngle) * tRadius

              return (
                <group key={tIdx} position={[tX, tY, 0]}>
                  <mesh onClick={() => toggleTask(task)}>
                    <sphereGeometry args={[0.12, 12, 12]} />
                    <meshStandardMaterial 
                      color={task.completed ? ET.accent : '#ff4444'} 
                      emissive={task.completed ? ET.accent : '#ff4444'}
                      emissiveIntensity={0.5}
                    />
                  </mesh>

                  <Html distanceFactor={8} position={[0.2, 0, 0]}>
                    <button 
                      onClick={() => toggleTask(task)}
                      className={`group flex items-center gap-2 px-2 py-1 rounded-md border transition-all hover:scale-105 whitespace-nowrap ${
                        task.completed 
                          ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' 
                          : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}
                    >
                      {task.completed ? <Check className="w-2 h-2" /> : <X className="w-2 h-2" />}
                      <span className="text-[8px] font-bold uppercase tracking-widest leading-none">
                        {task.text}
                      </span>
                    </button>
                  </Html>

                  <Line 
                    points={[[0, 0, 0], [-tX, -tY, 0]]} 
                    color={task.completed ? ET.accent : '#ff4444'} 
                    lineWidth={0.5} 
                    transparent 
                    opacity={0.3} 
                  />
                </group>
              )
            })}
          </group>
        )
      })}
    </group>
  )
}
