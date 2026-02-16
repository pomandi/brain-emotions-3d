'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { brainRegions } from '../data/brainRegions'
import type { EmotionData } from '../data/emotions'
import BrainRegion from './BrainRegion'

interface BrainModelProps {
  selectedEmotion: EmotionData | null
  onRegionClick?: (regionId: string) => void
}

export default function BrainModel({ selectedEmotion, onRegionClick }: BrainModelProps) {
  const groupRef = useRef<THREE.Group>(null)

  // Slow auto-rotate when no interaction
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1
    }
  })

  // Create deformed outer brain shell
  const brainShellGeometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 64, 64)
    const pos = geo.attributes.position
    const vertex = new THREE.Vector3()

    for (let i = 0; i < pos.count; i++) {
      vertex.fromBufferAttribute(pos, i)

      // Create brain-like shape: wider front-to-back, narrower left-right
      // Fissure (gap between hemispheres)
      const fissureDepth = Math.exp(-vertex.x * vertex.x * 20) * 0.08
      vertex.y -= fissureDepth

      // Sulci/gyri (wrinkles)
      const noise =
        Math.sin(vertex.x * 8 + vertex.y * 6) * 0.03 +
        Math.sin(vertex.y * 12 + vertex.z * 4) * 0.02 +
        Math.sin(vertex.z * 10 + vertex.x * 5) * 0.02

      const len = vertex.length()
      vertex.normalize().multiplyScalar(len + noise)

      pos.setXYZ(i, vertex.x, vertex.y, vertex.z)
    }

    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <group ref={groupRef}>
      {/* Semi-transparent outer brain shell */}
      <mesh
        geometry={brainShellGeometry}
        position={[0, 0.3, 0]}
        scale={[1.6, 1.2, 1.4]}
      >
        <meshStandardMaterial
          color="#f5c6c6"
          transparent
          opacity={selectedEmotion ? 0.12 : 0.25}
          roughness={0.6}
          metalness={0.05}
          emissive="#f5c6c6"
          emissiveIntensity={0.03}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Brain regions (skip cerebralCortex as we render shell separately) */}
      {brainRegions
        .filter((r) => r.id !== 'cerebralCortex')
        .map((region) => {
          const isPrimary = selectedEmotion?.primaryRegions.includes(region.id) ?? false
          const isSecondary = selectedEmotion?.secondaryRegions.includes(region.id) ?? false
          const isInhibited = selectedEmotion?.inhibitedRegions.includes(region.id) ?? false

          let regionOpacity = 0.6
          if (selectedEmotion) {
            if (isPrimary) regionOpacity = 0.95
            else if (isSecondary) regionOpacity = 0.7
            else if (isInhibited) regionOpacity = 0.2
            else regionOpacity = 0.15
          }

          return (
            <BrainRegion
              key={region.id}
              region={region}
              isActive={isPrimary}
              isSecondary={isSecondary}
              isInhibited={isInhibited}
              activeColor={selectedEmotion?.color ?? region.color}
              animationType={selectedEmotion?.animationType ?? 'glow'}
              animationSpeed={selectedEmotion?.animationSpeed ?? 1}
              glowIntensity={selectedEmotion?.glowIntensity ?? 0.3}
              opacity={regionOpacity}
              onClick={() => onRegionClick?.(region.id)}
            />
          )
        })}
    </group>
  )
}
