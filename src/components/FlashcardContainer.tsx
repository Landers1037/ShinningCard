import React, { useState, useEffect } from 'react'
import CSSFlashcard from './CSSFlashcard'
import ControlPanel from './ControlPanel'
import leftImg from '@/assets/1.jpg'
import rightImg from '@/assets/3.jpg'

const DEFAULT_IMAGES = {
  left: leftImg,
  right: rightImg
}

interface FlashcardContainerProps {
  leftImageUrl?: string
  rightImageUrl?: string
}

/**
 * 闪卡容器组件
 * 管理整个闪卡应用的状态和布局
 */
const FlashcardContainer: React.FC<FlashcardContainerProps> = ({
  leftImageUrl = DEFAULT_IMAGES.left,
  rightImageUrl = DEFAULT_IMAGES.right
}) => {
  const [isMobile, setIsMobile] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  // 检测设备类型
  useEffect(() => {
    const initializeApp = async () => {
      // 检测设备类型
      const checkDevice = () => {
        const userAgent = navigator.userAgent.toLowerCase()
        const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod']
        const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword))
        setIsMobile(isMobileDevice)
      }

      checkDevice()
      window.addEventListener('resize', checkDevice)
      
      // 模拟加载时间，确保组件正确初始化
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
      
      return () => {
        window.removeEventListener('resize', checkDevice)
      }
    }

    initializeApp()
  }, [])

  // 自动隐藏操作提示
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowInstructions(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700/20 via-transparent to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-white text-center">
            <div className="animate-pulse">
              <div className="w-12 h-12 mx-auto mb-4 bg-white rounded-full opacity-30"></div>
              <p className="text-lg font-medium">立体闪卡</p>
              <p className="text-sm text-gray-400">加载中...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700/20 via-transparent to-transparent"></div>
      
      {/* CSS 3D闪卡 */}
      <CSSFlashcard leftImageUrl={leftImageUrl} rightImageUrl={rightImageUrl} />
      
      {/* 控制面板 */}
      <ControlPanel />
      
      {/* 操作提示 */}
      {showInstructions && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center z-10">
          <div className="bg-black bg-opacity-70 backdrop-blur-sm rounded-lg px-4 py-3 text-white text-sm max-w-xs md:max-w-md mx-4">
            <p className="mb-1 font-medium">
              {isMobile ? '倾斜设备控制角度' : '拖拽卡片控制角度'}
            </p>
            <p className="text-gray-300 text-xs">
              在中间角度欣赏图片融合效果
            </p>
            <button
              onClick={() => setShowInstructions(false)}
              className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
            >
              知道了
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FlashcardContainer
