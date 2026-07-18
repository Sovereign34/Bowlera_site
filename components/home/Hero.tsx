// components/home/Hero.tsx
// Amaç:    Ana sayfa açılış bölümü — başlık (slogan), CTA'lar, kase görseli
// Bağlı:   app/page.tsx
// Risk:    Yanlış CTA hedefi → kullanıcı customizer/menüye ulaşamaz; LCP burada ölçülür
// Dokunma: DESIGN_SYSTEM.md §6.1 (Hero animasyonu) · gerçek kase fotoğrafı gelene kadar
//          placeholder kullanılır (Açık Sorun #2 — SESSION_INDEX.md)
//          Bu session: ayrı slogan satırı kaldırıldı — slogan artık HeroHeadline.tsx içinde
//          ana başlık (h1) olarak render ediliyor, tekrarı önlemek için burada duplicate yok.

import Link from 'next/link'
import { HeroHeadline } from './HeroHeadline'
import { HeroImagePlaceholder } from './HeroImagePlaceholder'

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <HeroHeadline />
        <p className="mt-4 font-body text-espresso max-w-md">
          Doğrudan yerel çiftçilerden aldığımız taze malzemelerle, senin kurallarınla
          hazırlanan sağlıklı kaseler.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/menu/customize"
            className="rounded-full bg-olive-primary text-cream px-6 py-3 font-body font-semibold
                       hover:border-2 hover:border-transparent hover:bg-logo-gradient transition-colors duration-200"
          >
            Kâseni Yarat
          </Link>
          <Link
            href="/menu"
            className="rounded-full border border-olive-primary text-olive-primary px-6 py-3 font-body font-semibold
                       hover:bg-olive-primary/10 transition-colors duration-200"
          >
            Menüyü Keşfet
          </Link>
        </div>
      </div>
      <HeroImagePlaceholder />
    </section>
  )
}
