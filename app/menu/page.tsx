// app/menu/page.tsx
// Amaç:    Menü sayfası — kategori sekmeleri (CategoryNav) + alerjen/diyet filtreleri (FilterPanel) + MenuCard grid
// Bağlı:   components/menu/{CategoryNav,FilterPanel,MenuCard}.tsx, lib/menu-filters.ts, lib/menu-data.json, framer-motion
// Risk:    Filtre state'i yanlış zincirlenirse kullanıcı olması gerekenden az/çok ürün görür;
//          kalori zorunlu alanı ayrıca MenuCard.tsx içinde garanti edilir (bu dosyanın sorumluluğu değil)
// Dokunma: lib/menu-filters.ts'teki filterByCategory/filterByExcludedAllergens/filterByDietTags imzaları
//          değişirse burası da güncellenmeli.
//
// Değişiklik (bu session — DÜZELTME, kullanıcı onayıyla): grid-cols sabitten auto-fill/minmax'e çevrildi.
// Değişiklik (bu session — İKİNCİ DÜZELTME, kullanıcı onayıyla): minmax alt sınırı 150px.
// Değişiklik (bu session — ÜÇÜNCÜ DÜZELTME, kullanıcı onayıyla): mobilde tek sütun, tam genişlik kart.
//
// ⚠️ MOBİL SNAP-SCROLL DENEMESİ 3 KEZ CANLIDA KIRILDI, TERK EDİLDİ — bkz. git geçmişi / önceki
// session_log bloğu. Kök neden: FilterPanel'in (uzun, 9 checkbox) inline gösterimiyle "sayfa tam
// viewport'a sığsın" mimarisi birlikte çalışmıyordu. Yeniden gündeme gelmeden önce FilterPanel'in
// katlanabilir/drawer yapılması gibi bir ürün kararı gerekiyor.
//
// Değişiklik (bu session — YEDİNCİ DÜZELTME / ÖZELLİK, DESIGN_SYSTEM.md §6.1 görülüp kullanıcı
// onayıyla): Snap-scroll'un yerine DESIGN_SYSTEM.md §6.1'deki "Bölüm başlıkları/kartlar
// (scroll reveal)" satırı birebir uygulandı — kart, %10'u viewport'a girince alttan fade+slide
// ile beliriyor, 500ms `ease-out`, TEK SEFERLİK (`viewport={{ once: true }}`, DESIGN_SYSTEM §6.2
// kuralı). Sadece `opacity`+`transform` animasyonlu (width/height/top yok → CLS riski yok,
// §6.2 kural 2). `useReducedMotion()` ile `prefers-reduced-motion` kontrolü yapılıyor — aktifse
// kayma mesafesi 0'a, süre 0'a iniyor (§6.2 kural 1). Yükseklik/flex/snap mimarisine
// DOKUNULMADI — önceki 3 kırılmanın kaynağı olan kısım bu çözümde hiç yok.

'use client'

import { useState, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MenuCard } from '@/components/menu/MenuCard'
import { CategoryNav } from '@/components/menu/CategoryNav'
import { FilterPanel } from '@/components/menu/FilterPanel'
import menuData from '@/lib/menu-data.json'
import { BowlItem } from '@/types'
import {
  filterByCategory,
  filterByExcludedAllergens,
  filterByDietTags,
  type CategoryTabId,
} from '@/lib/menu-filters'

export default function MenuPage() {
  const items = menuData as BowlItem[]
  const [activeTab, setActiveTab] = useState<CategoryTabId>('tumu')
  const [excludedAllergens, setExcludedAllergens] = useState<string[]>([])
  const [selectedDietTags, setSelectedDietTags] = useState<string[]>([])
  const shouldReduceMotion = useReducedMotion()

  const filteredItems = useMemo(() => {
    const byCategory = filterByCategory(items, activeTab)
    const byAllergen = filterByExcludedAllergens(byCategory, excludedAllergens)
    return filterByDietTags(byAllergen, selectedDietTags)
  }, [items, activeTab, excludedAllergens, selectedDietTags])

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: { opacity: 1, y: 0 },
  }
  const cardTransition = { duration: shouldReduceMotion ? 0 : 0.5, ease: 'easeOut' as const }

  if (items.length === 0) {
    return (
      <main className="px-4 py-12 text-center text-charcoal/70">
        Menü şu anda güncelleniyor, kısa süre sonra tekrar kontrol et.
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 font-heading text-3xl text-olive-deep">Menü</h1>

      <CategoryNav activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6 flex flex-col gap-6 md:flex-row">
        <FilterPanel
          excludedAllergens={excludedAllergens}
          onExcludedAllergensChange={setExcludedAllergens}
          selectedDietTags={selectedDietTags}
          onDietTagsChange={setSelectedDietTags}
        />

        {filteredItems.length === 0 ? (
          <p className="flex-1 py-12 text-center text-charcoal/70">
            Bu filtrelerle eşleşen ürün yok — filtreleri temizlemeyi dene.
          </p>
        ) : (
          <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={cardVariants}
                transition={cardTransition}
              >
                <MenuCard item={item} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
