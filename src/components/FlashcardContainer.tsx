import React, { useState, useEffect } from 'react'
import CSSFlashcard from './CSSFlashcard'
import ControlPanel from './ControlPanel'
import leftImg from '@/assets/left.png'
import rightImg from '@/assets/right.png'
import { getStoredImages, saveImages, clearImages, fileToDataURL } from '@/utils/db'
import { Settings, Info, RotateCcw, Trash2 } from 'lucide-react'
import useFlashcardStore from '@/stores/flashcardStore'
import AutoRotateController from './AutoRotateController'
import FilePicker from './FilePicker'

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
  const [leftUrl, setLeftUrl] = useState(leftImageUrl)
  const [rightUrl, setRightUrl] = useState(rightImageUrl)
  const [isMobile, setIsMobile] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { showStatusPanel, setShowStatusPanel, autoRotate, setAutoRotate } = useFlashcardStore()

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
      
      const initImages = async () => {
        const stored = await getStoredImages()
        if (stored.left || stored.right) {
          setLeftUrl(stored.left || leftImageUrl)
          setRightUrl(stored.right || rightImageUrl)
        }
      }
      await initImages()
      setTimeout(() => { setIsLoading(false) }, 500)
      
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
      <CSSFlashcard leftImageUrl={leftUrl} rightImageUrl={rightUrl} />
      <AutoRotateController />
      
      {/* 顶部按钮 */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        <button
          onClick={() => setShowStatusPanel(!showStatusPanel)}
          className="px-3 py-2 rounded-md bg-black/50 hover:bg-black/60 text-white text-xs flex items-center gap-1"
        >
          <Info size={14} />
          <span>状态</span>
        </button>
        <button
          onClick={() => setSettingsOpen(true)}
          className="px-3 py-2 rounded-md bg-black/50 hover:bg-black/60 text-white text-xs flex items-center gap-1"
        >
          <Settings size={14} />
          <span>设置</span>
        </button>
      </div>

      {/* 控制面板 */}
      {showStatusPanel && <ControlPanel />}

      {/* 设置弹框 */}
      {settingsOpen && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSettingsOpen(false)} />
          <div className="relative bg-gray-800 text-white rounded-lg p-4 w-80 shadow-xl">
            <div className="text-sm font-medium mb-3">设置</div>
            <div className="space-y-3">
              <div>
                <div className="text-xs mb-1">左侧图片</div>
                <FilePicker label="选择左侧图片" accept="image/*" onFileSelected={(url) => setLeftUrl(url)} />
              </div>
              <div>
                <div className="text-xs mb-1">右侧图片</div>
                <FilePicker label="选择右侧图片" accept="image/*" onFileSelected={(url) => setRightUrl(url)} />
              </div>
              <div className="flex items-center gap-2 text-xs">
                <input id="autoRotate" type="checkbox" checked={autoRotate} onChange={(e) => setAutoRotate(e.target.checked)} />
                <label htmlFor="autoRotate">自动旋转</label>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => { await saveImages(leftUrl, rightUrl); setSettingsOpen(false) }}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                >保存</button>
                <button
                  onClick={async () => { await clearImages(); setLeftUrl(DEFAULT_IMAGES.left); setRightUrl(DEFAULT_IMAGES.right); setSettingsOpen(false) }}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs flex items-center gap-1"
                ><Trash2 size={12} />清除缓存</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
