// components/customizer/StepGarden.tsx
// Amaç:    Adım 3 — Garden çoklu seçim (ilk 4 ücretsiz, Avokado her zaman ücretli — Karar #3)
// Bağlı:   store/useCustomizerStore.ts, lib/customizer-data.ts, lib/customizer-pricing.ts (ücret mantığı orada)
// Risk:    Ücretsiz kota sınırı yanlış gösterilirse kullanıcı fiyat sürprizi yaşar
// Dokunma: CUSTOMIZER_SPEC.md §2 + §4 (Avokado istisnası)

"use client"

import { useCustomizerStore } from "@/store/useCustomizerStore"
import { customizerCatalog } from "@/lib/customizer-data"

const FREE_QUOTA = 4

export default function StepGarden() {
  const garden = useCustomizerStore((state) => state.selections.garden)
  const toggleGardenItem = useCustomizerStore((state) => state.toggleGardenItem)
  const nextStep = useCustomizerStore((state) => state.nextStep)
  const previousStep = useCustomizerStore((state) => state.previousStep)

  // Avokado hariç, ücretsiz kotaya dahil olan seçim sayısı — CUSTOMIZER_SPEC.md §4
  const freeEligibleCount = garden.filter((id) => id !== "avocado").length

  return (
    <div>
      <h2 className="font-display text-2xl text-charcoal">Garden</h2>
      <p className="mt-1 font-body text-sm text-espresso/80">
        İlk {FREE_QUOTA} seçim ücretsiz — Avokado her zaman ücretli. ({freeEligibleCount}/{FREE_QUOTA} kullanıldı)
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {customizerCatalog.gardenItems.map((item) => {
          const selected = garden.includes(item.id)
          const alwaysPaid = item.id === "avocado"
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleGardenItem(item.id)}
              aria-pressed={selected}
              className={`rounded-xl border p-3 text-left font-body transition-colors duration-200 ${
                selected
                  ? "border-olive-primary bg-olive-primary/10"
                  : "border-charcoal/10 bg-white hover:border-olive-primary/50"
              }`}
            >
              <span className="block text-sm font-semibold text-charcoal">{item.name}</span>
              <span className="mt-1 block text-xs text-espresso/70">
                {alwaysPaid ? `+${item.price} TL (her zaman)` : `+${item.price} TL sonrası`} · {item.calories} kcal
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
          className="flex-1 rounded-full bg-olive-primary px-6 py-3 font-body font-semibold text-cream
                     transition-colors duration-200"
        >
          Devam Et
        </button>
      </div>
    </div>
  )
}
