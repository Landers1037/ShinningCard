import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import useFlashcardStore from '@/stores/flashcardStore'
import { degreesToRadians, smoothRotation } from '@/utils/imageBlend'
import CardMaterial from './CardMaterial'

interface CardMeshProps {
  leftImageUrl: string
  rightImageUrl: string
}

/**
 * 3D卡片网格组件
 * 处理卡片的几何形状和旋转动画
 */
const CardMesh: React.FC<CardMeshProps> = ({ leftImageUrl, rightImageUrl }) => {
  const meshRef = useRef<Mesh>(null)
  const { rotation, isDragging } = useFlashcardStore()
  
  // 卡片配置
  const cardConfig = {
    width: 4,
    height: 6,
    depth: 0.1,
    segments: 32
  }
  
  // 平滑旋转动画
  useFrame(() => {
    if (meshRef.current) {
      const mesh = meshRef.current
      
      // 使用平滑过渡
      const smoothX = smoothRotation(mesh.rotation.x, degreesToRadians(rotation.x), 0.1)
      const smoothY = smoothRotation(mesh.rotation.y, degreesToRadians(rotation.y), 0.1)
      const smoothZ = smoothRotation(mesh.rotation.z, degreesToRadians(rotation.z), 0.1)
      
      mesh.rotation.x = smoothX
      mesh.rotation.y = smoothY
      mesh.rotation.z = smoothZ
      
      // 添加轻微的浮动效果（非拖拽状态下）
      if (!isDragging) {
        mesh.position.y = Math.sin(Date.now() * 0.001) * 0.05
      }
    }
  })
  
  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry
        args={[cardConfig.width, cardConfig.height, cardConfig.depth, cardConfig.segments, cardConfig.segments, cardConfig.segments]}
      />
      <CardMaterial leftImageUrl={leftImageUrl} rightImageUrl={rightImageUrl} />
    </mesh>
  )
}

export default CardMesh