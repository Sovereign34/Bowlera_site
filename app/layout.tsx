// app/layout.tsx
// Amaç:    Tüm sayfalar için ortak iskelet — font, Header/Footer
// Bağlı:   Her sayfa buradan render edilir (ARCHITECTURE.md §2.1)
// Risk:    Hatalı font/tema yüklemesi → tüm site etkilenir
// Dokunma: DESIGN_SYSTEM.md §Tipografi kontrol et

import type { Metadata } from 'next'
import { cormorantGaramond, nunito } from '@/lib/fonts'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bowlera — Healthy Bowls',
  description: 'Şehrin ritmini yakalayan taze ve sağlıklı kaseler. Kendi kâseni yarat.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${cormorantGaramond.variable} ${nunito.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
