// lib/customizer-pricing.ts
// Amaç:    Customizer seçimlerinden fiyat/kalori/protein/karbonhidrat/yağ toplamını hesaplayan saf fonksiyonlar
// Bağlı:   store/useCustomizerStore.ts (getTotals), components/customizer/SummaryPanel.tsx (Oturum 4)
// Risk:    Burada hata olursa müşteriye yanlış fiyat/kalori gösterilir veya sepete yanlış tutar geçer
// Dokunma: CUSTOMIZER_SPEC.md §4 (Canlı Fiyat/Kalori Hesaplama) — kural değişmeden kod değişmemeli

import type {
  CustomizerCatalog,
  CustomizerComponentItem,
  CustomizerSelection,
  CustomizerTotals,
} from "@/types"

const findById = (items: CustomizerComponentItem[], id: string | null) =>
  id ? items.find((item) => item.id === id) ?? null : null

const isItem = (item: CustomizerComponentItem | null): item is CustomizerComponentItem => item !== null

// Garden: avokado her zaman ücretli, diğerlerinden ilk 4'ü ücretsiz (CUSTOMIZER_SPEC.md §4)
export function splitGardenPricing(selectedIds: string[], catalog: CustomizerCatalog) {
  const selected = selectedIds.map((id) => findById(catalog.gardenItems, id)).filter(isItem)
  const avocado = selected.filter((item) => item.id === "avocado")
  const others = selected.filter((item) => item.id !== "avocado")
  return { free: others.slice(0, 4), paid: [...others.slice(4), ...avocado], all: selected }
}

// Finish: ilk 1 ücretsiz, sonrası ücretli (CUSTOMIZER_SPEC.md §4)
export function splitFinishPricing(selectedIds: string[], catalog: CustomizerCatalog) {
  const selected = selectedIds.map((id) => findById(catalog.finishItems, id)).filter(isItem)
  return { free: selected.slice(0, 1), paid: selected.slice(1), all: selected }
}

const sumField = (items: CustomizerComponentItem[], field: keyof CustomizerComponentItem) =>
  items.reduce((total, item) => total + (Number(item[field]) || 0), 0)

// extras.extraAvocado, garden'daki "avocado" seçiminden ayrı bir state alanıdır — çakışmadan
// ayrı ayrı toplanır (CUSTOMIZER_SPEC.md §4 uyarısı)
const activeExtras = (extras: CustomizerSelection["extras"], catalog: CustomizerCatalog) =>
  [
    extras.extraAvocado ? catalog.extraOptions.extraAvocado : null,
    extras.extraSauce ? catalog.extraOptions.extraSauce : null,
    extras.extraCrunch ? catalog.extraOptions.extraCrunch : null,
  ].filter(isItem)

// getTotals — seçimlerden nihai fiyat/kalori/protein/karbonhidrat/yağ (CUSTOMIZER_SPEC.md §4)
// ⚠️ Seçim yokken (null/[]) tüm alanlar 0 döner — NaN asla üretilmez (BSC-3 tutarlılığı)
export function getTotals(selections: CustomizerSelection, catalog: CustomizerCatalog): CustomizerTotals {
  const base = findById(catalog.bases, selections.base)
  const main = findById(catalog.mains, selections.main)
  const flavor = findById(catalog.signatureFlavors, selections.signatureFlavor)
  const garden = splitGardenPricing(selections.garden, catalog)
  const finish = splitFinishPricing(selections.finish, catalog)
  const extras = activeExtras(selections.extras, catalog)

  const priced = [base, main, flavor, ...garden.paid, ...finish.paid, ...extras].filter(isItem)
  const consumed = [base, main, flavor, ...garden.all, ...finish.all, ...extras].filter(isItem)

  return {
    price: sumField(priced, "price"),
    calories: sumField(consumed, "calories"),
    protein: sumField(consumed, "protein"),
    carbs: sumField(consumed, "carbs"),
    fat: sumField(consumed, "fat"),
  }
}
