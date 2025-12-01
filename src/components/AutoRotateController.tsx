import React, { useEffect, useRef } from 'react'
import useFlashcardStore from '@/stores/flashcardStore'

const AutoRotateController: React.FC = () => {
  const { rotation, setRotation, isDragging, autoRotate } = useFlashcardStore()
  const rafId = useRef<number | null>(null)
  const dirRef = useRef(1)
  const yRef = useRef(0)

  useEffect(() => {
    const step = () => {
      if (!autoRotate || isDragging) { rafId.current = null; return }
      let y = yRef.current + dirRef.current * 0.25
      if (y >= 60) { y = 60; dirRef.current = -1 }
      if (y <= -60) { y = -60; dirRef.current = 1 }
      yRef.current = y
      setRotation({ y })
      rafId.current = requestAnimationFrame(step)
    }
    yRef.current = rotation.y
    if (autoRotate && !isDragging && rafId.current == null) rafId.current = requestAnimationFrame(step)
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); rafId.current = null }
  }, [autoRotate, isDragging, setRotation, rotation.y])

  return null
}

export default AutoRotateController
