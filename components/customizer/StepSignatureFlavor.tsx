// components/customizer/StepSignatureFlavor.tsx
// Amaç:    Adım 4 — Signature Flavor tekli seçimi
// Bağlı:   store/useCustomizerStore.ts, lib/customizer-data.ts
// Risk:    Zorunlu adım — seçim yoksa sepete eklenemez (isStepValid)
// Dokunma: CUSTOMIZER_SPEC.md §2 — Karar #11 (Main'e göre koşullu içerik) bu bileşene HENÜZ
//          eklenmedi, ayrı bir görev olarak bekliyor (Açık Sorun #22)

"use client"

import { useCustomizerStore } from "@/store/useCustomizerStore"
import { customizerCatalog } from "@/lib/customizer-data"

export default function StepSignatureFlavor() {
  const signatureFlavor = useCustomizerStore((state) => state.selections.signatureFlavor)
  const selectSignatureFlavor = useCustomizerStore((state) => state.selectSignatureFlavor)
  const nextStep = useCustomizerStore((state) => state.nextStep)
  const previousStep = useCustomizerStore((state) => state.previousStep)
  const isValid = useCustomizerStore((state) => state.isStepValid(4))

  return (
    <div>
      <h2 className="font-display text-2xl text-charcoal">Signature Flavor</h2>
      <p className="mt-1 font-body text-sm text-espresso/80">İmza lezzetini seç.</p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {customizerCatalog.signatureFlavors.map((item) => {
          const selected = signatureFlavor === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => selectSignatureFlavor(item.id)}
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
