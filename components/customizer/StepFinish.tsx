// components/customizer/StepFinish.tsx
// Amaç:    Adım 5 — Finish çoklu seçimi (ilk 1 ücretsiz) + Extras (avokado/sos/çıtırlık ekstra)
// Bağlı:   store/useCustomizerStore.ts, lib/customizer-data.ts
// Risk:    Son adım — Sepete Ekle butonu burada DEĞİL, her zaman görünen SummaryPanel'de (CUSTOMIZER_SPEC §1)
// Dokunma: CUSTOMIZER_SPEC.md §2 + Karar #4 (ilk 1 ücretsiz) — "Make it Yours"/Extras burada entegre (Karar #5)

"use client"

import { useCustomizerStore } from "@/store/useCustomizerStore"
import { customizerCatalog } from "@/lib/customizer-data"

const FREE_QUOTA = 1

const EXTRA_LABELS: { key: "extraAvocado" | "extraSauce" | "extraCrunch" }[] = [
  { key: "extraAvocado" },
  { key: "extraSauce" },
  { key: "extraCrunch" },
]

export default function StepFinish() {
  const finish = useCustomizerStore((state) => state.selections.finish)
  const extras = useCustomizerStore((state) => state.selections.extras)
  const toggleFinishItem = useCustomizerStore((state) => state.toggleFinishItem)
  const toggleExtra = useCustomizerStore((state) => state.toggleExtra)
  const previousStep = useCustomizerStore((state) => state.previousStep)

  return (
    <div>
      <h2 className="font-display text-2xl text-charcoal">Finish</h2>
      <p className="mt-1 font-body text-sm text-espresso/80">
        İlk {FREE_QUOTA} seçim ücretsiz, sonrası ücretli. ({finish.length}/{FREE_QUOTA} kullanıldı)
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {customizerCatalog.finishItems.map((item) => {
          const selected = finish.includes(item.id)
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleFinishItem(item.id)}
              aria-pressed={selected}
              className={`rounded-xl border p-3 text-left font-body transition-colors duration-200 ${
                selected
                  ? "border-olive-primary bg-olive-primary/10"
                  : "border-charcoal/10 bg-white hover:border-olive-primary/50"
              }`}
            >
              <span className="block text-sm font-semibold text-charcoal">{item.name}</span>
              <span className="mt-1 block text-xs text-espresso/70">
                +{item.price} TL sonrası · {item.calories} kcal
              </span>
            </button>
          )
        })}
      </div>

      <h3 className="mt-6 font-display text-lg text-charcoal">Kendine Göre Yap</h3>
      <div className="mt-3 grid grid-cols-1 gap-2">
        {EXTRA_LABELS.map(({ key }) => {
          const item = customizerCatalog.extraOptions[key]
          const active = extras[key]
          return (
            <label
              key={key}
              className={`flex items-center justify-between rounded-xl border p-3 font-body transition-colors duration-200 ${
                active ? "border-olive-primary bg-olive-primary/10" : "border-charcoal/10 bg-white"
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-charcoal">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggleExtra(key)}
                  className="h-4 w-4 rounded border-charcoal/30 text-olive-primary focus:ring-olive-primary"
                />
                {item.name}
              </span>
              <span className="text-xs text-espresso/70">+{item.price} TL</span>
            </label>
          )
        })}
      </div>

      <button
        type="button"
        onClick={previousStep}
        className="mt-6 w-full rounded-full border border-olive-primary px-6 py-3 font-body font-semibold
                   text-olive-primary transition-colors duration-200 hover:bg-olive-primary/10"
      >
        Geri
      </button>
    </div>
  )
}
