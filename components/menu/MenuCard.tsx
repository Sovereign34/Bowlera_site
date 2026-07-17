// components/menu/MenuCard.tsx
// Amaç:    Menü kartını tek bir BowlItem'dan kurar — Image/Badges/Info alt bileşenlerini birleştirir
// Bağlı:   MenuCardImage.tsx, MenuCardBadges.tsx, MenuCardInfo.tsx, menu-data.json, types/index.ts
// Risk:    Alt bileşenlere yanlış prop mapping → sessiz veri kaybı
// Dokunma: DESIGN_SYSTEM.md §2 (kart çerçevesi) — allergen satırı DESIGN_SYSTEM'de yoksa buradan kaldırılıp oraya taşınmalı
// NOT:     allergens alanı önceki 3 alt bileşende hiç render edilmiyordu (Badges sadece tags, Info sadece
//          kalori/protein/fiyat alıyor) — bu gerçek bir gap'ti. Aşağıda minimal bir satırla kapatıldı.

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
    </article>
  )
}
