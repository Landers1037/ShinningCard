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
  const normalizedRotation = rotationY
  const angleAbs = Math.abs(normalizedRotation)
  const maxBlendAngle = 60
  let leftOpacity = 0
  let rightOpacity = 0
  let isBlending = angleAbs < maxBlendAngle
  if (angleAbs >= maxBlendAngle) {
    if (normalizedRotation >= 0) {
      rightOpacity = 1
      leftOpacity = 0
    } else {
      leftOpacity = 1
      rightOpacity = 0
    }
  } else {
    const sideOpacity = 0.5 + (angleAbs / (2 * maxBlendAngle))
    if (normalizedRotation >= 0) {
      rightOpacity = sideOpacity
      leftOpacity = 1 - sideOpacity
    } else {
      leftOpacity = sideOpacity
      rightOpacity = 1 - sideOpacity
    }
  }
  const blendFactor = normalizedRotation >= 0 ? rightOpacity : leftOpacity
  return {
    leftOpacity: Math.max(0, Math.min(1, leftOpacity)),
    rightOpacity: Math.max(0, Math.min(1, rightOpacity)),
    blendFactor,
    isBlending
  }
}

export function calculateBlendByAxes(rotation: { x: number; y: number; z: number }): {
  leftOpacity: number
  rightOpacity: number
  blendFactor: number
  isBlending: boolean
} {
  const angles = [rotation.x, rotation.y, rotation.z]
  const idx = [Math.abs(rotation.x), Math.abs(rotation.y), Math.abs(rotation.z)].reduce((m, v, i, arr) => (v > arr[m] ? i : m), 0)
  const dominant = angles[idx]
  return calculateImageBlend(dominant)
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
