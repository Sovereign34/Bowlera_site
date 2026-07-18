// store/useCustomizerStore.ts
// Amaç:    "Kâseni Yarat" akışının 5 adımlı seçim state'ini ve adım geçiş guard'ını yönetir
// Bağlı:   app/menu/customize/[id]/page.tsx, components/customizer/*, lib/customizer-pricing.ts
// Risk:    Guard bozulursa kullanıcı adım atlayarak eksik/geçersiz bir kâse sipariş edebilir
// Dokunma: CUSTOMIZER_SPEC.md §3 (State Makinesi) — adım sırası veya validasyon kuralı değişmeden kod değişmemeli

import { create } from "zustand"
import type { CustomizerSelection, CustomizerTotals } from "@/types"
import { getTotals as calculateTotals } from "@/lib/customizer-pricing"
import { customizerCatalog } from "@/lib/customizer-data"

type Step = 1 | 2 | 3 | 4 | 5

type CustomizerState = {
  currentStep: Step
  maxReachedStep: Step
  selections: CustomizerSelection
  selectBase: (id: string) => void
  selectMain: (id: string, portion: "single" | "double") => void
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
}

const initialSelections: CustomizerSelection = {
  base: null,
  main: null,
  mainPortion: "single",
  garden: [],
  signatureFlavor: null,
  finish: [],
  extras: { extraAvocado: false, extraSauce: false, extraCrunch: false },
}

// Adım geçerlilik kuralı — CUSTOMIZER_SPEC.md §3.3 (3 ve 5 opsiyonel, her zaman geçerli)
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

  selectMain: (id, portion) =>
    set((state) => ({ selections: { ...state.selections, main: id, mainPortion: portion } })),

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
  nextStep: () =>
    set((state) => {
      if (!checkStepValid(state.currentStep, state.selections)) return state
      const next = Math.min(state.currentStep + 1, 5) as Step
      return { currentStep: next, maxReachedStep: Math.max(state.maxReachedStep, next) as Step }
    }),

  previousStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) as Step })),

  reset: () => set({ currentStep: 1, maxReachedStep: 1, selections: initialSelections }),

  getTotals: () => calculateTotals(get().selections, customizerCatalog),

  isStepValid: (step) => checkStepValid(step, get().selections),
}))
