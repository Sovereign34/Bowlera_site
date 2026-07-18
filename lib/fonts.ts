// lib/fonts.ts
// Amaç:    Cormorant Garamond (başlık) + Nunito (gövde) fontlarını next/font ile self-host eder
// Bağlı:   app/layout.tsx — tüm site tipografisi buradan gelir
// Risk:    Yanlış font yüklemesi → layout shift (CLS) + marka kimliği bozulur
// Dokunma: DESIGN_SYSTEM.md §3 — font seçimi değişmeden bu dosya değişmez
//
// Değişiklik (bu session — deneysel düzeltme): subsets listesine 'latin-ext' eklendi.
// Sebep: "Kâsem" içindeki â karakteri bir cihazda å'ya benzer render ediliyordu. 'latin'
// subset'i â'yı zaten içeriyor, bu yüzden bu değişikliğin kesin çözüm olacağı garanti
// edilemez — ama Türkçe aksanlı karakterlerin tam kapsanması için de gerekli, zararsız.
// Canlıda tekrar test edilmeli; sorun devam ederse başka bir kök neden aranmalı
// (örn. Cormorant Garamond'un kendi â glyph tasarımı, cihaz anti-aliasing'i).

import { Cormorant_Garamond, Nunito } from 'next/font/google'

export const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['700'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const nunito = Nunito({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600'],
  variable: '--font-nunito',
  display: 'swap',
})
