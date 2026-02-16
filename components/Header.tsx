'use client'

interface HeaderProps {
  emotionColor?: string
}

export default function Header({ emotionColor }: HeaderProps) {
  return (
    <header className="glass flex items-center justify-between px-4 md:px-6 py-3 z-50 relative">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🧠</span>
        <div>
          <h1
            className="text-lg font-bold tracking-tight transition-colors duration-500"
            style={{ color: emotionColor || '#ffffff' }}
          >
            BrainMap3D
          </h1>
          <p className="text-[10px] text-white/40 hidden sm:block">
            İnteraktif Duygu-Beyin Görselleştirme
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="https://pomandi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-white/30 hover:text-white/60 transition-colors hidden sm:block"
        >
          Pomandi Labs
        </a>
      </div>
    </header>
  )
}
