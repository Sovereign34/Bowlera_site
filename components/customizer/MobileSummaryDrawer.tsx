// components/customizer/MobileSummaryDrawer.tsx
// Amaç:    Mobilde ekranın altında sabit (sticky) özet çekmecesi — kapalı tek satır, açık tam özet + Sepete Ekle
// Bağlı:   store/useCustomizerStore.ts, components/customizer/VisualPreview.tsx, AddToCartButton.tsx,
//          lib/customizer-data.ts, lib/customizer-summary-format.ts
// Risk:    Kullanıcı toplam fiyat/kaloriyi göremezse yanlış beklentiyle sipariş verebilir (CUSTOMIZER_SPEC.md §6)
// Dokunma: CUSTOMIZER_SPEC.md §6 (Mobil UX) — açık/kapalı durum davranışı burada tanımlı, değiştirmeden önce oku
//
// DÜZELTME (bu session — Açık Sorun #43): Yerel `formatPrice`/`formatCalories` kopyaları kaldırıldı,
// `lib/customizer-summary-format.ts`'teki gerçek modül kullanılıyor. Eski yerel kopya `value > 0`
// kontrolü yapıyordu — seçili ama 0 TL'lik bir öğede (örn. ücretsiz bir Garden seçimi) yanlışlıkla
// "—" gösteriyordu, doğrusu "0" olmalıydı. Gerçek modül `hasSelection` bayrağına bakıyor
// (hasAnySelection(selections)) — "seçim var mı" ile "değer sıfır mı" artık karışmıyor.
// Not: formatMetric() ham sayı döner ("kcal" eki yok), birim etiketi burada eklendi.

"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { useCustomizerStore } from "@/store/useCustomizerStore"
import { customizerCatalog } from "@/lib/customizer-data"
import { hasAnySelection, formatMetric, formatPrice } from "@/lib/customizer-summary-format"
import VisualPreview from "@/components/customizer/VisualPreview"
import AddToCartButton from "@/components/customizer/AddToCartButton"

type Props = {
  onAddToCart?: () => void
}

export default function MobileSummaryDrawer({ onAddToCart }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const getTotals = useCustomizerStore((state) => state.getTotals)
  const isStepValid = useCustomizerStore((state) => state.isStepValid)
  const selections = useCustomizerStore((state) => state.selections)
  const reduceMotion = useReducedMotion()
  const totals = getTotals()
  const canAddToCart = isStepValid(5)

  // "Seçim var mı" (hasSelection) ile "değer sıfır mı" (0 TL/0 kcal) artık karışmıyor — #43 düzeltmesi
  const hasSelection = hasAnySelection(selections)
  const priceLabel = formatPrice(totals.price, hasSelection)
  const caloriesRaw = formatMetric(totals.calories, hasSelection)
  const caloriesLabel = caloriesRaw === "—" ? "—" : `${caloriesRaw} kcal`

  const base = customizerCatalog.bases.find((item) => item.id === selections.base)
  const main = customizerCatalog.mains.find((item) => item.id === selections.main)
  const flavor = customizerCatalog.signatureFlavors.find((item) => item.id === selections.signatureFlavor)
  const gardenNames = selections.garden
    .map((id) => customizerCatalog.gardenItems.find((item) => item.id === id)?.name)
    .filter(Boolean)
  const finishNames = selections.finish
    .map((id) => customizerCatalog.finishItems.find((item) => item.id === id)?.name)
    .filter(Boolean)

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
      <div className="rounded-t-2xl bg-cream shadow-[0_-4px_16px_rgba(0,0,0,0.12)]">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between px-4 py-3 font-body"
        >
          <span className="font-semibold text-charcoal">
            {priceLabel} · {caloriesLabel}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            aria-hidden="true"
          >
            ▲
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="drawer-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
              className="overflow-hidden px-4 pb-4"
            >
              <div className="flex gap-4">
                <div className="w-24 shrink-0">
                  <VisualPreview />
                </div>
                <ul className="flex-1 space-y-1 font-body text-sm text-espresso">
                  <li>Base: {base?.name ?? "—"}</li>
                  <li>Main: {main?.name ?? "—"}</li>
                  {gardenNames.length > 0 && <li>Garden: {gardenNames.join(", ")}</li>}
                  <li>Flavor: {flavor?.name ?? "—"}</li>
                  {finishNames.length > 0 && <li>Finish: {finishNames.join(", ")}</li>}
                </ul>
              </div>
              <div className="mt-4">
                <AddToCartButton isValid={canAddToCart} onAddToCart={onAddToCart} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
