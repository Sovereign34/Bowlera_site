// components/customizer/SummaryTotals.tsx
// Amaç:    Fiyat/kalori/protein/karbonhidrat/yağ toplamlarını her zaman görünür şekilde render eder
// Bağlı:   components/customizer/SummaryPanel.tsx, lib/customizer-summary-format.ts
// Risk:    Kalori alanı gizlenir/opsiyonel gösterilirse MASTER_PLAN §5.5 ihlali (yasal/UX riski) — bu yüzden koşulsuz render edilir
// Dokunma: DESIGN_SYSTEM.md §2 (renk token'ları), §6.1 (değer değişince vurgu flaşı) — ⚠️ bkz. dosya altı not

"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { CustomizerTotals } from "@/types"
import { formatMetric, formatPrice } from "@/lib/customizer-summary-format"

type Props = { totals: CustomizerTotals; hasSelection: boolean }

type RowProps = { label: string; display: string }

// Değer değişince kısa opacity flaşı — DESIGN_SYSTEM §6.2 kuralı gereği yalnızca opacity animasyonlu.
// remount-on-key tekniği: `display` değiştiğinde motion.span yeniden monte olur, initial→animate tekrar tetiklenir.
function MetricRow({ label, display }: RowProps) {
  const reduceMotion = useReducedMotion()
  const showFlash = !reduceMotion && display !== "—"

  return (
    <div className="flex items-baseline justify-between font-body text-sm">
      <span className="text-charcoal/70">{label}</span>
      <span className="relative inline-block px-1">
        {showFlash && (
          <motion.span
            key={display}
            aria-hidden
            className="absolute inset-0 rounded bg-olive-primary"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
        <span className="relative font-semibold text-charcoal">{display}</span>
      </span>
    </div>
  )
}

export default function SummaryTotals({ totals, hasSelection }: Props) {
  return (
    <div className="space-y-2" data-testid="summary-totals">
      <div className="flex items-baseline justify-between font-display text-lg text-espresso">
        <span>Toplam</span>
        <span>{formatPrice(totals.price, hasSelection)}</span>
      </div>
      {/* Kalori: ZORUNLU alan — koşulsuz render edilir, opsiyonel yapılamaz (AGENT.md YASAK LİSTE) */}
      <MetricRow label="Kalori" display={formatMetric(totals.calories, hasSelection)} />
      <MetricRow label="Protein (g)" display={formatMetric(totals.protein, hasSelection)} />
      <MetricRow label="Karbonhidrat (g)" display={formatMetric(totals.carbs, hasSelection)} />
      <MetricRow label="Yağ (g)" display={formatMetric(totals.fat, hasSelection)} />
    </div>
  )
}

// ⚠️ TASARIM SİSTEMİ NOTU (bu SESSION_INDEX'e Açık Sorun olarak da işlenecek):
// DESIGN_SYSTEM.md §6.1 animasyon tablosu "Özet panel fiyat/kalori güncelleme" için
// logo-degrade renkli flaş öngörüyor, ama §2.1 logo degradesinin kullanılabileceği
// 4 yeri sayarken bu paneli LİSTELEMİYOR. İki bölüm çelişiyor. Çelişki netleşene kadar
// burada güvenli/tutucu seçenek olan Primary Olive (bg-olive-primary) kullanıldı —
// logo-degrade DEĞİL. DESIGN_SYSTEM.md'nin hangi bölümünün esas alınacağı teyit edilirse
// bu dosya güncellenebilir.
