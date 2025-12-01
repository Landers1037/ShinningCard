import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Mesh, BoxGeometry, MeshStandardMaterial, DoubleSide } from 'three'
import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import useFlashcardStore from '@/stores/flashcardStore'
import { calculateImageBlend, degreesToRadians } from '@/utils/imageBlend'

interface SimpleFlashcard3DProps {
  leftImageUrl: string
  rightImageUrl: string
}

// 简单的3D卡片组件
function SimpleCard({ leftImageUrl, rightImageUrl }: { leftImageUrl: string; rightImageUrl: string }) {
  const meshRef = useRef<Mesh>(null)
  const { rotation, isDragging } = useFlashcardStore()
  const [leftTexture, setLeftTexture] = useState<any>(null)
  const [rightTexture, setRightTexture] = useState<any>(null)
  
  // 加载纹理
  useEffect(() => {
    const loader = new (require('three')).TextureLoader()
    loader.load(leftImageUrl, (texture: any) => {
      setLeftTexture(texture)
    })
    loader.load(rightImageUrl, (texture: any) => {
      setRightTexture(texture)
    })
  }, [leftImageUrl, rightImageUrl])
  
  // 计算融合参数
  const blendParams = calculateImageBlend(rotation.y)
  
  // 更新材质
  useFrame(() => {
    if (meshRef.current) {
      const mesh = meshRef.current
      
      // 平滑旋转
      const targetRotationX = degreesToRadians(rotation.x)
      const targetRotationY = degreesToRadians(rotation.y)
      const targetRotationZ = degreesToRadians(rotation.z)
      
      mesh.rotation.x += (targetRotationX - mesh.rotation.x) * 0.1
      mesh.rotation.y += (targetRotationY - mesh.rotation.y) * 0.1
      mesh.rotation.z += (targetRotationZ - mesh.rotation.z) * 0.1
      
      // 添加轻微的浮动效果（非拖拽状态下）
      if (!isDragging) {
        mesh.position.y = Math.sin(Date.now() * 0.001) * 0.05
      }
    }
  })
  
  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[4, 6, 0.1, 32, 32, 32]} />
      <meshStandardMaterial
        attach="material"
        color="#c0c0c0"
        metalness={0.8}
        roughness={0.2}
        side={DoubleSide}
        map={blendParams.leftOpacity > blendParams.rightOpacity ? leftTexture : rightTexture}
        transparent={blendParams.isBlending}
        opacity={blendParams.leftOpacity > blendParams.rightOpacity ? blendParams.leftOpacity : blendParams.rightOpacity}
      />
    </mesh>
  )
}

/**
 * 简化的3D闪卡主组件
 */
const SimpleFlashcard3D: React.FC<SimpleFlashcard3DProps> = ({ leftImageUrl, rightImageUrl }) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        {/* 环境光 */}
        <ambientLight intensity={0.4} />
        
        {/* 主光源 */}
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        
        {/* 补光 */}
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        
        {/* 环境贴图 */}
        <Environment preset="studio" />
        
        {/* 3D卡片 */}
        <Suspense fallback={null}>
          <SimpleCard leftImageUrl={leftImageUrl} rightImageUrl={rightImageUrl} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default SimpleFlashcard3D