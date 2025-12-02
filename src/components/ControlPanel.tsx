import React from 'react'
import { RotateCcw, MousePointer, Smartphone } from 'lucide-react'
import useFlashcardStore from '@/stores/flashcardStore'
import { calculateBlendByAxes } from '@/utils/imageBlend'

/**
 * 控制面板组件
 * 显示当前状态和操作提示
 */
const ControlPanel: React.FC = () => {
  const { rotation, resetRotation, isGyroscopeEnabled, isDragging } = useFlashcardStore()
  const blendParams = calculateBlendByAxes(rotation)
  const overThreshold = Math.abs(rotation.x) >= 60 || Math.abs(rotation.y) >= 60 || Math.abs(rotation.z) >= 60
  
  return (
    <div className="absolute top-16 right-4 bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-3 md:p-4 text-white text-xs md:text-sm max-w-[200px] md:max-w-none">
      {/* 角度信息 */}
      <div className="mb-2 md:mb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-gray-300">旋转角度</span>
        </div>
        <div className="grid grid-cols-3 gap-1 md:gap-2 text-xs">
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
      
      {/* 融合状态 */}
      <div className="mb-2 md:mb-3">
        <div className="text-xs text-gray-300 mb-1">融合状态</div>
        <div className={`text-xs px-2 py-1 rounded ${
          !overThreshold && blendParams.isBlending 
            ? 'bg-yellow-600 bg-opacity-50 text-yellow-200' 
            : 'bg-gray-600 bg-opacity-50 text-gray-300'
        }`}>
          {!overThreshold && blendParams.isBlending ? '融合中' : '单图显示'}
        </div>
        {!overThreshold && blendParams.isBlending && (
          <div className="text-xs text-gray-400 mt-1">
            融合度: {Math.round(blendParams.blendFactor * 100)}%
          </div>
        )}
      </div>
      
      {/* 控制状态 */}
      <div className="mb-2 md:mb-3">
        <div className="text-xs text-gray-300 mb-1 md:mb-2">控制方式</div>
        <div className="space-y-1">
          <div className={`flex items-center gap-1 md:gap-2 text-xs ${
            isDragging ? 'text-blue-300' : 'text-gray-400'
          }`}>
            <MousePointer size={12} />
            <span>鼠标拖拽</span>
            {isDragging && <span className="text-blue-400">●</span>}
          </div>
          {isGyroscopeEnabled && (
            <div className="flex items-center gap-1 md:gap-2 text-xs text-green-400">
              <Smartphone size={12} />
              <span>陀螺仪</span>
              <span className="text-green-400">●</span>
            </div>
          )}
        </div>
      </div>
      
      {/* 重置按钮 */}
      <button
        onClick={resetRotation}
        className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-xs transition-colors w-full justify-center"
      >
        <RotateCcw size={12} />
        <span>重置角度</span>
      </button>
    </div>
  )
}

export default ControlPanel
