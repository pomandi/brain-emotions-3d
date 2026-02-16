'use client'

import { emotions, type EmotionData } from '../data/emotions'

interface MobileEmotionBarProps {
  selectedEmotion: EmotionData | null
  onSelect: (emotion: EmotionData | null) => void
}

export default function MobileEmotionBar({ selectedEmotion, onSelect }: MobileEmotionBarProps) {
  return (
    <div className="flex gap-1 overflow-x-auto px-3 py-2 no-scrollbar">
      {emotions.map((emotion) => (
        <button
          key={emotion.id}
          onClick={() =>
            selectedEmotion?.id === emotion.id ? onSelect(null) : onSelect(emotion)
          }
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
            selectedEmotion?.id === emotion.id
              ? 'bg-white/15 border border-white/20'
              : 'bg-white/5 border border-transparent hover:bg-white/10'
          }`}
          style={{
            borderColor: selectedEmotion?.id === emotion.id ? emotion.color + '60' : undefined,
            color: selectedEmotion?.id === emotion.id ? emotion.color : undefined,
          }}
        >
          <span className="text-base">{emotion.emoji}</span>
          <span className="hidden sm:inline">{emotion.nameTR}</span>
        </button>
      ))}
    </div>
  )
}
