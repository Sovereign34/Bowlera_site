// components/customizer/SummaryPanel.tsx
// Amaç:    Customizer akışında her zaman görünen özet paneli — canlı toplamlar + Sepete Ekle CTA'sı
// Bağlı:   store/useCustomizerStore.ts, SummaryTotals.tsx, AddToCartButton.tsx
// Risk:    Panel koşullu render edilirse kullanıcı toplam fiyat/kaloriyi göremeden ilerleyebilir (CUSTOMIZER_SPEC §1)
// Dokunma: CUSTOMIZER_SPEC.md §1, §7 — panel adım/mobil durumundan bağımsız her zaman görünür kalmalı

"use client"

import { useCustomizerStore } from "@/store/useCustomizerStore"
import { hasAnySelection } from "@/lib/customizer-summary-format"
import SummaryTotals from "./SummaryTotals"
import AddToCartButton from "./AddToCartButton"

type Props = {
  // Oturum 4'te useCartStore bağlandığında page.tsx buraya gerçek handleAddToCart'ı geçirecek
  onAddToCart?: () => void
}

export default function SummaryPanel({ onAddToCart }: Props) {
  const selections = useCustomizerStore((state) => state.selections)
  const getTotals = useCustomizerStore((state) => state.getTotals)
  const isStepValid = useCustomizerStore((state) => state.isStepValid)

  const totals = getTotals()
  const hasSelection = hasAnySelection(selections)

  return (
    <aside className="rounded-xl bg-cream/60 p-4 shadow-sm" aria-label="Sipariş özeti">
      <SummaryTotals totals={totals} hasSelection={hasSelection} />
      <div className="mt-4">
        <AddToCartButton isValid={isStepValid(5)} onAddToCart={onAddToCart} />
      </div>
    </aside>
  )
}
