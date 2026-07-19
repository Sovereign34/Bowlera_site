// app/menu/page.tsx
// Amaç:    Menü sayfası — kategori sekmeleri (CategoryNav) + alerjen/diyet filtreleri (FilterPanel) + MenuCard grid
// Bağlı:   components/menu/{CategoryNav,FilterPanel,MenuCard}.tsx, lib/menu-filters.ts, lib/menu-data.json, framer-motion
// Risk:    Filtre state'i yanlış zincirlenirse kullanıcı olması gerekenden az/çok ürün görür;
//          kalori zorunlu alanı ayrıca MenuCard.tsx içinde garanti edilir (bu dosyanın sorumluluğu değil)
// Dokunma: lib/menu-filters.ts'teki filterByCategory/filterByExcludedAllergens/filterByDietTags imzaları
//          değişirse burası da güncellenmeli.
//
// Değişiklik (önceki session — DÜZELTME, kullanıcı onayıyla): grid-cols sabitten auto-fill/minmax'e çevrildi.
// Değişiklik (önceki session — İKİNCİ DÜZELTME, kullanıcı onayıyla): minmax alt sınırı 150px.
// Değişiklik (önceki session — ÜÇÜNCÜ DÜZELTME, kullanıcı onayıyla): mobilde tek sütun, tam genişlik kart.
//
// ⚠️ MOBİL SNAP-SCROLL DENEMESİ 3 KEZ CANLIDA KIRILDI, TERK EDİLDİ — bkz. git geçmişi / önceki
// session_log bloğu. Kök neden: FilterPanel'in (uzun, 9 checkbox) inline gösterimiyle "sayfa tam
// viewport'a sığsın" mimarisi birlikte çalışmıyordu. Yeniden gündeme gelmeden önce FilterPanel'in
// katlanabilir/drawer yapılması gibi bir ürün kararı gerekiyor.
//
// Değişiklik (önceki session — YEDİNCİ DÜZELTME / ÖZELLİK, DESIGN_SYSTEM.md §6.1 görülüp kullanıcı
// onayıyla): Snap-scroll'un yerine DESIGN_SYSTEM.md §6.1'deki "Bölüm başlıkları/kartlar
// (scroll reveal)" satırı birebir uygulandı — kart, %10'u viewport'a girince alttan fade+slide
// ile beliriyor, 500ms `ease-out`, TEK SEFERLİK (`viewport={{ once: true }}`, DESIGN_SYSTEM §6.2
// kuralı). Sadece `opacity`+`transform` animasyonlu (width/height/top yok → CLS riski yok,
// §6.2 kural 2). `useReducedMotion()` ile `prefers-reduced-motion` kontrolü yapılıyor — aktifse
// kayma mesafesi 0'a, süre 0'a iniyor (§6.2 kural 1). Yükseklik/flex/snap mimarisine
// DOKUNULMADI — önceki 3 kırılmanın kaynağı olan kısım bu çözümde hiç yok.
//
// Değişiklik (önceki tur — DÜZELTME, kullanıcı onayıyla, "kart geçişlerine etkileyici animasyon"
// talebi): Scroll-reveal'a HAFİF SCALE (0.96→1) + INDEX BAZLI STAGGER (kademeli gecikme) eklendi.
// Stagger, satır başına `index % 6` ile sınırlandı — büyük gridlerde gecikmenin absürt uzamasını
// önlemek için (her satır kendi içinde 0/0.06/0.12.../0.30sn gecikmeyle sırayla beliriyor).
//
// Değişiklik (BU SESSION — İKİNCİ DÜZELTME, kullanıcı onayıyla, "biraz daha artırmalısın" talebi):
// Değerler tekrar büyütüldü — `y: 40→64`, `scale: 0.92→0.85`, süre `0.6s→0.75s`. Hâlâ SADECE
// `opacity`+`transform` (§6.2 kural 2 korunuyor). `useReducedMotion()` aktifken hepsi 0'a/1'e
// sabitleniyor (§6.2 kural 1 korunuyor). Grid/height/FilterPanel yapısına DOKUNULMADI.

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
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 64,
      scale: shouldReduceMotion ? 1 : 0.85,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  }

  // Satır başına stagger: index % 6 ile sınırlandı, her kart 0.06sn arayla beliriyor.
  // (6, grid'in en geniş breakpoint'inde muhtemel sütun sayısını aşacak şekilde güvenli bir üst sınır;
  // gerçek sütun sayısı auto-fill/minmax olduğu için build-time'da bilinmiyor, bu yüzden sabit tutuldu.)
  const getCardTransition = (index: number) => ({
    duration: shouldReduceMotion ? 0 : 0.75,
    ease: 'easeOut' as const,
    delay: shouldReduceMotion ? 0 : Math.min(index % 6, 5) * 0.08,
  })

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
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={cardVariants}
                transition={getCardTransition(index)}
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
