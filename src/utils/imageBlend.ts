/**
 * 计算图片融合参数
 * @param rotationY - Y轴旋转角度（度）
 * @returns 图片透明度和融合因子
 */
export function calculateImageBlend(rotationY: number): { 
  leftOpacity: number
  rightOpacity: number
  blendFactor: number
  isBlending: boolean
} {
  // 将角度标准化到 -90 到 90 度范围
  const normalizedRotation = Math.max(-90, Math.min(90, rotationY))
  
  // 定义融合区域（中间角度范围）
  const blendStart = -15
  const blendEnd = 15
  
  // 计算融合因子
  let blendFactor = 0
  let isBlending = false
  
  if (normalizedRotation <= blendStart) {
    // 左侧角度，只显示左图
    blendFactor = 0
  } else if (normalizedRotation >= blendEnd) {
    // 右侧角度，只显示右图
    blendFactor = 1
  } else {
    // 融合区域，根据角度计算融合因子
    isBlending = true
    blendFactor = (normalizedRotation - blendStart) / (blendEnd - blendStart)
  }
  
  // 计算图片透明度
  const leftOpacity = isBlending ? 1 - blendFactor : (normalizedRotation < 0 ? 1 : 0)
  const rightOpacity = isBlending ? blendFactor : (normalizedRotation > 0 ? 1 : 0)
  
  return {
    leftOpacity: Math.max(0, Math.min(1, leftOpacity)),
    rightOpacity: Math.max(0, Math.min(1, rightOpacity)),
    blendFactor,
    isBlending
  }
}

/**
 * 角度转弧度
 */
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * 弧度转角度
 */
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI)
}

/**
 * 平滑角度过渡
 */
export function smoothRotation(current: number, target: number, smoothFactor: number = 0.1): number {
  return current + (target - current) * smoothFactor
}