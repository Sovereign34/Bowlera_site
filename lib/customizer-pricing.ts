// lib/customizer-pricing.ts
// Amaç:    Customizer seçimlerinden fiyat/kalori/protein/karbonhidrat/yağ toplamını hesaplayan saf fonksiyonlar
// Bağlı:   store/useCustomizerStore.ts (getTotals), components/customizer/SummaryPanel.tsx (Oturum 4)
// Risk:    Burada hata olursa müşteriye yanlış fiyat/kalori gösterilir veya sepete yanlış tutar geçer.
//          🆕 Bitkisel Protein için variant-aware olmazsa Meksika Fasulyesi seçiliyken bile
//          Soslu Nohut'un (fallback) kalori/proteini gösterilir — bu turda düzeltildi.
// Dokunma: CUSTOMIZER_SPEC.md §4 (Canlı Fiyat/Kalori Hesaplama) — kural değişmeden kod değişmemeli
//
// DÜZELTME (bu session — Karar #11/Açık Sorun #22, v1.2): `getTotals()` içindeki main çözümlemesi
// `findById(catalog.mains, ...)` idi — bu, `plant-based-protein` objesinin SABİT fallback
// değerlerini (230 kcal/10g) döndürüyordu, `selections.mainVariant` hiç okunmuyordu. Artık
// `resolveMainItem()` kullanılıyor: main.variants doluysa seçili varyanttan (yoksa variants[0]
// fallback) okur; diğer 6 Main için davranış DEĞİŞMEDİ (variants tanımsız → mainDef'in kendisi).

import type {
  CustomizerCatalog,
  CustomizerComponentItem,
  CustomizerSelection,
  CustomizerTotals,
} from "@/types"

const findById = (items: CustomizerComponentItem[], id: string | null) =>
  id ? items.find((item) => item.id === id) ?? null : null

const isItem = (item: CustomizerComponentItem | null): item is CustomizerComponentItem => item !== null

// v1.2 — CUSTOMIZER_SPEC.md §4: main.variants doluysa seçili mainVariant'tan (yoksa variants[0]
// fallback) fiyat/kalori/protein okunur. variants tanımsızsa (diğer 6 Main) mainDef'in kendi
// alanları kullanılır — eski davranış birebir korunur.
function resolveMainItem(
  selections: CustomizerSelection,
  catalog: CustomizerCatalog
): CustomizerComponentItem | null {
  const mainDef = catalog.mains.find((item) => item.id === selections.main) ?? null
  if (!mainDef) return null
  if (mainDef.variants && mainDef.variants.length > 0) {
    return mainDef.variants.find((variant) => variant.id === selections.mainVariant) ?? mainDef.variants[0]
  }
  return mainDef
}

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
  const main = resolveMainItem(selections, catalog) // 🆕 v1.2 — variant-aware (eskiden findById(catalog.mains, ...))
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
