// components/menu/MenuCardImage.tsx
// Amaç:    Kart fotoğrafını ve (varsa) "Süper Gıda" logo-degrade rozetini render eder
// Bağlı:   MenuCard.tsx
// Risk:    Yanlış aspect-ratio → CLS (Core Web Vitals ihlali)
// Dokunma: DESIGN_SYSTEM.md §2.1 — logo degrade sadece 4 izinli yerden biri burada kullanılıyor
//
// Değişiklik (bu session — DÜZELTME, kullanıcı onayıyla):
// `sizes` değeri sabit "300px" yerine grid'in gerçek breakpoint davranışına eşitlendi.
// Gerekçe: Next.js resmi dokümantasyonu, sizes'ın görselin gerçek render edilen genişliğine
// eşleşmesi gerektiğini belirtiyor — aksi halde tarayıcı olduğundan büyük/küçük görsel indirir.
// Bu, page.tsx'teki grid-cols-[repeat(auto-fill,minmax(220px,1fr))] değişikliğiyle birlikte
// uygulanmalı (aynı KARAR BİLDİRİMİ, tek problem/tek çözüm kuralı gereği iki ayrı dosya).
//
// Değişiklik (bu session — İKİNCİ DÜZELTME, kullanıcı onayıyla):
// `sizes` mobilde 50vw yerine 100vw yapıldı. Gerekçe: page.tsx'te grid mobilde (sm öncesi,
// <640px) grid-cols-1'e çevrildi — kart artık tam genişlik, görsel de tam genişlik render
// ediliyor. sm ve üzeri auto-fill/minmax(240px,1fr) davranışı için 33vw/25vw tahmini korundu
// (gerçek sütun sayısı içerik miktarına göre değiştiğinden kesin değer verilemiyor, Next.js'in
// kendi örnek formatına uygun bir yaklaşık değer kullanıldı).

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
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
      />
      {isSuperFood && (
        <span className="absolute top-2 left-2 rounded-full bg-[linear-gradient(135deg,#8A2387_0%,#E94057_50%,#F27121_100%)] px-3 py-1 text-xs font-body font-semibold text-white">
          Süper Gıda
        </span>
      )}
    </div>
  )
}
