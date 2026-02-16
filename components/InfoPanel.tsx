'use client'

import type { EmotionData } from '../data/emotions'
import { brainRegions } from '../data/brainRegions'

interface InfoPanelProps {
  selectedEmotion: EmotionData | null
}

export default function InfoPanel({ selectedEmotion }: InfoPanelProps) {
  if (!selectedEmotion) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">🧠</div>
        <h2 className="text-lg font-semibold mb-2 text-white/80">
          Bir Duygu Seçin
        </h2>
        <p className="text-sm text-white/40 leading-relaxed">
          Sol panelden bir duygu seçerek beyin üzerindeki etkilerini keşfedin.
          <br /><br />
          Her duygu farklı beyin bölgelerini aktive eder ve farklı nörotransmitterler salgılanır.
        </p>
      </div>
    )
  }

  const getRegionName = (id: string): string => {
    const region = brainRegions.find((r) => r.id === id)
    return region?.nameTR ?? id
  }

  return (
    <div className="h-full overflow-y-auto space-y-5 animate-fade-in" key={selectedEmotion.id}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-4xl">{selectedEmotion.emoji}</span>
        <div>
          <h2 className="text-xl font-bold" style={{ color: selectedEmotion.color }}>
            {selectedEmotion.nameTR}
          </h2>
          <p className="text-xs text-white/40">{selectedEmotion.name}</p>
        </div>
      </div>

      {/* Description */}
      <div>
        <p className="text-sm text-white/70 leading-relaxed">
          {selectedEmotion.descriptionTR}
        </p>
      </div>

      {/* Active regions */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-2 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedEmotion.color }} />
          Aktif Bölgeler
        </h3>
        <div className="space-y-1">
          {selectedEmotion.primaryRegions.map((id) => (
            <div
              key={id}
              className="flex items-center gap-2 px-2 py-1.5 rounded text-xs"
              style={{ backgroundColor: selectedEmotion.color + '20' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full pulse-dot"
                style={{ backgroundColor: selectedEmotion.color }}
              />
              <span className="font-medium">{getRegionName(id)}</span>
              <span className="ml-auto text-[10px] text-white/40">birincil</span>
            </div>
          ))}
          {selectedEmotion.secondaryRegions.map((id) => (
            <div
              key={id}
              className="flex items-center gap-2 px-2 py-1.5 rounded text-xs bg-white/5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <span className="text-white/60">{getRegionName(id)}</span>
              <span className="ml-auto text-[10px] text-white/30">ikincil</span>
            </div>
          ))}
        </div>
      </div>

      {/* Inhibited regions */}
      {selectedEmotion.inhibitedRegions.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/50" />
            Baskılanan Bölgeler
          </h3>
          <div className="space-y-1">
            {selectedEmotion.inhibitedRegions.map((id) => (
              <div
                key={id}
                className="flex items-center gap-2 px-2 py-1.5 rounded text-xs bg-red-500/10"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400/50" />
                <span className="text-white/40 line-through">{getRegionName(id)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Neurotransmitters */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
          🧪 Nörotransmitterler
        </h3>
        <div className="space-y-1.5">
          {selectedEmotion.neurotransmitters.map((nt, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-2 py-1.5 rounded text-xs"
              style={{ backgroundColor: nt.color + '15' }}
            >
              <span
                className={`text-sm font-bold ${
                  nt.effect === 'increase' ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {nt.effect === 'increase' ? '↑' : '↓'}
              </span>
              <span className="font-medium">{nt.nameTR}</span>
              <span className="text-[10px] text-white/30 ml-auto">{nt.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scientific note */}
      <div className="border-t border-white/10 pt-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
          📚 Bilimsel Not
        </h3>
        <p className="text-xs text-white/50 leading-relaxed italic">
          {selectedEmotion.scientificNoteTR}
        </p>
      </div>
    </div>
  )
}
