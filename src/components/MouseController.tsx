import { useDrag } from '@use-gesture/react'
import React, { useEffect, useRef } from 'react'
import useFlashcardStore from '@/stores/flashcardStore'

const MouseController: React.FC = () => {
  const { rotation, setRotation, setIsDragging } = useFlashcardStore()
  const startRef = useRef({ x: 0, y: 0, z: 0 })
  const sensitivity = { x: 0.25, y: 0.25, z: 0.2 }

  const targetRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    targetRef.current = document.querySelector('[data-flashcard-container]') as HTMLElement | null
  }, [])

  useDrag(({ first, down, movement: [mx, my], event }) => {
    setIsDragging(down)
    if (first) startRef.current = { ...rotation }
    const shift = (event as MouseEvent)?.shiftKey ?? false
    const nextX = startRef.current.x + my * sensitivity.x
    const nextY = startRef.current.y - mx * sensitivity.y
    const nextZ = shift ? startRef.current.z - mx * sensitivity.z : rotation.z
    setRotation({ x: nextX, y: nextY, z: nextZ })
  }, {
    target: targetRef,
    pointer: { touch: true },
    eventOptions: { passive: false }
  })

  return null
}

export default MouseController
