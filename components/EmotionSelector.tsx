'use client'

import { emotions, type EmotionData } from '../data/emotions'

interface EmotionSelectorProps {
  selectedEmotion: EmotionData | null
  onSelect: (emotion: EmotionData | null) => void
}

export default function EmotionSelector({ selectedEmotion, onSelect }: EmotionSelectorProps) {
  const basicEmotions = emotions.filter((e) => e.category === 'basic')
  const complexEmotions = emotions.filter((e) => e.category === 'complex')

  const handleClick = (emotion: EmotionData) => {
    if (selectedEmotion?.id === emotion.id) {
      onSelect(null) // deselect
    } else {
      onSelect(emotion)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3 px-1">
        Temel Duygular
      </h2>
      <div className="space-y-1 mb-4">
        {basicEmotions.map((emotion) => (
          <button
            key={emotion.id}
            onClick={() => handleClick(emotion)}
            className={`emotion-card w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
              selectedEmotion?.id === emotion.id
                ? 'active border-l-3 bg-white/10'
                : 'hover:bg-white/5 border-l-3 border-transparent'
            }`}
            style={{
              borderLeftColor: selectedEmotion?.id === emotion.id ? emotion.color : 'transparent',
              '--accent-color': emotion.color,
            } as React.CSSProperties}
          >
            <span className="text-xl flex-shrink-0">{emotion.emoji}</span>
            <span className="text-sm font-medium truncate">{emotion.nameTR}</span>
            {selectedEmotion?.id === emotion.id && (
              <span
                className="ml-auto w-2 h-2 rounded-full pulse-dot flex-shrink-0"
                style={{ backgroundColor: emotion.color }}
              />
            )}
          </button>
        ))}
      </div>

      <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3 px-1">
        Karmaşık Duygular
      </h2>
      <div className="space-y-1 overflow-y-auto flex-1">
        {complexEmotions.map((emotion) => (
          <button
            key={emotion.id}
            onClick={() => handleClick(emotion)}
            className={`emotion-card w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
              selectedEmotion?.id === emotion.id
                ? 'active border-l-3 bg-white/10'
                : 'hover:bg-white/5 border-l-3 border-transparent'
            }`}
            style={{
              borderLeftColor: selectedEmotion?.id === emotion.id ? emotion.color : 'transparent',
            }}
          >
            <span className="text-xl flex-shrink-0">{emotion.emoji}</span>
            <span className="text-sm font-medium truncate">{emotion.nameTR}</span>
            {selectedEmotion?.id === emotion.id && (
              <span
                className="ml-auto w-2 h-2 rounded-full pulse-dot flex-shrink-0"
                style={{ backgroundColor: emotion.color }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
