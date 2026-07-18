// components/customizer/StepBase.tsx
// Amaç:    Adım 1 — Base (taban) tekli seçimi
// Bağlı:   store/useCustomizerStore.ts, lib/customizer-data.ts
// Risk:    Yanlış id gönderimi → fiyat/kalori hesabı bozulur
// Dokunma: CUSTOMIZER_SPEC.md §2 — Base listesiyle tutarlı olmalı

"use client"

import { useCustomizerStore } from "@/store/useCustomizerStore"
import { customizerCatalog } from "@/lib/customizer-data"

export default function StepBase() {
  const base = useCustomizerStore((state) => state.selections.base)
  const selectBase = useCustomizerStore((state) => state.selectBase)
  const nextStep = useCustomizerStore((state) => state.nextStep)
  const isValid = useCustomizerStore((state) => state.isStepValid(1))

  return (
    <div>
      <h2 className="font-display text-2xl text-charcoal">Base</h2>
      <p className="mt-1 font-body text-sm text-espresso/80">Kâsenin tabanını seç.</p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {customizerCatalog.bases.map((item) => {
          const selected = base === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => selectBase(item.id)}
              aria-pressed={selected}
              className={`rounded-xl border p-3 text-left font-body transition-colors duration-200 ${
                selected
                  ? "border-olive-primary bg-olive-primary/10"
                  : "border-charcoal/10 bg-white hover:border-olive-primary/50"
              }`}
            >
              <span className="block text-sm font-semibold text-charcoal">{item.name}</span>
              <span className="mt-1 block text-xs text-espresso/70">
                {item.price > 0 ? `+${item.price} TL` : "Dahil"} · {item.calories} kcal
              </span>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={nextStep}
        disabled={!isValid}
        className="mt-6 w-full rounded-full bg-olive-primary px-6 py-3 font-body font-semibold text-cream
                   transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Devam Et
      </button>
    </div>
  )
}
