// components/customizer/SummaryPanel.test.tsx
// Amaç:    SummaryPanel'in store'dan doğru alanları okuduğunu ve alt bileşenlere doğru prop geçtiğini doğrular
// Not:     useCustomizerStore burada mocklanır — gerçek store davranışı store/useCustomizerStore.test.ts'te test edilir

import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import SummaryPanel from "./SummaryPanel"
import { useCustomizerStore } from "@/store/useCustomizerStore"

vi.mock("@/store/useCustomizerStore", () => ({ useCustomizerStore: vi.fn() }))

const emptySelections = {
  base: null,
  main: null,
  mainPortion: "single" as const,
  garden: [],
  signatureFlavor: null,
  finish: [],
  extras: { extraAvocado: false, extraSauce: false, extraCrunch: false },
}

function mockStore(overrides: {
  selections?: typeof emptySelections
  totals?: { price: number; calories: number; protein: number; carbs: number; fat: number }
  isValid?: boolean
}) {
  const state = {
    selections: overrides.selections ?? emptySelections,
    getTotals: () => overrides.totals ?? { price: 0, calories: 0, protein: 0, carbs: 0, fat: 0 },
    isStepValid: (_step: number) => overrides.isValid ?? false,
  }
  ;(useCustomizerStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
    (selector: (s: typeof state) => unknown) => selector(state)
  )
}

describe("SummaryPanel", () => {
  it("seçim yokken '—' gösterir ve Sepete Ekle disabled'dır (happy path — boş state)", () => {
    mockStore({ isValid: false })
    render(<SummaryPanel />)
    expect(screen.getAllByText("—").length).toBeGreaterThan(0)
    expect(screen.getByRole("button", { name: "Sepete Ekle" })).toBeDisabled()
  })

  it("isStepValid(5) true olduğunda Sepete Ekle aktiftir", () => {
    mockStore({
      selections: { ...emptySelections, base: "quinoa", main: "salmon", signatureFlavor: "lemon-garlic" },
      totals: { price: 180, calories: 520, protein: 40, carbs: 55, fat: 20 },
      isValid: true,
    })
    render(<SummaryPanel />)
    expect(screen.getByRole("button", { name: "Sepete Ekle" })).not.toBeDisabled()
  })

  it("onAddToCart prop'u AddToCartButton'a doğru şekilde geçer", () => {
    const onAddToCart = vi.fn()
    mockStore({ isValid: true })
    render(<SummaryPanel onAddToCart={onAddToCart} />)
    fireEvent.click(screen.getByRole("button", { name: "Sepete Ekle" }))
    expect(onAddToCart).toHaveBeenCalledTimes(1)
  })

  it("panel aria-label ile erişilebilir bölge olarak işaretli (her zaman görünür panel)", () => {
    mockStore({ isValid: false })
    render(<SummaryPanel />)
    expect(screen.getByLabelText("Sipariş özeti")).toBeInTheDocument()
  })
})
