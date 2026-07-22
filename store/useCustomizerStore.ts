// store/useCustomizerStore.ts
// Amaç:    "Kâseni Yarat" akışının 5 adımlı seçim state'ini ve adım geçiş guard'ını yönetir
// Bağlı:   app/menu/customize/[id]/page.tsx, components/customizer/*, lib/customizer-pricing.ts
// Risk:    Guard bozulursa kullanıcı adım atlayarak eksik/geçersiz bir kâse sipariş edebilir.
//          mainVariant null kalırsa Bitkisel Protein siparişi mutfağa hangi varyantla
//          gideceği belirsiz gider — bu yüzden nextStep() otomatik atama yapıyor (§3.4).
// Dokunma: CUSTOMIZER_SPEC.md §3 (State Makinesi), §2.1/§3.4 (Main alt-varyant, v1.2) —
//          adım sırası veya validasyon kuralı değişmeden kod değişmemeli
//
// Değişiklik (bu session — Karar #11/Açık Sorun #22, v1.2):
// `mainVariant` state'i, `selectMainVariant` action'ı, `nextStep()` içinde §3.4'teki otomatik
// varyant atama mantığı ve `getAvailableFlavors()` (§2.1 Signature Flavor filtreleme) eklendi.
//
// DÜZELTME (bu session, StepMain.tsx okunduktan sonra): `selectMain`'in `mainVariant`'ı HER
// çağrıda sıfırlaması hataydı — "Double Main" checkbox'ı `selectMain(main, portion)`'ı aynı
// main id'siyle tekrar çağırıyor (StepMain.tsx satır 54), bu da kullanıcının zaten seçtiği
// varyantı (örn. Meksika Fasulyesi) sessizce siliyordu. Artık `mainVariant` SADECE main id
// gerçekten değişince sıfırlanıyor; aynı main'de portion değişimi varyantı korur.

import { create } from "zustand"
import type { CustomizerComponentItem, CustomizerSelection, CustomizerTotals } from "@/types"
import { getTotals as calculateTotals } from "@/lib/customizer-pricing"
import { customizerCatalog } from "@/lib/customizer-data"

type Step = 1 | 2 | 3 | 4 | 5

type CustomizerState = {
  currentStep: Step
  maxReachedStep: Step
  selections: CustomizerSelection
  selectBase: (id: string) => void
  selectMain: (id: string, portion: "single" | "double") => void
  selectMainVariant: (variantId: string) => void
  toggleGardenItem: (id: string) => void
  selectSignatureFlavor: (id: string) => void
  toggleFinishItem: (id: string) => void
  toggleExtra: (key: keyof CustomizerSelection["extras"]) => void
  goToStep: (step: Step) => void
  nextStep: () => void
  previousStep: () => void
  reset: () => void
  getTotals: () => CustomizerTotals
  isStepValid: (step: Step) => boolean
  getAvailableFlavors: () => CustomizerComponentItem[]
}

const initialSelections: CustomizerSelection = {
  base: null,
  main: null,
  mainVariant: null, // v1.2 — CUSTOMIZER_SPEC.md §3.1
  mainPortion: "single",
  garden: [],
  signatureFlavor: null,
  finish: [],
  extras: { extraAvocado: false, extraSauce: false, extraCrunch: false },
}

// Adım geçerlilik kuralı — CUSTOMIZER_SPEC.md §3.3 (3 ve 5 opsiyonel, her zaman geçerli)
// ⚠️ v1.2: mainVariant BİLİNÇLİ OLARAK bu kontrole dahil değil — §2.1/§3.3, kullanıcı
// varyant seçmeden 2. adımı geçebilmeli (nextStep() otomatik atama yapar).
function checkStepValid(step: Step, selections: CustomizerSelection): boolean {
  if (step === 1) return selections.base !== null
  if (step === 2) return selections.main !== null
  if (step === 4) return selections.signatureFlavor !== null
  return true
}

const toggleInArray = (list: string[], id: string) =>
  list.includes(id) ? list.filter((existing) => existing !== id) : [...list, id]

