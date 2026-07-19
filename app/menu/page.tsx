// app/menu/page.tsx
// Amaç:    Menü sayfası — kategori sekmeleri (CategoryNav) + alerjen/diyet filtreleri (FilterPanel) + MenuCard grid
// Bağlı:   components/menu/{CategoryNav,FilterPanel,MenuCard}.tsx, lib/menu-filters.ts, lib/menu-data.json
// Risk:    Filtre state'i yanlış zincirlenirse kullanıcı olması gerekenden az/çok ürün görür;
//          kalori zorunlu alanı ayrıca MenuCard.tsx içinde garanti edilir (bu dosyanın sorumluluğu değil)
// Dokunma: lib/menu-filters.ts'teki filterByCategory/filterByExcludedAllergens/filterByDietTags imzaları
//          değişirse burası da güncellenmeli.
//
// Değişiklik (bu session — DÜZELTME, kullanıcı onayıyla):
// Grid, sabit grid-cols-2/3/4 yerine auto-fill/minmax(Npx,1fr) örüntüsüne çevrildi.
// Gerekçe: MDN + CSS-Tricks + DEV Community kaynaklarının ortak standardı — kart genişliğine
// alt sınır garantisi vermek için repeat(auto-fill, minmax(Npx, 1fr)) kullanılır (kaynaklarda
// yaygın aralık 200-320px). Eski sabit sütun sayısı, FilterPanel sidebar'ının belirdiği `md`
// breakpoint'iyle sütun artışının çakıştığı orta genişlikteki ekranlarda kartları aşırı daraltıyordu.
//
// Değişiklik (bu session — İKİNCİ DÜZELTME, kullanıcı onayıyla):
// minmax alt sınırı 220px'ten 150px'e düşürüldü — mobilde 2 sütun garantisi için.
//
// Değişiklik (bu session — ÜÇÜNCÜ DÜZELTME, kullanıcı onayıyla, araştırmayla doğrulandı):
// Mobilde 2 sütun yerine 1 sütun (tam genişlik kart) yapıldı — Uber Eats/DoorDash örüntüsü +
// yüksek kaliteli menü fotoğrafının sipariş oranını artırdığı araştırma bulgusu. `sm:` (640px)
// öncesi grid-cols-1, sonrasında auto-fill/minmax(240px,1fr). <main>'e max-w-7xl mx-auto eklendi.
//
// ⚠️ ACİL GERİ ALMA (bu session — DÖRDÜNCÜ ve BEŞİNCİ düzeltmelerin İKİSİ DE geri alındı):
// Mobil scroll-snap denemesi iki kez canlıda kırıldı: önce CategoryNav/h1/FilterPanel
// yüksekliği hesaba katılmadan sabit calc() ile (4. düzeltme), sonra flex-1/min-h-0 + items-center
// wrapper'ı `MenuCard.tsx` HİÇ GÖRÜLMEDEN yazıldığı için kart görünmez hale geldi (5. düzeltme —
// AGENT.md Kural #2 ihlali: eksik dosyayla çözüm üretildi). Site canlıda ikinci kez bozulduğu için
// KULLANICI ONAYI BEKLENMEDEN (BÜTÜNLÜK > her şey — canlı kırık kalamaz) bu ÜÇÜNCÜ düzeltme
// sonrası bilinen-iyi duruma (snap-scroll'suz, sade grid) dönüldü. Scroll-snap tekrar denenecekse
// önce `MenuCard.tsx` görülmeli — yeni Açık Sorun olarak SESSION_INDEX.md'ye eklenmeli.

'use client'

import { useState, useMemo } from 'react'
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

  const filteredItems = useMemo(() => {
    const byCategory = filterByCategory(items, activeTab)
    const byAllergen = filterByExcludedAllergens(byCategory, excludedAllergens)
    return filterByDietTags(byAllergen, selectedDietTags)
  }, [items, activeTab, excludedAllergens, selectedDietTags])

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
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
