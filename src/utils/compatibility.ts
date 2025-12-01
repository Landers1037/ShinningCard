/**
 * WebGL兼容性检测
 */
export function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return !!gl
  } catch (e) {
    return false
  }
}

/**
 * 陀螺仪API支持检测
 */
export function checkGyroscopeSupport(): boolean {
  return 'DeviceOrientationEvent' in window
}

/**
 * 触摸设备检测
 */
export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * 移动设备检测
 */
export function isMobileDevice(): boolean {
  const userAgent = navigator.userAgent.toLowerCase()
  const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'windows phone']
  return mobileKeywords.some(keyword => userAgent.includes(keyword))
}

/**
 * 获取设备像素比
 */
export function getDevicePixelRatio(): number {
  return Math.min(window.devicePixelRatio || 1, 2)
}

/**
 * 性能等级评估
 */
export function getPerformanceLevel(): 'high' | 'medium' | 'low' {
  const memory = (navigator as any).deviceMemory
  const cores = navigator.hardwareConcurrency
  
  if (memory >= 8 && cores >= 4) return 'high'
  if (memory >= 4 && cores >= 2) return 'medium'
  return 'low'
}

/**
 * 浏览器信息
 */
export function getBrowserInfo(): { name: string; version: string } {
  const userAgent = navigator.userAgent
  let name = 'Unknown'
  let version = 'Unknown'
  
  if (userAgent.indexOf('Chrome') > -1) {
    name = 'Chrome'
    version = userAgent.match(/Chrome\/(\d+\.\d+)/)?.[1] || 'Unknown'
  } else if (userAgent.indexOf('Safari') > -1) {
    name = 'Safari'
    version = userAgent.match(/Version\/(\d+\.\d+)/)?.[1] || 'Unknown'
  } else if (userAgent.indexOf('Firefox') > -1) {
    name = 'Firefox'
    version = userAgent.match(/Firefox\/(\d+\.\d+)/)?.[1] || 'Unknown'
  } else if (userAgent.indexOf('Edge') > -1) {
    name = 'Edge'
    version = userAgent.match(/Edge\/(\d+\.\d+)/)?.[1] || 'Unknown'
  }
  
  return { name, version }
}