export const useCustomizerStore = create<CustomizerState>((set, get) => ({
  currentStep: 1,
  maxReachedStep: 1,
  selections: initialSelections,

  selectBase: (id) => set((state) => ({ selections: { ...state.selections, base: id } })),

  // DÜZELTİLDİ: mainVariant SADECE main id gerçekten değişince sıfırlanır. Aynı main'de
  // portion (Double Main) değişimi (StepMain.tsx'in selectMain(main, ...) çağrısı) artık
  // seçili varyantı silmiyor.
  selectMain: (id, portion) =>
    set((state) => ({
      selections: {
        ...state.selections,
        main: id,
        mainPortion: portion,
        mainVariant: state.selections.main === id ? state.selections.mainVariant : null,
      },
    })),

  // v1.2 — CUSTOMIZER_SPEC.md §3.1
  selectMainVariant: (variantId) =>
    set((state) => ({ selections: { ...state.selections, mainVariant: variantId } })),

  toggleGardenItem: (id) =>
    set((state) => ({
      selections: { ...state.selections, garden: toggleInArray(state.selections.garden, id) },
    })),

  selectSignatureFlavor: (id) =>
    set((state) => ({ selections: { ...state.selections, signatureFlavor: id } })),

  toggleFinishItem: (id) =>
    set((state) => ({
      selections: { ...state.selections, finish: toggleInArray(state.selections.finish, id) },
    })),

  toggleExtra: (key) =>
    set((state) => ({
      selections: {
        ...state.selections,
        extras: { ...state.selections.extras, [key]: !state.selections.extras[key] },
      },
    })),

  // Guard: step > maxReachedStep+1 ise no-op — CUSTOMIZER_SPEC.md §3.2 (URL'den ileri atlama engeli)
  // Fix (Oturum 4): nextStep ile aynı mantık — izin verilen bir adıma gidiliyorsa maxReachedStep de
  // birlikte güncellenir, böylece sayfa yenilemesinde ilerleme kaybı riski kalmaz.
  goToStep: (step) =>
    set((state) =>
      step > state.maxReachedStep + 1
        ? state
        : { currentStep: step, maxReachedStep: Math.max(state.maxReachedStep, step) as Step }
    ),

  // Mevcut adım geçersizse ilerlemez — CUSTOMIZER_SPEC.md §3.3
  // v1.2: step 2 → 3 geçişinde, main='plant-based-protein' VE mainVariant=null ise
  // ilk varyant sessizce atanır — CUSTOMIZER_SPEC.md §3.4 (Karar #11, Kural Önceliği #2 BÜTÜNLÜK)
  nextStep: () =>
    set((state) => {
      if (!checkStepValid(state.currentStep, state.selections)) return state

      let selections = state.selections
      if (
        state.currentStep === 2 &&
        selections.main === "plant-based-protein" &&
        selections.mainVariant === null
      ) {
        const mainDef = customizerCatalog.mains.find((m) => m.id === "plant-based-protein")
        const firstVariant = mainDef?.variants?.[0]
        if (firstVariant) {
          selections = { ...selections, mainVariant: firstVariant.id }
        }
      }

      const next = Math.min(state.currentStep + 1, 5) as Step
      return {
        currentStep: next,
        maxReachedStep: Math.max(state.maxReachedStep, next) as Step,
        selections,
      }
    }),

  previousStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) as Step })),

  reset: () => set({ currentStep: 1, maxReachedStep: 1, selections: initialSelections }),

  getTotals: () => calculateTotals(get().selections, customizerCatalog),

  isStepValid: (step) => checkStepValid(step, get().selections),

  // v1.2 — CUSTOMIZER_SPEC.md §2.1: seçili Main'in compatibleFlavorIds'i varsa Signature
  // Flavor listesi buna göre daraltılır; yoksa (diğer 6 Main) tüm liste değişmeden döner.
  getAvailableFlavors: () => {
    const { selections } = get()
    const mainDef = customizerCatalog.mains.find((m) => m.id === selections.main)
    if (mainDef?.compatibleFlavorIds) {
      const allowed = mainDef.compatibleFlavorIds
      return customizerCatalog.signatureFlavors.filter((flavor) => allowed.includes(flavor.id))
    }
    return customizerCatalog.signatureFlavors
  },
}))
