import React, { useEffect, useState } from 'react'
import useFlashcardStore from '@/stores/flashcardStore'
import { smoothRotation } from '@/utils/imageBlend'

/**
 * 陀螺仪控制器组件
 * 检测设备陀螺仪支持并处理设备方向变化
 */
const GyroscopeController: React.FC = () => {
  const { rotation, setRotation, setGyroscopeEnabled } = useFlashcardStore()
  const [isSupported, setIsSupported] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)
  
  // 检测设备是否支持陀螺仪
  useEffect(() => {
    const checkGyroscopeSupport = async () => {
      if ('DeviceOrientationEvent' in window) {
        // iOS 13+ 需要请求权限
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
          try {
            const permission = await (DeviceOrientationEvent as any).requestPermission()
            setHasPermission(permission === 'granted')
            setIsSupported(permission === 'granted')
            setGyroscopeEnabled(permission === 'granted')
          } catch (error) {
            console.log('陀螺仪权限请求失败:', error)
            setIsSupported(false)
            setGyroscopeEnabled(false)
          }
        } else {
          // Android 和其他设备
          setIsSupported(true)
          setHasPermission(true)
          setGyroscopeEnabled(true)
        }
      } else {
        setIsSupported(false)
        setGyroscopeEnabled(false)
      }
    }
    
    // 延迟检测，确保页面加载完成
    const timer = setTimeout(checkGyroscopeSupport, 1000)
    return () => clearTimeout(timer)
  }, [setGyroscopeEnabled])
  
  // 处理设备方向变化
  useEffect(() => {
    if (!isSupported || !hasPermission) return
    
    let lastGamma = 0
    let lastBeta = 0
    
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const { gamma, beta } = event
      
      if (gamma !== null && beta !== null) {
        // 过滤掉无效值和过大的变化
        const deltaGamma = Math.abs(gamma - lastGamma)
        const deltaBeta = Math.abs(beta - lastBeta)
        
        if (deltaGamma < 50 && deltaBeta < 50) {
          // 将设备方向转换为卡片旋转角度
          // gamma: 左右倾斜（-90到90度）-> 控制Y轴旋转
          // beta: 前后倾斜（-180到180度）-> 控制X轴旋转
          const rotationY = Math.max(-90, Math.min(90, gamma || 0))
          const rotationX = Math.max(-45, Math.min(45, (beta || 0) * 0.5))
          
          setRotation({
            x: rotationX,
            y: rotationY,
            z: 0
          })
        }
        
        lastGamma = gamma || 0
        lastBeta = beta || 0
      }
    }
    
    window.addEventListener('deviceorientation', handleOrientation)
    
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [isSupported, hasPermission, setRotation])
  
  return null
}

export default GyroscopeController