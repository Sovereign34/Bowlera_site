// lib/menu-filters.ts
// Amaç:    Menü sayfası kategori/alerjen/diyet filtreleme mantığını saf fonksiyonlar olarak sağlar
// Bağlı:   CategoryNav.tsx, FilterPanel.tsx, app/menu/page.tsx
// Risk:    Hatalı filtre mantığı → yanlış ürünler listelenir/gizlenir, kullanıcı doğru kaseyi bulamaz
// Dokunma: BowlItem tipi (types/index.ts) değişirse bu dosyadaki alan adları kontrol edilmeli.
//          Karar: CategoryNav sekmeleri BowlItem.category enum'unu GENİŞLETMEZ — "vegan" ve
//          "sicak-tahil" sekmeleri tags[] üzerinden sanal olarak filtrelenir (şema değişikliği yok).

import { BowlItem } from '@/types'

export type CategoryTabId = 'tumu' | 'imza' | 'sicak-tahil' | 'vegan' | 'icecek'
export type AllergenId = NonNullable<BowlItem['allergens']>[number]

interface FilterOption {
  id: string
  label: string
}

export const CATEGORY_TABS: { id: CategoryTabId; label: string }[] = [
  { id: 'tumu', label: 'Tümü' },
  { id: 'imza', label: 'İmza Kaseler' },
  { id: 'sicak-tahil', label: 'Sıcak Tahıl Kaseleri' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'icecek', label: 'İçecekler' },
]

export const ALLERGEN_FILTERS: FilterOption[] = [
  { id: 'gluten', label: 'Glüten' },
  { id: 'dairy', label: 'Laktoz' },
  { id: 'nuts', label: 'Kuruyemiş' },
  { id: 'soy', label: 'Soya' },
  { id: 'shellfish', label: 'Kabuklu Deniz Ürünü' },
]

// id === tags[] içindeki gerçek değer — ayrı bir "tag" alanına gerek yok (AGENT.md #5, gereksiz dolaylama önleme)
export const DIET_FILTERS: FilterOption[] = [
  { id: 'keto', label: 'Keto' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'yüksek protein', label: 'Yüksek Protein' },
  { id: 'düşük kalori', label: 'Düşük Kalori' },
]

/**
 * Aktif kategori sekmesine göre ürünleri filtreler.
 * Edge case: 'tumu' → hiç filtre uygulanmaz, tüm ürünler döner (varsayılan sekme —
 *            Oturum 2'de kabul edilmiş "sayfa yüklendiğinde tüm ürünler görünür" davranışını korur).
 * Edge case: 'vegan' ve 'sicak-tahil' category enum'unda yok → tags[] üzerinden eşlenir.
 * Edge case: eşleşen ürün yoksa boş dizi döner (crash yok, çağıran taraf boş state gösterir).
 */
export function filterByCategory(items: BowlItem[], tab: CategoryTabId): BowlItem[] {
  switch (tab) {
    case 'tumu':
      return items
    case 'imza':
      return items.filter((item) => item.category === 'signature')
    case 'icecek':
      return items.filter((item) => item.category === 'içecek')
    case 'vegan':
      return items.filter((item) => item.tags.includes('vegan'))
    // Not: menu-data.json'da bu etiket tire ile ('sıcak-tahıl') tanımlı — diğer tag'lerin
    // boşluklu kalıbından (örn. "yüksek protein") farklı, canlı veriyle doğrulandı (2026-07-18 bug fix).
    case 'sicak-tahil':
      return items.filter((item) => item.tags.includes('sıcak-tahıl'))
  }
}

/**
 * Seçili alerjenleri İÇEREN ürünleri dışlar (güvenli ürünleri gösterir).
 * Edge case: excluded boşsa → filtre uygulanmaz, tüm ürünler döner.
 * Edge case: item.allergens undefined ise → "alerjen bilgisi yok" = hiçbir alerjeni içermiyor
 *            varsayılır (BowlItem.allergens opsiyonel alan, MASTER_PLAN §5.5).
 */
export function filterByExcludedAllergens(items: BowlItem[], excluded: string[]): BowlItem[] {
  if (excluded.length === 0) return items
  return items.filter((item) => {
    const itemAllergens = item.allergens ?? []
    return !excluded.some((allergen) => itemAllergens.includes(allergen as AllergenId))
  })
}

/**
 * Seçili diyet etiketlerinin TÜMÜNÜ taşıyan ürünleri gösterir (AND mantığı — daraltma amaçlı).
 * Edge case: selectedTags boşsa → filtre uygulanmaz, tüm ürünler döner.
 * Edge case: birden fazla diyet etiketi seçilirse (örn. Keto + Vegan) → kesişim gösterilir,
 *            sonuç boş dönebilir; bu FilterPanel'in değil, üst bileşenin ("Sonuç yok" UI) sorumluluğudur.
 */
export function filterByDietTags(items: BowlItem[], selectedTags: string[]): BowlItem[] {
  if (selectedTags.length === 0) return items
  return items.filter((item) => selectedTags.every((tag) => item.tags.includes(tag)))
}
