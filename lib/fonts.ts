// lib/fonts.ts
// Amaç:    Cormorant Garamond (başlık) + Nunito (gövde) fontlarını next/font ile self-host eder
// Bağlı:   app/layout.tsx — tüm site tipografisi buradan gelir
// Risk:    Yanlış font yüklemesi → layout shift (CLS) + marka kimliği bozulur
// Dokunma: DESIGN_SYSTEM.md §3 — font seçimi değişmeden bu dosya değişmez

import { Cormorant_Garamond, Nunito } from 'next/font/google'

export const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-nunito',
  display: 'swap',
})
