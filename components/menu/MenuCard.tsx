// components/menu/MenuCard.tsx
// Amaç:    Menü kartını tek bir BowlItem'dan kurar — Image/Badges/Info alt bileşenlerini birleştirir
// Bağlı:   MenuCardImage.tsx, MenuCardBadges.tsx, MenuCardInfo.tsx, menu-data.json, types/index.ts
// Risk:    Alt bileşenlere yanlış prop mapping → sessiz veri kaybı
// Dokunma: DESIGN_SYSTEM.md §2 (kart çerçevesi) — allergen satırı DESIGN_SYSTEM'de yoksa buradan kaldırılıp oraya taşınmalı
// NOT:     allergens alanı önceki 3 alt bileşende hiç render edilmiyordu — minimal bir satırla kapatıldı.
// Değişiklik (bu session — DÜZELTME): Karar #7/#8 geri alındı. "Özelleştir" butonu artık TÜM
// imza kaselerde değil, SADECE category === "build-your-own" olan tek üründe ("Benim Kâsem")
// gösteriliyor. Bu ürün menu-data.json'a henüz eklenmedi (fiyat bekleniyor) — eklenene kadar
// hiçbir kartta buton görünmeyecek, bu kasıtlı ve güvenli bir ara durum.

import Link from "next/link"
import { MenuCardImage } from "./MenuCardImage"
import { MenuCardBadges } from "./MenuCardBadges"
import { MenuCardInfo } from "./MenuCardInfo"
import { BowlItem } from "@/types"

const ALLERGEN_LABELS: Record<string, string> = {
  gluten: "Gluten",
  dairy: "Süt",
  nuts: "Kuruyemiş",
  soy: "Soya",
  shellfish: "Kabuklu Deniz Ürünü",
}

export function MenuCard({ item }: { item: BowlItem }) {
  const isCustomizable = item.category === "build-your-own"

  return (
    <article className="flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-black/5">
      <MenuCardImage image={item.image} name={item.name} tags={item.tags} />
      <MenuCardBadges tags={item.tags} />
      {item.allergens && item.allergens.length > 0 && (
        <p className="px-1 text-xs font-body text-charcoal/70">
          İçerir: {item.allergens.map((a) => ALLERGEN_LABELS[a]).join(", ")}
        </p>
      )}
      <MenuCardInfo
        name={item.name}
        calories={item.calories}
        protein={item.protein}
        price={item.price}
      />
      {isCustomizable && (
        <Link
          href={`/menu/customize/${item.id}`}
          className="mx-1 mb-1 rounded-full border border-olive-primary px-4 py-2 text-center
                     font-body text-sm font-semibold text-olive-primary transition-colors duration-200
                     hover:bg-olive-primary/10"
        >
          Özelleştir
        </Link>
      )}
    </article>
  )
}
