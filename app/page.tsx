'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { EmotionData } from '../data/emotions'
import Header from '../components/Header'
import EmotionSelector from '../components/EmotionSelector'
import InfoPanel from '../components/InfoPanel'
import MobileEmotionBar from '../components/MobileEmotionBar'

// Dynamic import to avoid SSR issues with Three.js
const BrainScene = dynamic(() => import('../components/BrainScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-3 animate-pulse">🧠</div>
        <p className="text-sm text-white/40">Beyin modeli yükleniyor...</p>
      </div>
    </div>
  ),
})

export default function Home() {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionData | null>(null)
  const [showMobileInfo, setShowMobileInfo] = useState(false)

  const handleEmotionSelect = (emotion: EmotionData | null) => {
    setSelectedEmotion(emotion)
    if (emotion) setShowMobileInfo(true)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: '#0a0a1a' }}>
      {/* Header */}
      <Header emotionColor={selectedEmotion?.color} />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop: Left sidebar - Emotion Selector */}
        <aside className="hidden lg:flex w-56 flex-col glass border-r border-white/5 p-4 overflow-y-auto">
          <EmotionSelector
            selectedEmotion={selectedEmotion}
            onSelect={handleEmotionSelect}
          />
        </aside>

        {/* Center: 3D Brain */}
        <main className="flex-1 relative">
          <BrainScene
            selectedEmotion={selectedEmotion}
            onRegionClick={(regionId) => {
              console.log('Clicked region:', regionId)
            }}
          />

          {/* Mobile: Emotion bar overlay at bottom of 3D view */}
          <div className="lg:hidden absolute bottom-0 left-0 right-0 glass border-t border-white/5">
            <MobileEmotionBar
              selectedEmotion={selectedEmotion}
              onSelect={handleEmotionSelect}
            />
          </div>

          {/* Mobile: Info drawer */}
          {showMobileInfo && selectedEmotion && (
            <div className="lg:hidden absolute inset-0 z-30 flex flex-col">
              <div
                className="flex-1"
                onClick={() => setShowMobileInfo(false)}
              />
              <div className="glass border-t border-white/10 max-h-[60vh] overflow-y-auto p-4 rounded-t-2xl animate-fade-in">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xl">{selectedEmotion.emoji} {selectedEmotion.nameTR}</span>
                  <button
                    onClick={() => setShowMobileInfo(false)}
                    className="text-white/40 hover:text-white/80 text-lg px-2"
                  >
                    ✕
                  </button>
                </div>
                <InfoPanel selectedEmotion={selectedEmotion} />
              </div>
            </div>
          )}
        </main>

        {/* Desktop: Right sidebar - Info Panel */}
        <aside className="hidden lg:flex w-80 flex-col glass border-l border-white/5 p-5 overflow-y-auto">
          <InfoPanel selectedEmotion={selectedEmotion} />
        </aside>
      </div>

      {/* Bottom bar - neurotransmitter summary */}
      {selectedEmotion && (
        <div className="hidden lg:flex glass border-t border-white/5 px-6 py-2 items-center gap-4">
          <span className="text-xs text-white/40">⚡ Nörotransmitterler:</span>
          <div className="flex gap-3 overflow-x-auto">
            {selectedEmotion.neurotransmitters.map((nt, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 text-xs whitespace-nowrap"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: nt.color }}
                />
                <span className={nt.effect === 'increase' ? 'text-green-400' : 'text-red-400'}>
                  {nt.effect === 'increase' ? '↑' : '↓'}
                </span>
                <span className="text-white/60">{nt.nameTR}</span>
              </span>
            ))}
          </div>
          <span className="ml-auto text-[10px] text-white/20">
            {selectedEmotion.animationType} · {selectedEmotion.animationSpeed}x
          </span>
        </div>
      )}
    </div>
  )
}
