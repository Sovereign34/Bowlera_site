// lib/customizer-summary-format.ts
// Amaç:    SummaryPanel'in "—" vs sayı gösterim kuralını ve güvenli sayı formatlamasını tek yerde tanımlar
// Bağlı:   components/customizer/SummaryTotals.tsx, components/customizer/SummaryPanel.tsx
// Risk:    Yanlış "—"/sayı ayrımı müşteriye "seçim yok" yerine yanıltıcı "0 kalori" gösterebilir
// Dokunma: CUSTOMIZER_SPEC.md §4 — seçim yokken getTotals() 0 döner, UI bunu "—" olarak göstermek zorunda

import type { CustomizerSelection } from "@/types"

// Hiçbir adımda seçim yapılmamışsa true — CUSTOMIZER_SPEC §4 "—" kuralının tetikleyicisi
export function hasAnySelection(selections: CustomizerSelection): boolean {
  return (
    selections.base !== null ||
    selections.main !== null ||
    selections.signatureFlavor !== null ||
    selections.garden.length > 0 ||
    selections.finish.length > 0
  )
}

// BSC-3: getTotals()'tan gelen değer NaN/Infinity olursa (beklenmeyen veri) hata fırlatmak yerine
// güvenli "—" döner — müşteriye bozuk sayı asla gösterilmez
export function formatMetric(value: number, hasSelection: boolean): string {
  if (!hasSelection || !Number.isFinite(value)) return "—"
  return String(Math.round(value))
}

// TODO: PROD — para birimi CONTENT_GUIDE.md/MASTER_PLAN'da netleşene kadar ₺ varsayıldı (Türkiye pazarı, CORE.md §2)
export function formatPrice(value: number, hasSelection: boolean): string {
  if (!hasSelection || !Number.isFinite(value)) return "—"
  return `₺${value.toFixed(2)}`
}
