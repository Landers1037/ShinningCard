import React, { useState, useEffect, useRef } from 'react'
import useFlashcardStore from '@/stores/flashcardStore'
import { calculateImageBlend } from '@/utils/imageBlend'
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
  const [isClient, setIsClient] = useState(false)
  
  // 确保在客户端渲染
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // 计算融合参数
  const blendParams = calculateImageBlend(rotation.y)
  
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
        >
          {/* 左侧图片 */}
          <div
            className="absolute inset-0 rounded-lg shadow-2xl"
            style={{
              backgroundImage: `url(${leftImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: blendParams.leftOpacity,
              backfaceVisibility: 'hidden'
            }}
          />
          
          {/* 右侧图片 */}
          <div
            className="absolute inset-0 rounded-lg shadow-2xl"
            style={{
              backgroundImage: `url(${rightImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: blendParams.rightOpacity,
              backfaceVisibility: 'hidden'
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
