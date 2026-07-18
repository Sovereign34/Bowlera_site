// components/customizer/StepMain.tsx
// Amaç:    Adım 2 — Main (protein) tekli seçimi + "Double Main" (mainPortion) seçeneği
// Bağlı:   store/useCustomizerStore.ts, lib/customizer-data.ts
// Risk:    Portion state'i main ile birlikte set edilmezse yanlış fiyat hesaplanır
// Dokunma: CUSTOMIZER_SPEC.md §2 + Karar #5 (Double Main, mainPortion mekanizmasını yeniden kullanır)

"use client"

import { useCustomizerStore } from "@/store/useCustomizerStore"
import { customizerCatalog } from "@/lib/customizer-data"

export default function StepMain() {
  const main = useCustomizerStore((state) => state.selections.main)
  const mainPortion = useCustomizerStore((state) => state.selections.mainPortion)
  const selectMain = useCustomizerStore((state) => state.selectMain)
  const nextStep = useCustomizerStore((state) => state.nextStep)
  const previousStep = useCustomizerStore((state) => state.previousStep)
  const isValid = useCustomizerStore((state) => state.isStepValid(2))

  return (
    <div>
      <h2 className="font-display text-2xl text-charcoal">Main</h2>
      <p className="mt-1 font-body text-sm text-espresso/80">Ana proteinini seç.</p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {customizerCatalog.mains.map((item) => {
          const selected = main === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => selectMain(item.id, mainPortion)}
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

      {main && (
        <label className="mt-4 flex items-center gap-2 font-body text-sm text-charcoal">
          <input
            type="checkbox"
            checked={mainPortion === "double"}
            onChange={(e) => selectMain(main, e.target.checked ? "double" : "single")}
            className="h-4 w-4 rounded border-charcoal/30 text-olive-primary focus:ring-olive-primary"
          />
          Double Main (porsiyonu ikiye katla)
        </label>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={previousStep}
          className="flex-1 rounded-full border border-olive-primary px-6 py-3 font-body font-semibold
                     text-olive-primary transition-colors duration-200 hover:bg-olive-primary/10"
        >
          Geri
        </button>
        <button
          type="button"
          onClick={nextStep}
          disabled={!isValid}
          className="flex-1 rounded-full bg-olive-primary px-6 py-3 font-body font-semibold text-cream
                     transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Devam Et
        </button>
      </div>
    </div>
  )
}
