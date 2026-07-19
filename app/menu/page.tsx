// app/menu/page.tsx
// Amaç:    Menü sayfası — kategori sekmeleri (CategoryNav) + alerjen/diyet filtreleri (FilterPanel) + MenuCard grid
// Bağlı:   components/menu/{CategoryNav,FilterPanel,MenuCard}.tsx, lib/menu-filters.ts, lib/menu-data.json
// Risk:    Filtre state'i yanlış zincirlenirse kullanıcı olması gerekenden az/çok ürün görür;
//          kalori zorunlu alanı ayrıca MenuCard.tsx içinde garanti edilir (bu dosyanın sorumluluğu değil)
// Dokunma: lib/menu-filters.ts'teki filterByCategory/filterByExcludedAllergens/filterByDietTags imzaları
//          değişirse burası da güncellenmeli. useState eklendiği için dosya 'use client' oldu (önceden server component'ti).
//          Mobil yükseklik zinciri artık flex-1/min-h-0'a dayanıyor: <main> → sarmalayıcı div → kart kutusu.
//          Bu zincirdeki HERHANGİ bir halka flex-col/flex-1/min-h-0'dan çıkarılırsa kart kutusu
//          yükseklik alamaz ve snap-scroll çöker.
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
// Değişiklik (bu session — DÖRDÜNCÜ DÜZELTME, kullanıcı onayıyla) — SONRADAN HATALI ÇIKTI, bkz. BEŞİNCİ DÜZELTME:
// Mobilde ürün kartları arasına CSS scroll-snap eklendi. `h-[calc(100vh-4rem)]` yaklaşımı
// SADECE Header yüksekliğini (4rem) düşüyordu, CategoryNav/h1/FilterPanel'in kendi render
// yüksekliklerini hesaba katmıyordu — canlıda kartların üstünde/altında büyük boş alan olarak
// ortaya çıktı (kullanıcı ekran görüntüsüyle bildirdi).
//
// Değişiklik (bu session — BEŞİNCİ DÜZELTME / BUGFİX, kullanıcı onayıyla):
// ⚠️ Kural sapması tespit edildi ve düzeltildi: sabit piksel tahmini yaklaşımının doğası —
// her yeni kardeş eleman (CategoryNav, h1, FilterPanel) ayrı bir tahmin gerektiriyordu, kırılgandı.
// Çözüm: sabit calc() hesabı TERK EDİLDİ, flexbox'un "kalan alanı otomatik doldurma" mantığına
// geçildi. <main> artık h-[calc(100dvh-4rem)] flex flex-col (SADECE bu tek varsayım kalıyor —
// Header'ın h-16 olduğu önceki oturumlarda doğrulanmıştı). h1, CategoryNav-sarmalayıcı ve
// FilterPanel-sarmalayıcı shrink-0 ile doğal yüksekliklerini koruyor (CategoryNav.tsx/
// FilterPanel.tsx dosyalarının kendisine dokunulmadı — Kural #5). Kart kutusu flex-1 min-h-0
// ile GERÇEKTE kalan alanı dolduruyor — kardeş elemanların yüksekliği ne olursa olsun doğru
// çalışır, ikinci bir sabit piksel tahmini eklenmedi.
// 100vh yerine 100dvh kullanıldı (mobil tarayıcı adres çubuğu kayması `100vh`'de hatalı boşluk
// yaratabiliyor, `100dvh` gerçek görünür alanı yansıtır).
// Grid yerine flex flex-col'a geçildi (grid'in auto-rows hesabı da aynı sabit-tahmin sorununu
// taşıyordu) — her kart artık `h-full shrink-0` ile kutunun tam yüksekliğini alıyor (yüzde
// yükseklik, ancak kart kutusunun kendisi definite height aldığı için — flex-1 min-h-0 zinciri
// sayesinde — çalışır).
// Kullanıcı ayrıca snap-scroll GEÇİŞİNİN düzgün/kesintisiz olmasını istedi: her karta
// `[scroll-snap-stop:always]` eklendi (hızlı "flick" kaydırmalarda bir kartın atlanmasını
// engeller — her kart tek tek "yakalanır"), kart kutusuna `scroll-smooth` eklendi. İkisi de
// `motion-reduce:` varyantıyla eşleştirildi (`motion-reduce:scroll-auto`) — YASAK LİSTE
// "prefers-reduced-motion kontrolü olmadan animasyon yaz" kuralı gereği.
// Sadece mobilde (sm öncesi, <640px) aktif — sm ve üzeri masaüstü grid'e döndüğünde tüm bu
// sınıflar (flex/height/snap/scroll-smooth) sm: varyantlarıyla sıfırlanıyor.

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
                className="flex h-full w-full shrink-0 snap-start [scroll-snap-stop:always] items-center justify-center sm:h-auto sm:w-auto sm:shrink"
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
