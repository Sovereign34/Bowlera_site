// components/home/HeroImagePlaceholder.tsx
// Amaç:    Gerçek kase fotoğrafı gelene kadar marka paletiyle tutarlı yer tutucu gösterir
// Bağlı:   Hero.tsx
// Risk:    Kalıcı olarak unutulursa lansmana çıkılamaz — SESSION_INDEX.md Açık Sorun #2'ye bağlı
// Dokunma: Gerçek görsel geldiğinde next/image + priority flag ile değiştirilecek (ARCHITECTURE §4.2)

export function HeroImagePlaceholder() {
  return (
    <div
      className="aspect-square rounded-3xl bg-gradient-to-br from-olive-deep/20 via-bronze/20 to-olive-primary/20
                 border border-olive-primary/20 flex items-center justify-center"
      role="img"
      aria-label="Bowlera kase görseli — yakında eklenecek"
    >
      <span className="font-body text-sm text-espresso/60">
        Kase fotoğrafı yakında — 90° flat-lay (DESIGN_SYSTEM.md §5)
      </span>
    </div>
  )
}
