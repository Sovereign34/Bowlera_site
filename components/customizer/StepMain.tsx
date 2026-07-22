// components/customizer/StepMain.tsx
// Amaç:    Adım 2 — Main (protein) tekli seçimi + "Double Main" (mainPortion) seçeneği +
//          Bitkisel Protein alt-varyant seçimi (Soslu Nohut / Meksika Fasulyesi)
// Bağlı:   store/useCustomizerStore.ts, lib/customizer-data.ts
// Risk:    Portion state'i main ile birlikte set edilmezse yanlış fiyat hesaplanır.
//          🆕 mainVariant seçilmeden ilerlenirse mutfak verisi eksik gitmemeli — bu store'da
//          nextStep() tarafından otomatik çözülür (§3.4), bu bileşen sadece UI'ı sağlar.
// Dokunma: CUSTOMIZER_SPEC.md §2 + §2.1 (v1.2, Karar #11) + Karar #5 (Double Main, mainPortion
//          mekanizmasını yeniden kullanır)
//
// Değişiklik (bu session — Karar #11/Açık Sorun #22, v1.2): Bitkisel Protein kartı seçildiğinde
// kart yerinde genişleyip 2 alt-varyant butonu gösteriyor (inline expand, ayrı adım/modal YOK —
// CUSTOMIZER_SPEC.md §2.1). Varyant seçilmeden "Devam Et"e basılabilir (isStepValid(2) değişmedi,
// kullanıcı notu: "seçim yapmayanlar ilerlemeli") — bu durumda küçük bir "varsayılan" ipucu gösterilir.

"use client"

import { useCustomizerStore } from "@/store/useCustomizerStore"
import { customizerCatalog } from "@/lib/customizer-data"

export default function StepMain() {
  const main = useCustomizerStore((state) => state.selections.main)
  const mainVariant = useCustomizerStore((state) => state.selections.mainVariant)
  const mainPortion = useCustomizerStore((state) => state.selections.mainPortion)
  const selectMain = useCustomizerStore((state) => state.selectMain)
  const selectMainVariant = useCustomizerStore((state) => state.selectMainVariant)
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
          const hasVariants = Boolean(item.variants && item.variants.length > 0)

          return (
            <div key={item.id} className={hasVariants && selected ? "col-span-2 sm:col-span-3" : undefined}>
              <button
                type="button"
                onClick={() => selectMain(item.id, mainPortion)}
                aria-pressed={selected}
                aria-expanded={hasVariants ? selected : undefined}
                className={`w-full rounded-xl border p-3 text-left font-body transition-colors duration-200 ${
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

              {/* Bitkisel Protein — inline varyant genişlemesi (CUSTOMIZER_SPEC.md §2.1) */}
              {hasVariants && selected && (
                <div className="mt-2 rounded-xl border border-olive-primary/20 bg-olive-primary/5 p-3">
                  <p className="font-body text-xs font-semibold text-charcoal">Çeşit seç</p>
                  <div className="mt-2 grid grid-cols-2 gap-2" role="group" aria-label={`${item.name} çeşidi`}>
                    {item.variants!.map((variant) => {
                      const variantSelected = mainVariant === variant.id
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => selectMainVariant(variant.id)}
                          aria-pressed={variantSelected}
                          className={`rounded-lg border p-2 text-left font-body text-xs transition-colors duration-200 ${
                            variantSelected
                              ? "border-olive-primary bg-olive-primary/20"
                              : "border-charcoal/10 bg-white hover:border-olive-primary/40"
                          }`}
                        >
                          <span className="block font-semibold text-charcoal">{variant.name}</span>
                          <span className="mt-0.5 block text-espresso/70">{variant.calories} kcal</span>
                        </button>
                      )
                    })}
                  </div>
                  {mainVariant === null && (
                    <p className="mt-2 font-body text-xs text-espresso/60">
                      Seçmezsen varsayılan: {item.variants![0].name}
                    </p>
                  )}
                </div>
              )}
            </div>
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
