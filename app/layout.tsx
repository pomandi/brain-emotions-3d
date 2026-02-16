import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BrainMap3D — Duyguların Beyin Haritası',
  description: 'İnteraktif 3D beyin modeli üzerinde duyguların hangi beyin bölgelerini aktive ettiğini keşfedin.',
  openGraph: {
    title: 'BrainMap3D — Duyguların Beyin Haritası',
    description: 'İnteraktif 3D beyin modeli üzerinde duyguların beyin bölgelerini keşfedin.',
    type: 'website',
    url: 'https://brain.pomandi.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
