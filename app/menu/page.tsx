// app/menu/page.tsx
// Amaç:    Menü sayfası — kategori sekmeleri (CategoryNav) + alerjen/diyet filtreleri (FilterPanel) + MenuCard grid
// Bağlı:   components/menu/{CategoryNav,FilterPanel,MenuCard,MenuCardImage}.tsx, lib/menu-filters.ts, lib/menu-data.json
// Risk:    Filtre state'i yanlış zincirlenirse kullanıcı olması gerekenden az/çok ürün görür;
//          kalori zorunlu alanı ayrıca MenuCard.tsx içinde garanti edilir (bu dosyanın sorumluluğu değil)
// Dokunma: lib/menu-filters.ts'teki filterByCategory/filterByExcludedAllergens/filterByDietTags imzaları
//          değişirse burası da güncellenmeli. useState eklendiği için dosya 'use client' oldu (önceden server component'ti).
//          Mobil yükseklik zinciri flex-1/min-h-0'a dayanıyor: <main> → sarmalayıcı div → kart kutusu.
//          Bu zincirdeki HERHANGİ bir halka flex-col/flex-1/min-h-0'dan çıkarılırsa kart kutusu
//          yükseklik alamaz ve snap-scroll çöker. Kart sarmalayıcısı `flex-col` OLMAK ZORUNDA —
//          `flex-row` (varsayılan) + `justify-center` kombinasyonu kartı yatayda sıfıra küçültür
//          (bkz. aşağıdaki ALTINCI DÜZELTME notu, bu tam olarak canlıda yaşanan hataydı).
//
// Değişiklik (bu session — DÜZELTME, kullanıcı onayıyla):
// Grid, sabit grid-cols-2/3/4 yerine auto-fill/minmax(Npx,1fr) örüntüsüne çevrildi.
//
// Değişiklik (bu session — İKİNCİ DÜZELTME, kullanıcı onayıyla):
// minmax alt sınırı 220px'ten 150px'e düşürüldü — mobilde 2 sütun garantisi için.
//
// Değişiklik (bu session — ÜÇÜNCÜ DÜZELTME, kullanıcı onayıyla, araştırmayla doğrulandı):
// Mobilde 2 sütun yerine 1 sütun (tam genişlik kart) yapıldı — Uber Eats/DoorDash örüntüsü +
// yüksek kaliteli menü fotoğrafının sipariş oranını artırdığı araştırma bulgusu. `sm:` (640px)
// öncesi grid-cols-1, sonrasında auto-fill/minmax(240px,1fr). <main>'e max-w-7xl mx-auto eklendi.
//
// Değişiklik (bu session — DÖRDÜNCÜ DÜZELTME) — HATALI ÇIKTI, geri alındı:
// Sabit `h-[calc(100vh-4rem)]` — CategoryNav/h1/FilterPanel yüksekliği hesaba katılmadı,
// kartların üstünde/altında boşluk oluştu.
//
// Değişiklik (bu session — BEŞİNCİ DÜZELTME) — HATALI ÇIKTI, geri alındı:
// flex-1/min-h-0 zincirine geçildi (doğru yaklaşım) ama kart sarmalayıcısı `MenuCard.tsx`/
// `MenuCardImage.tsx` HİÇ GÖRÜLMEDEN `items-center justify-center` (flex-row varsayılanıyla)
// yazıldı — AGENT.md Kural #2 ihlali. Sonuç: `justify-center` ana eksende (yatay, çünkü
// flex-row) kartı içerik genişliğine küçültüp ortaladı, kart görünmez oldu (canlıda "Kase"
// yazısı + iki ince dikey şerit olarak görüldü). Site canlıda bozulduğu için kullanıcı onayı
// beklenmeden ÜÇÜNCÜ düzeltme sonrası bilinen-iyi hale (sade grid, snap yok) acil geri alındı.
//
// Değişiklik (bu session — ALTINCI DÜZELTME, `MenuCard.tsx` + `MenuCardImage.tsx` görülüp
// doğrulandıktan SONRA, kullanıcı onayıyla):
// BEŞİNCİ düzeltmenin flex-1/min-h-0 mantığı doğruydu, sadece kart sarmalayıcısının ekseni
// yanlıştı. Düzeltme: kart sarmalayıcısına `flex-col` eklendi (`items-center` KALDIRILDI).
// Artık çapraz eksen (yatay) varsayılan `items-stretch` ile kart tam genişliği otomatik alıyor —
// bu da `MenuCardImage.tsx`'teki `aspect-square w-full`'un ebeveyn genişliğinden doğru şekilde
// beslenmesini sağlıyor. Ana eksen (dikey) `justify-center` ile kart, snap kutusunun içinde
// dikeyde ortalanıyor (kart kendi doğal yüksekliğinde kalır, DoorDash/Reels tarzı "bir kart =
// bir ekran" hissi böyle oluşuyor). `<main>` h-[calc(100dvh-4rem)] flex flex-col (SADECE Header
// yüksekliği — 4rem — varsayımı, önceki oturumlarda doğrulandı) — h1/CategoryNav-sarmalayıcı/
// FilterPanel-sarmalayıcı shrink-0, kart kutusu flex-1 min-h-0 ile kalan alanı dolduruyor.
// 100vh yerine 100dvh (mobil adres çubuğu kaymasına karşı). Her karta `[scroll-snap-stop:always]`
// (hızlı flick'te kart atlanmasın diye) ve kart kutusuna `scroll-smooth motion-reduce:scroll-auto`
// (YASAK LİSTE — prefers-reduced-motion kontrolsüz animasyon yasağı gereği) eklendi.
// Sadece mobilde (sm öncesi, <640px) aktif — sm ve üzeri tüm bu sınıflar sm: varyantlarıyla
// sıfırlanıp eski çoklu-sütun grid'e dönülüyor.

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
    <main className="mx-auto flex h-[calc(100dvh-4rem)] max-w-7xl flex-col overflow-hidden px-4 py-8 sm:h-auto sm:overflow-visible">
      <h1 className="mb-6 shrink-0 font-heading text-3xl text-olive-deep">Menü</h1>

      <div className="shrink-0">
        <CategoryNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="mt-6 flex min-h-0 flex-1 flex-col gap-6 sm:h-auto sm:min-h-0 sm:flex-none md:flex-row">
        <div className="shrink-0 sm:shrink">
          <FilterPanel
            excludedAllergens={excludedAllergens}
            onExcludedAllergensChange={setExcludedAllergens}
            selectedDietTags={selectedDietTags}
            onDietTagsChange={setSelectedDietTags}
          />
        </div>

        {filteredItems.length === 0 ? (
          <p className="flex-1 py-12 text-center text-charcoal/70">
            Bu filtrelerle eşleşen ürün yok — filtreleri temizlemeyi dene.
          </p>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto scroll-smooth motion-reduce:scroll-auto snap-y snap-mandatory sm:h-auto sm:min-h-0 sm:flex-none sm:snap-none sm:overflow-visible sm:grid sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex h-full w-full shrink-0 flex-col justify-center snap-start [scroll-snap-stop:always] sm:h-auto sm:w-auto sm:shrink sm:block"
              >
                <MenuCard item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
