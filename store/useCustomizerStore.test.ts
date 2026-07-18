import { describe, it, expect, beforeEach } from "vitest"
import { useCustomizerStore } from "./useCustomizerStore"

beforeEach(() => {
  useCustomizerStore.getState().reset()
})

describe("useCustomizerStore — seçim aksiyonları", () => {
  it("happy: base/main/flavor seçilince state güncellenir", () => {
    const { selectBase, selectMain, selectSignatureFlavor } = useCustomizerStore.getState()
    selectBase("quinoa")
    selectMain("chicken", "double")
    selectSignatureFlavor("bbq")
    const state = useCustomizerStore.getState()
    expect(state.selections.base).toBe("quinoa")
    expect(state.selections.mainPortion).toBe("double")
    expect(state.selections.signatureFlavor).toBe("bbq")
  })

  it("edge: aynı garden öğesi iki kez tıklanınca toggle olur (eklenir/çıkarılır)", () => {
    const { toggleGardenItem } = useCustomizerStore.getState()
    toggleGardenItem("tomato")
    expect(useCustomizerStore.getState().selections.garden).toContain("tomato")
    toggleGardenItem("tomato")
    expect(useCustomizerStore.getState().selections.garden).not.toContain("tomato")
  })
})

describe("useCustomizerStore — adım guard'ı", () => {
  it("happy: geçerli adımda nextStep ilerler ve maxReachedStep güncellenir", () => {
    useCustomizerStore.getState().selectBase("quinoa")
    useCustomizerStore.getState().nextStep()
    const state = useCustomizerStore.getState()
    expect(state.currentStep).toBe(2)
    expect(state.maxReachedStep).toBe(2)
  })

  it("failure: adım geçersizken (base seçilmemiş) nextStep no-op olur", () => {
    useCustomizerStore.getState().nextStep()
    expect(useCustomizerStore.getState().currentStep).toBe(1)
  })

  it("edge: goToStep, maxReachedStep+1'den ileri adıma izin vermez (URL üzerinden atlama)", () => {
    useCustomizerStore.getState().goToStep(5)
    expect(useCustomizerStore.getState().currentStep).toBe(1)
  })

  it("edge: goToStep, ulaşılmış bir adıma geri dönüşe izin verir", () => {
    useCustomizerStore.getState().selectBase("quinoa")
    useCustomizerStore.getState().nextStep()
    useCustomizerStore.getState().goToStep(1)
    expect(useCustomizerStore.getState().currentStep).toBe(1)
  })
})

describe("useCustomizerStore — isStepValid & getTotals", () => {
  it("happy: Garden(3) ve Finish(5) adımları her zaman geçerlidir (opsiyonel)", () => {
    const { isStepValid } = useCustomizerStore.getState()
    expect(isStepValid(3)).toBe(true)
    expect(isStepValid(5)).toBe(true)
  })

  it("edge: veri kataloğu henüz boşken (TODO: PROD) getTotals 0 döner, çökmez", () => {
    useCustomizerStore.getState().selectBase("quinoa")
    const totals = useCustomizerStore.getState().getTotals()
    expect(totals.price).toBe(0)
    expect(Number.isNaN(totals.price)).toBe(false)
  })

  it("failure: reset sonrası tüm state başlangıç değerine döner", () => {
    useCustomizerStore.getState().selectBase("quinoa")
    useCustomizerStore.getState().nextStep()
    useCustomizerStore.getState().reset()
    const state = useCustomizerStore.getState()
    expect(state.currentStep).toBe(1)
    expect(state.selections.base).toBeNull()
  })
})
