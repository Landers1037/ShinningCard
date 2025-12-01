import React, { useEffect, useRef } from 'react'
import useFlashcardStore from '@/stores/flashcardStore'

/**
 * 鼠标控制器组件
 * 处理鼠标拖拽事件并更新卡片旋转状态
 */
const MouseController: React.FC = () => {
  const { rotation, setRotation, setIsDragging, isDragging } = useFlashcardStore()
  const lastMousePos = useRef({ x: 0, y: 0 })
  const pressTimer = useRef<number | null>(null)
  const longPressThreshold = 150
  const rafId = useRef<number | null>(null)
  const nextRotation = useRef<{ y: number } | null>(null)
  const startRotationY = useRef<number>(0)
  
  // 鼠标按下事件
  const handleMouseDown = (event: MouseEvent | TouchEvent) => {
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY
    lastMousePos.current = { x: clientX, y: clientY }
    startRotationY.current = rotation.y
    if (pressTimer.current) {
      window.clearTimeout(pressTimer.current)
      pressTimer.current = null
    }
    pressTimer.current = window.setTimeout(() => {
      setIsDragging(true)
    }, longPressThreshold)
  }
  
  // 鼠标移动事件
  const handleMouseMove = (event: MouseEvent | TouchEvent) => {
    if (!isDragging) return
    
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
    const deltaX = clientX - lastMousePos.current.x
    const targetY = Math.max(-60, Math.min(60, startRotationY.current - deltaX * 0.4))
    nextRotation.current = { y: targetY }
    if (rafId.current == null) {
      rafId.current = requestAnimationFrame(() => {
        if (nextRotation.current) {
          setRotation({ y: nextRotation.current.y })
          nextRotation.current = null
        }
        rafId.current = null
      })
    }
    
    lastMousePos.current = { x: clientX, y: clientY }
  }
  
  // 鼠标释放事件
  const handleMouseUp = () => {
    if (pressTimer.current) {
      window.clearTimeout(pressTimer.current)
      pressTimer.current = null
    }
    setIsDragging(false)
  }
  
  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])
  
  // 添加事件监听器
  useEffect(() => {
    const handleGlobalMouseMove = (event: MouseEvent | TouchEvent) => handleMouseMove(event)
    const handleGlobalMouseUp = () => handleMouseUp()
    const handleGlobalTouchEnd = () => handleMouseUp()
    
    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove as EventListener)
      document.addEventListener('mouseup', handleGlobalMouseUp)
      document.addEventListener('touchmove', handleGlobalMouseMove as EventListener)
      document.addEventListener('touchend', handleGlobalTouchEnd)
    }
    
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove as EventListener)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
      document.removeEventListener('touchmove', handleGlobalMouseMove as EventListener)
      document.removeEventListener('touchend', handleGlobalTouchEnd)
    }
  }, [isDragging])
  
  // 添加鼠标按下事件监听器
  useEffect(() => {
    const cardElement = document.querySelector('[data-flashcard-container]') as HTMLElement
    if (cardElement) {
      cardElement.addEventListener('mousedown', handleMouseDown as EventListener)
      cardElement.addEventListener('touchstart', handleMouseDown as EventListener, { passive: false })
      cardElement.style.cursor = 'grab'
      cardElement.style.touchAction = 'none'
      
      return () => {
        cardElement.removeEventListener('mousedown', handleMouseDown as EventListener)
        cardElement.removeEventListener('touchstart', handleMouseDown as EventListener)
      }
    }
  }, [])
  
  // 更新鼠标样式
  useEffect(() => {
    const cardElement = document.querySelector('[data-flashcard-container]') as HTMLElement
    if (cardElement) {
      cardElement.style.cursor = isDragging ? 'grabbing' : 'grab'
    }
  }, [isDragging])
  
  return null
}

export default MouseController
