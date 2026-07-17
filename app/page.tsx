// app/page.tsx
// Amaç:    Ana Sayfa — Oturum 1 kapsamında yalnızca Hero render edilir
// Bağlı:   app/layout.tsx
// Risk:    Yok (statik içerik)
// Dokunma: Değer Önerisi/Öne Çıkan Ürünler/Sosyal Kanıt bölümleri Oturum 2+ kapsamında eklenecek
//          (MASTER_PLAN.md §3.1 — menu-data.json hazır olmadan "Öne Çıkan Ürünler" eklenemez)

import { Hero } from '@/components/home/Hero'

export default function HomePage() {
  return <Hero />
}
