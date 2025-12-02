import React, { useState, useEffect, useRef } from 'react'
import useFlashcardStore from '@/stores/flashcardStore'
import { calculateBlendByAxes } from '@/utils/imageBlend'
import MouseController from './MouseController'
import GyroscopeController from './GyroscopeController'

interface CSSFlashcardProps {
  leftImageUrl: string
  rightImageUrl: string
}

/**
 * CSS 3D闪卡组件
 * 使用CSS 3D变换实现立体效果
 */
const CSSFlashcard: React.FC<CSSFlashcardProps> = ({ leftImageUrl, rightImageUrl }) => {
  const { rotation, isDragging, setIsDragging } = useFlashcardStore()
  const cardRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const thickness = 12
  const [isClient, setIsClient] = useState(false)
  
  // 确保在客户端渲染
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // 计算融合参数
  const blendParams = calculateBlendByAxes(rotation)
  const leftOpacityFinal = blendParams.leftOpacity
  const rightOpacityFinal = blendParams.rightOpacity

  useEffect(() => {
    const el = targetRef.current
    const updateSize = () => {
      if (el) setSize({ w: el.offsetWidth, h: el.offsetHeight })
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])
  
  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-center">
          <div className="animate-pulse">
            <div className="w-8 h-8 mx-auto mb-2 bg-white rounded-full opacity-30"></div>
            <p className="text-sm">加载中...</p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="relative w-full h-full">
      {/* 3D卡片容器 */}
      <div 
        ref={cardRef}
        data-flashcard-container
        className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ perspective: '1000px' }}
      >
        <div
          data-flashcard-target
          className="relative w-80 h-96 transition-transform duration-100 ease-out"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
            transformStyle: 'preserve-3d',
            willChange: 'transform'
          }}
          ref={targetRef}
        >
          {/* 前面：左右图层叠加 */}
          <div
            className="absolute inset-0 rounded-lg shadow-2xl"
            style={{
              backgroundImage: `url(${leftImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: leftOpacityFinal,
              backfaceVisibility: 'hidden',
              transform: `translateZ(${thickness / 2}px)`
            }}
          />
          <div
            className="absolute inset-0 rounded-lg shadow-2xl"
            style={{
              backgroundImage: `url(${rightImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: rightOpacityFinal,
              backfaceVisibility: 'hidden',
              transform: `translateZ(${thickness / 2}px)`
            }}
          />

          {/* 背面：左右图层叠加 */}
          <div
            className="absolute inset-0 rounded-lg shadow-2xl"
            style={{
              backgroundImage: `url(${leftImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: leftOpacityFinal,
              backfaceVisibility: 'hidden',
              transform: `rotateY(180deg) translateZ(${thickness / 2}px)`
            }}
          />
          <div
            className="absolute inset-0 rounded-lg shadow-2xl"
            style={{
              backgroundImage: `url(${rightImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: rightOpacityFinal,
              backfaceVisibility: 'hidden',
              transform: `rotateY(180deg) translateZ(${thickness / 2}px)`
            }}
          />

          <div
            className="absolute top-0 left-1/2 -translate-x-1/2"
            style={{
              width: `${thickness}px`,
              height: '100%',
              background: 'linear-gradient(180deg, #f5e3b1, #d4af37, #b8860b)',
              transform: `rotateY(90deg) translateZ(${size.w / 2}px)`,
              backfaceVisibility: 'hidden',
              borderRadius: '8px'
            }}
          />
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2"
            style={{
              width: `${thickness}px`,
              height: '100%',
              background: 'linear-gradient(180deg, #f5e3b1, #d4af37, #b8860b)',
              transform: `rotateY(90deg) translateZ(-${size.w / 2}px)`,
              backfaceVisibility: 'hidden',
              borderRadius: '8px'
            }}
          />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2"
            style={{
              width: '100%',
              height: `${thickness}px`,
              background: 'linear-gradient(90deg, #f5e3b1, #d4af37, #b8860b)',
              transform: `rotateX(90deg) translateZ(${size.h / 2}px)`,
              backfaceVisibility: 'hidden',
              borderRadius: '8px'
            }}
          />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2"
            style={{
              width: '100%',
              height: `${thickness}px`,
              background: 'linear-gradient(90deg, #f5e3b1, #d4af37, #b8860b)',
              transform: `rotateX(90deg) translateZ(-${size.h / 2}px)`,
              backfaceVisibility: 'hidden',
              borderRadius: '8px'
            }}
          />

          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              transform: `translateZ(${thickness / 2}px)`,
              border: '12px solid',
              borderImage: 'linear-gradient(135deg, #f5e3b1, #d4af37, #b8860b, #ffd700, #f5e3b1) 1',
              boxShadow: '0 0 16px rgba(212,175,55,0.6), inset 0 0 10px rgba(255,215,0,0.3)'
            }}
          />
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              transform: `rotateY(180deg) translateZ(${thickness / 2}px)`,
              border: '12px solid',
              borderImage: 'linear-gradient(135deg, #f5e3b1, #d4af37, #b8860b, #ffd700, #f5e3b1) 1',
              boxShadow: '0 0 16px rgba(212,175,55,0.6), inset 0 0 10px rgba(255,215,0,0.3)'
            }}
          />
          
        </div>
      </div>
      
      {/* 控制器 */}
      <MouseController />
      <GyroscopeController />
    </div>
  )
}

export default CSSFlashcard
