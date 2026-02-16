'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { BrainRegionData } from '../data/brainRegions'

interface BrainRegionProps {
  region: BrainRegionData
  isActive: boolean
  isSecondary: boolean
  isInhibited: boolean
  activeColor: string
  animationType: 'pulse' | 'glow' | 'wave' | 'flash' | 'dim' | 'surge'
  animationSpeed: number
  glowIntensity: number
  opacity: number
  onClick?: () => void
}

export default function BrainRegion({
  region,
  isActive,
  isSecondary,
  isInhibited,
  activeColor,
  animationType,
  animationSpeed,
  glowIntensity,
  opacity,
  onClick,
}: BrainRegionProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  const timeRef = useRef(0)

  const geometry = useMemo(() => {
    switch (region.geometry) {
      case 'cylinder':
        return new THREE.CylinderGeometry(0.5, 0.5, 1, 16)
      case 'torus':
        return new THREE.TorusGeometry(0.5, 0.2, 8, 16)
      default:
        return new THREE.SphereGeometry(0.5, 32, 32)
    }
  }, [region.geometry])

  const baseColor = useMemo(() => new THREE.Color(region.color), [region.color])
  const highlightColor = useMemo(() => new THREE.Color(activeColor || region.color), [activeColor, region.color])

  useFrame((_, delta) => {
    if (!meshRef.current || !materialRef.current) return
    timeRef.current += delta * animationSpeed

    const mat = materialRef.current
    const mesh = meshRef.current
    const t = timeRef.current

    if (isActive) {
      switch (animationType) {
        case 'pulse': {
          const pulse = Math.sin(t * 4) * 0.5 + 0.5
          mat.emissiveIntensity = 0.3 + pulse * glowIntensity * 0.7
          const s = 1 + pulse * 0.12
          mesh.scale.set(
            region.scale[0] * s,
            region.scale[1] * s,
            region.scale[2] * s
          )
          break
        }
        case 'glow': {
          const glow = Math.sin(t * 1.5) * 0.15 + 0.85
          mat.emissiveIntensity = glow * glowIntensity
          break
        }
        case 'wave': {
          const wave = Math.sin(t * 2 + region.position[0] * 3) * 0.5 + 0.5
          mat.emissiveIntensity = wave * glowIntensity
          break
        }
        case 'flash': {
          const flash = Math.sin(t * 8) > 0.3 ? 1 : 0.2
          mat.emissiveIntensity = flash * glowIntensity
          break
        }
        case 'dim': {
          mat.emissiveIntensity = 0.15
          mat.opacity = 0.4 + Math.sin(t) * 0.1
          break
        }
        case 'surge': {
          const surge = (Math.sin(t * 2 - Math.PI / 2) + 1) / 2
          mat.emissiveIntensity = surge * glowIntensity
          break
        }
      }
      mat.emissive.copy(highlightColor)
    } else if (isSecondary) {
      const soft = Math.sin(t * 2) * 0.1 + 0.3
      mat.emissiveIntensity = soft * glowIntensity * 0.5
      mat.emissive.copy(highlightColor)
    } else if (isInhibited) {
      mat.emissiveIntensity = 0.02
      mat.opacity = 0.25
      mat.emissive.copy(baseColor)
    } else {
      // Idle state — gentle subtle glow
      mat.emissiveIntensity = 0.05
      mat.opacity = opacity
      mat.emissive.copy(baseColor)
      // Reset scale
      mesh.scale.set(region.scale[0], region.scale[1], region.scale[2])
    }
  })

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={region.position}
      scale={region.scale}
      rotation={region.rotation ? region.rotation as [number, number, number] : [0, 0, 0]}
      onClick={onClick}
    >
      <meshStandardMaterial
        ref={materialRef}
        color={isActive || isSecondary ? activeColor : region.color}
        transparent
        opacity={opacity}
        emissive={region.color}
        emissiveIntensity={0.05}
        roughness={0.4}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
