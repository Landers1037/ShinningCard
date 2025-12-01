import React, { useState, useEffect } from 'react'
import useFlashcardStore from '@/stores/flashcardStore'
import { calculateImageBlend } from '@/utils/imageBlend'

interface FallbackFlashcardProps {
  leftImageUrl: string
  rightImageUrl: string
}

/**
 * CSS 3D变换降级组件
 * 当WebGL不支持时使用CSS 3D变换实现类似效果
 */
const FallbackFlashcard: React.FC<FallbackFlashcardProps> = ({ leftImageUrl, rightImageUrl }) => {
  const { rotation, setRotation, resetRotation, isDragging, setIsDragging } = useFlashcardStore()
  const [isClient, setIsClient] = useState(false)
  
  // 确保在客户端渲染
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // 触摸事件处理
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }
  
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    if (!isDragging) return
    
    const touch = e.touches[0]
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = (touch.clientX - centerX) / (rect.width / 2)
    const deltaY = (touch.clientY - centerY) / (rect.height / 2)
    
    const rotationY = Math.max(-90, Math.min(90, deltaX * 90))
    const rotationX = Math.max(-45, Math.min(45, -deltaY * 45))
    
    setRotation({ x: rotationX, y: rotationY, z: 0 })
  }
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }
  
  // 鼠标事件处理
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }
  
  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isDragging) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = (e.clientX - centerX) / (rect.width / 2)
    const deltaY = (e.clientY - centerY) / (rect.height / 2)
    
    const rotationY = Math.max(-90, Math.min(90, deltaX * 90))
    const rotationX = Math.max(-45, Math.min(45, -deltaY * 45))
    
    setRotation({ x: rotationX, y: rotationY, z: 0 })
  }
  
  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }
  
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
    <div className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700/20 via-transparent to-transparent"></div>
      
      {/* CSS 3D卡片 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative w-80 h-96 cursor-grab active:cursor-grabbing select-none"
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="w-full h-full relative transition-transform duration-100 ease-out"
            style={{
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
              transformStyle: 'preserve-3d'
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
      </div>
      
      {/* 控制面板 */}
      <div className="absolute top-16 right-4 bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-3 text-white text-xs max-w-[200px]">
        <div className="mb-2">
          <div className="text-xs text-gray-300 mb-1">旋转角度</div>
          <div className="grid grid-cols-3 gap-1 text-xs">
            <div className="text-center">
              <div className="text-gray-400">X</div>
              <div>{Math.round(rotation.x)}°</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Y</div>
              <div>{Math.round(rotation.y)}°</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Z</div>
              <div>{Math.round(rotation.z)}°</div>
            </div>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="text-xs text-gray-300 mb-1">融合状态</div>
          <div className={`text-xs px-2 py-1 rounded ${
            blendParams.isBlending 
              ? 'bg-yellow-600 bg-opacity-50 text-yellow-200' 
              : 'bg-gray-600 bg-opacity-50 text-gray-300'
          }`}>
            {blendParams.isBlending ? '融合中' : '单图显示'}
          </div>
        </div>
        
        <button
          onClick={resetRotation}
          className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition-colors w-full justify-center"
        >
          <span>重置角度</span>
        </button>
      </div>
      
      {/* 操作提示 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <div className="bg-black bg-opacity-70 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm max-w-xs mx-4">
          <p className="mb-1 font-medium text-yellow-400">WebGL不支持</p>
          <p className="text-gray-300 text-xs mb-1">使用CSS 3D变换降级方案</p>
          <p className="text-gray-400 text-xs">拖拽或触摸控制角度</p>
        </div>
      </div>
    </div>
  )
}

export default FallbackFlashcard
