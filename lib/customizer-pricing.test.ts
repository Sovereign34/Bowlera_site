import { describe, it, expect } from "vitest"
import { getTotals, splitGardenPricing, splitFinishPricing } from "./customizer-pricing"
import type { CustomizerCatalog, CustomizerSelection } from "@/types"

// Test amaçlı sabit katalog — production verisi değildir, sadece hesaplama mantığını doğrular
const mockCatalog: CustomizerCatalog = {
  bases: [{ id: "quinoa", name: "Quinoa", price: 0, calories: 200, protein: 8 }],
  mains: [{ id: "chicken", name: "Grilled Chicken", price: 40, calories: 250, protein: 30 }],
  gardenItems: [
    { id: "tomato", name: "Cherry Tomato", price: 0, calories: 20, protein: 1 },
    { id: "cucumber", name: "Cucumber", price: 0, calories: 15, protein: 1 },
    { id: "corn", name: "Corn", price: 0, calories: 30, protein: 2 },
    { id: "onion", name: "Pickled Onion", price: 0, calories: 10, protein: 0 },
    { id: "carrot", name: "Carrot", price: 0, calories: 25, protein: 1 },
    { id: "avocado", name: "Avocado", price: 15, calories: 80, protein: 1 },
  ],
  signatureFlavors: [{ id: "bbq", name: "Smoky BBQ", price: 0, calories: 40, protein: 0 }],
  finishItems: [
    { id: "feta", name: "Feta", price: 10, calories: 60, protein: 4 },
    { id: "seeds", name: "Roasted Seeds", price: 8, calories: 50, protein: 2 },
  ],
  extraOptions: {
    extraAvocado: { id: "extra-avocado", name: "Extra Avocado", price: 15, calories: 80, protein: 1 },
    extraSauce: { id: "extra-sauce", name: "Extra Sauce", price: 5, calories: 30, protein: 0 },
    extraCrunch: { id: "extra-crunch", name: "Extra Crunch", price: 5, calories: 40, protein: 1 },
  },
}

const emptySelection: CustomizerSelection = {
  base: null,
  main: null,
  mainPortion: "single",
  garden: [],
  signatureFlavor: null,
  finish: [],
  extras: { extraAvocado: false, extraSauce: false, extraCrunch: false },
}

describe("splitGardenPricing", () => {
  it("happy: 3 garden öğesi hepsi ücretsiz kotada", () => {
    const result = splitGardenPricing(["tomato", "cucumber", "corn"], mockCatalog)
    expect(result.free).toHaveLength(3)
    expect(result.paid).toHaveLength(0)
  })

  it("edge: avokado kaçıncı sırada seçilirse seçilsin her zaman ücretli", () => {
    const result = splitGardenPricing(["avocado", "tomato"], mockCatalog)
    expect(result.paid.map((i) => i.id)).toContain("avocado")
    expect(result.free.map((i) => i.id)).toContain("tomato")
  })

  it("edge: 5. ve sonrası (avokado hariç) ücretli", () => {
    const result = splitGardenPricing(["tomato", "cucumber", "corn", "onion", "carrot"], mockCatalog)
    expect(result.free).toHaveLength(4)
    expect(result.paid).toHaveLength(1)
  })

  it("failure: bilinmeyen id sessizce yok sayılır, çökmez", () => {
    const result = splitGardenPricing(["ghost-id"], mockCatalog)
    expect(result.free).toHaveLength(0)
    expect(result.paid).toHaveLength(0)
  })
})

describe("splitFinishPricing", () => {
  it("happy: ilk seçim ücretsiz", () => {
    const result = splitFinishPricing(["feta"], mockCatalog)
    expect(result.free).toHaveLength(1)
    expect(result.paid).toHaveLength(0)
  })

  it("edge: 2. seçim ücretli", () => {
    const result = splitFinishPricing(["feta", "seeds"], mockCatalog)
    expect(result.free).toHaveLength(1)
    expect(result.paid).toHaveLength(1)
  })
})

describe("getTotals", () => {
  it("happy: base+main+flavor+garden+finish doğru toplanır", () => {
    const selections: CustomizerSelection = {
      ...emptySelection,
      base: "quinoa",
      main: "chicken",
      signatureFlavor: "bbq",
      garden: ["tomato", "cucumber"],
      finish: ["feta"],
    }
    const totals = getTotals(selections, mockCatalog)
    expect(totals.price).toBe(40) // sadece main ücretli, garden/finish ücretsiz kotada
    expect(totals.calories).toBe(200 + 250 + 40 + 20 + 15 + 60)
  })

  it("edge: hiçbir seçim yokken 0 döner, NaN üretmez", () => {
    const totals = getTotals(emptySelection, mockCatalog)
    expect(totals.price).toBe(0)
    expect(totals.calories).toBe(0)
    expect(Number.isNaN(totals.price)).toBe(false)
  })

  it("edge: garden avokado + extras.extraAvocado aynı anda seçilirse ayrı ayrı toplanır", () => {
    const selections: CustomizerSelection = {
      ...emptySelection,
      base: "quinoa",
      main: "chicken",
      signatureFlavor: "bbq",
      garden: ["avocado"],
      extras: { extraAvocado: true, extraSauce: false, extraCrunch: false },
    }
    const totals = getTotals(selections, mockCatalog)
    // main(40) + garden avokado(15, her zaman ücretli) + extraAvocado(15) = 70
    expect(totals.price).toBe(70)
  })

  it("failure: geçersiz base/main id'siyle çağrılırsa çökmez, o alan hesaba katılmaz", () => {
    const selections: CustomizerSelection = { ...emptySelection, base: "ghost", main: "ghost" }
    const totals = getTotals(selections, mockCatalog)
    expect(totals.price).toBe(0)
    expect(Number.isNaN(totals.calories)).toBe(false)
  })
})
