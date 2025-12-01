import React, { useRef, useMemo } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader, MeshStandardMaterial, DoubleSide } from 'three'
import useFlashcardStore from '@/stores/flashcardStore'
import { calculateImageBlend } from '@/utils/imageBlend'

interface CardMaterialProps {
  leftImageUrl: string
  rightImageUrl: string
}

/**
 * 3D卡片材质组件
 * 根据旋转角度动态切换和融合图片
 */
const CardMaterial: React.FC<CardMaterialProps> = ({ leftImageUrl, rightImageUrl }) => {
  const materialRef = useRef<MeshStandardMaterial>(null)
  const { rotation } = useFlashcardStore()
  
  // 加载纹理
  const leftTexture = useLoader(TextureLoader, leftImageUrl)
  const rightTexture = useLoader(TextureLoader, rightImageUrl)
  
  // 计算融合参数
  const blendParams = useMemo(() => {
    return calculateImageBlend(rotation.y)
  }, [rotation.y])
  
  // 更新材质
  useFrame(() => {
    if (materialRef.current) {
      const material = materialRef.current
      
      // 设置纹理
      if (blendParams.leftOpacity > 0 && blendParams.rightOpacity > 0) {
        // 融合状态 - 使用混合纹理
        material.map = leftTexture
        material.alphaMap = rightTexture
        material.opacity = 1
        material.transparent = true
      } else if (blendParams.leftOpacity > 0) {
        // 左侧角度
        material.map = leftTexture
        material.opacity = blendParams.leftOpacity
        material.transparent = blendParams.leftOpacity < 1
      } else {
        // 右侧角度
        material.map = rightTexture
        material.opacity = blendParams.rightOpacity
        material.transparent = blendParams.rightOpacity < 1
      }
      
      // 设置材质属性
      material.metalness = 0.8
      material.roughness = 0.2
      material.side = DoubleSide
      
      material.needsUpdate = true
    }
  })
  
  return (
    <meshStandardMaterial
      ref={materialRef}
      attach="material"
      color="#c0c0c0"
      metalness={0.8}
      roughness={0.2}
      side={DoubleSide}
    />
  )
}

export default CardMaterial