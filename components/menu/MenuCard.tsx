// components/menu/MenuCardImage.tsx
// Amaç:    Kart fotoğrafını ve (varsa) "Süper Gıda" logo-degrade rozetini render eder
// Bağlı:   MenuCard.tsx
// Risk:    Yanlış aspect-ratio → CLS (Core Web Vitals ihlali)
// Dokunma: DESIGN_SYSTEM.md §2.1 — logo degrade sadece 4 izinli yerden biri burada kullanılıyor

import Image from "next/image"

const SUPER_FOOD_TAGS = ["vegan", "yüksek protein", "düşük kalori"]

export function MenuCardImage({
  image,
  name,
  tags,
}: {
  image: string
  name: string
  tags: string[]
}) {
  const isSuperFood = tags.some((tag) => SUPER_FOOD_TAGS.includes(tag))

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-cream">
      <Image
        src={`/images/${image}`}
        alt={name}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, 300px"
      />
      {isSuperFood && (
        <span className="absolute top-2 left-2 rounded-full bg-[linear-gradient(135deg,#8A2387_0%,#E94057_50%,#F27121_100%)] px-3 py-1 text-xs font-body font-semibold text-white">
          Süper Gıda
        </span>
      )}
    </div>
  )
}
