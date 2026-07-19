// app/menu/page.tsx
// Amaç:    Menü sayfası — kategori sekmeleri (CategoryNav) + alerjen/diyet filtreleri (FilterPanel) + MenuCard grid
// Bağlı:   components/menu/{CategoryNav,FilterPanel,MenuCard}.tsx, lib/menu-filters.ts, lib/menu-data.json
// Risk:    Filtre state'i yanlış zincirlenirse kullanıcı olması gerekenden az/çok ürün görür;
//          kalori zorunlu alanı ayrıca MenuCard.tsx içinde garanti edilir (bu dosyanın sorumluluğu değil)
// Dokunma: lib/menu-filters.ts'teki filterByCategory/filterByExcludedAllergens/filterByDietTags imzaları
//          değişirse burası da güncellenmeli. useState eklendiği için dosya 'use client' oldu (önceden server component'ti).
//
// Değişiklik (bu session — DÜZELTME, kullanıcı onayıyla):
// Grid, sabit grid-cols-2/3/4 yerine auto-fill/minmax(Npx,1fr) örüntüsüne çevrildi.
// Gerekçe: MDN + CSS-Tricks + DEV Community kaynaklarının ortak standardı — kart genişliğine
// alt sınır garantisi vermek için repeat(auto-fill, minmax(Npx, 1fr)) kullanılır (kaynaklarda
// yaygın aralık 200-320px). Eski sabit sütun sayısı, FilterPanel sidebar'ının belirdiği `md`
// breakpoint'iyle sütun artışının çakıştığı orta genişlikteki ekranlarda kartları aşırı daraltıyordu.
// Bu değişiklik MenuCardImage.tsx'teki `sizes` düzeltmesiyle birlikte uygulanmalı (aynı KARAR BİLDİRİMİ).
//
// Değişiklik (bu session — İKİNCİ DÜZELTME, kullanıcı onayıyla):
// minmax alt sınırı 220px'ten 150px'e düşürüldü. Gerekçe: kullanıcı mobilde sütun sayısını sordu,
// Python ile gerçek telefon viewport genişlikleriyle (360-428px) hesaplandı — 220px alt sınırıyla
// mobilde 2 sütun için gereken 456px hiçbir telefon genişliğinde karşılanmıyordu, sonuç 1 sütuna
// düşüyordu (eski grid-cols-2 davranışını bozan öngörülmemiş bir yan etki). 150px, en dar telefonda
// (360px) bile 2 sütunu garanti eder: (360-32 padding-16 gap)/2 = 156px ≥ 150px.
//
// Değişiklik (bu session — ÜÇÜNCÜ DÜZELTME, kullanıcı onayıyla, araştırmayla doğrulandı):
// Mobilde 2 sütun yerine 1 sütun (tam genişlik kart) yapıldı. Gerekçe: kullanıcının mantıksal
// argümanı ("yemek ideal büyüklükte görünmeli") + araştırma bulgusu — Uber Eats/DoorDash gibi
// pazar yeri uygulamaları menü öğelerini tek sütun liste olarak gösteriyor; ayrıca kendi web
// sitesinde (Bowlera burada) platform kısıtı olmadığı için öne çıkan yemek görselleri tam
// genişlikte gösterilebilir — büyük/atmosferik görsel kullanma serbestisi var. Yüksek kaliteli
// menü fotoğrafının sipariş oranını %25-44 artırdığı birden fazla kaynakta tekrarlanıyor; küçük/
// sıkışık fotoğraf bu etkiyi zayıflatıyor. Uygulama: `sm:` (640px) öncesi grid-cols-1, sonrasında
// auto-fill/minmax(240px,1fr). Masaüstünde sütun sayısının sınırsız artmasını (önceki oturumda
// tespit edilen 7-sütun sorunu) önlemek için <main>'e max-w-7xl mx-auto eklendi.
//
// Değişiklik (bu session — DÖRDÜNCÜ DÜZELTME, kullanıcı onayıyla):
// Mobilde ürün kartları arasına CSS scroll-snap eklendi. Gerekçe: kullanıcı "menü kaydırma"
// deneyiminin kötü olduğunu belirtti — istenen davranış, TikTok/Instagram Reels tarzı, her
// kartın kaydırma bittiğinde dikeyde viewport'u dolduracak şekilde "yakalanması". Standart
// CSS scroll-snap-type/scroll-snap-align API'si kullanıldı (hack değil).
// Uygulama seçimi (KARAR BİLDİRİMİ ile kullanıcıya sunulan 2 seçenekten (b) onaylandı):
// app/layout.tsx'e dokunmadan (o dosya elimde yok, Kural #2), SADECE bu dosyadaki grid
// wrapper'ı kendi yüksekliği tanımlı, kendi kaydırmasına sahip bir "nested scroll" kutusuna
// çevrildi (h-[calc(100vh-4rem)] overflow-y-auto snap-y snap-mandatory). Her kart auto-rows
// ile aynı yüksekliğe (viewport - header) sahip bir satıra yerleştirilip flex ile dikeyde
// ortalandı, snap-start ile "durak" noktası oldu.
// ⚠️ ONAY BEKLEYEN VARSAYIM: 4rem (64px) değeri, önceki oturumlarda Header.tsx'in h-16 (64px)
// olduğu doğrulanmasına dayanıyor. Header sabit/sticky konumdaysa bu doğru offset'tir; değilse
// (normal akışta ise) değer 0 olmalı — canlıda görsel olarak doğrulanmalı, kesinlik garantisi
// verilmiyor.
// Sadece mobilde (sm öncesi, <640px) aktif — sm ve üzeri çoklu sütun grid'e döndüğünde snap
// otomatik devre dışı kalıyor (tek sütunda "TikTok" hissi anlamlı, çoklu sütunda değil).

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
          <div className="grid flex-1 grid-cols-1 auto-rows-[calc(100vh-4rem)] gap-4 h-[calc(100vh-4rem)] overflow-y-auto snap-y snap-mandatory sm:h-auto sm:auto-rows-auto sm:overflow-visible sm:snap-none sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex h-full snap-start items-center justify-center sm:h-auto sm:block"
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
