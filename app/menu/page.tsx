// app/menu/page.tsx
// Amaç:    menu-data.json'ı okuyup MenuCard grid'i olarak render eder
// Bağlı:   MenuCard.tsx, menu-data.json, types/index.ts
// Risk:    Veri boşsa kullanıcıya boş beyaz sayfa gösterilmemeli — edge case ele alındı
// Dokunma: CategoryNav.tsx / FilterPanel.tsx henüz bu sayfaya eklenmedi (Görev #3-4, ayrı adım)

import { MenuCard } from "@/components/menu/MenuCard"
import menuData from "@/lib/menu-data.json"
import { BowlItem } from "@/types"

export default function MenuPage() {
  const items = menuData as BowlItem[]

  if (items.length === 0) {
    return (
      <main className="px-4 py-12 text-center text-charcoal/70">
        Menü şu anda güncelleniyor, kısa süre sonra tekrar kontrol et.
      </main>
    )
  }

  return (
    <main className="px-4 py-8">
      <h1 className="mb-6 font-heading text-3xl text-olive-deep">Menü</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  )
                   }
