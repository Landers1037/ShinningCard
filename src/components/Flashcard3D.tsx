import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import CardMesh from './CardMesh'
import MouseController from './MouseController'
import GyroscopeController from './GyroscopeController'

interface Flashcard3DProps {
  leftImageUrl: string
  rightImageUrl: string
}

/**
 * 3D闪卡主组件
 * 设置3D场景和渲染环境
 */
const Flashcard3D: React.FC<Flashcard3DProps> = ({ leftImageUrl, rightImageUrl }) => {
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
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        
        {/* 补光 */}
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        <pointLight position={[10, -10, -10]} intensity={0.3} />
        
        {/* 环境贴图 */}
        <Environment preset="studio" />
        
        {/* 3D卡片 */}
        <Suspense fallback={null}>
          <CardMesh leftImageUrl={leftImageUrl} rightImageUrl={rightImageUrl} />
        </Suspense>
        
        {/* 接触阴影 */}
        <ContactShadows
          position={[0, -3.5, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
        />
        
        {/* 控制器 */}
        <MouseController />
        <GyroscopeController />
      </Canvas>
    </div>
  )
}

export default Flashcard3D