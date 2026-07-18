// lib/customizer-summary-format.test.ts
// Amaç:    hasAnySelection/formatMetric/formatPrice için happy+edge+failure path testleri (AGENT.md Kural #6)

import { describe, it, expect } from "vitest"
import { hasAnySelection, formatMetric, formatPrice } from "./customizer-summary-format"
import type { CustomizerSelection } from "@/types"

const emptySelection: CustomizerSelection = {
  base: null,
  main: null,
  mainPortion: "single",
  garden: [],
  signatureFlavor: null,
  finish: [],
  extras: { extraAvocado: false, extraSauce: false, extraCrunch: false },
}

describe("hasAnySelection", () => {
  it("hiçbir seçim yokken false döner (happy path)", () => {
    expect(hasAnySelection(emptySelection)).toBe(false)
  })

  it("sadece base seçilmişse true döner", () => {
    expect(hasAnySelection({ ...emptySelection, base: "quinoa" })).toBe(true)
  })

  it("sadece garden'a bir öğe eklenmişse true döner (edge: base/main hâlâ null)", () => {
    expect(hasAnySelection({ ...emptySelection, garden: ["cherry-tomato"] })).toBe(true)
  })

  it("sadece finish'e bir öğe eklenmişse true döner", () => {
    expect(hasAnySelection({ ...emptySelection, finish: ["feta"] })).toBe(true)
  })
})

describe("formatMetric", () => {
  it("hasSelection false iken '—' döner (happy path — seçim yok)", () => {
    expect(formatMetric(0, false)).toBe("—")
  })

  it("hasSelection true ve değer 0 iken gerçek '0' döner, '—' değil (edge: ücretsiz seçim)", () => {
    expect(formatMetric(0, true)).toBe("0")
  })

  it("ondalık değeri en yakın tam sayıya yuvarlar", () => {
    expect(formatMetric(245.6, true)).toBe("246")
  })

  it("NaN geldiğinde hata fırlatmadan '—' döner (failure path — bozuk veri)", () => {
    expect(formatMetric(NaN, true)).toBe("—")
  })

  it("Infinity geldiğinde '—' döner (failure path)", () => {
    expect(formatMetric(Infinity, true)).toBe("—")
  })
})

describe("formatPrice", () => {
  it("hasSelection false iken '—' döner", () => {
    expect(formatPrice(120.5, false)).toBe("—")
  })

  it("hasSelection true iken ₺ ile 2 ondalık basamak formatlar", () => {
    expect(formatPrice(120.5, true)).toBe("₺120.50")
  })

  it("NaN geldiğinde '—' döner (failure path)", () => {
    expect(formatPrice(NaN, true)).toBe("—")
  })
})
