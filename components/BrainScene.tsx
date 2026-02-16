'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import BrainModel from './BrainModel'
import type { EmotionData } from '../data/emotions'

interface BrainSceneProps {
  selectedEmotion: EmotionData | null
  onRegionClick?: (regionId: string) => void
}

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="#4a4a6a" wireframe />
    </mesh>
  )
}

export default function BrainScene({ selectedEmotion, onRegionClick }: BrainSceneProps) {
  const bloomIntensity = selectedEmotion ? selectedEmotion.glowIntensity * 1.5 : 0.4

  return (
    <Canvas
      camera={{ position: [0, 0.5, 3.5], fov: 45, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <directionalLight position={[-5, 3, -5]} intensity={0.3} color="#a0a0ff" />
      <pointLight position={[0, 2, 3]} intensity={0.4} color="#ffffff" />

      {/* Stars background */}
      <Stars radius={50} depth={50} count={1500} factor={3} saturation={0.2} fade speed={0.5} />

      {/* Environment for reflections */}
      <Environment preset="night" />

      {/* Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2}
        maxDistance={7}
        autoRotate={false}
        dampingFactor={0.05}
        enableDamping
      />

      {/* Brain */}
      <Suspense fallback={<LoadingFallback />}>
        <BrainModel
          selectedEmotion={selectedEmotion}
          onRegionClick={onRegionClick}
        />
      </Suspense>

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={bloomIntensity}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.1} darkness={0.8} />
      </EffectComposer>
    </Canvas>
  )
}
