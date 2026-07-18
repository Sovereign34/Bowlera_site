// components/customizer/SummaryTotals.test.tsx
// Amaç:    Kalori alanının HER ZAMAN render edildiğini ve "—"/sayı ayrımının doğru çalıştığını doğrular

import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import SummaryTotals from "./SummaryTotals"
import type { CustomizerTotals } from "@/types"

const zeroTotals: CustomizerTotals = { price: 0, calories: 0, protein: 0, carbs: 0, fat: 0 }
const realTotals: CustomizerTotals = { price: 145.5, calories: 512, protein: 34, carbs: 61, fat: 18 }

describe("SummaryTotals", () => {
  it("seçim yokken tüm alanlar '—' gösterir, '0' değil (happy path — CUSTOMIZER_SPEC §4)", () => {
    render(<SummaryTotals totals={zeroTotals} hasSelection={false} />)
    const dashes = screen.getAllByText("—")
    expect(dashes.length).toBe(5) // price + calories + protein + carbs + fat
  })

  it("seçim varken gerçek fiyat/kalori değerlerini render eder", () => {
    render(<SummaryTotals totals={realTotals} hasSelection={true} />)
    expect(screen.getByText("₺145.50")).toBeInTheDocument()
    expect(screen.getByText("512")).toBeInTheDocument()
  })

  it("kalori satırı koşulsuz DOM'da bulunur (MASTER_PLAN §5.5 — asla gizlenemez)", () => {
    render(<SummaryTotals totals={zeroTotals} hasSelection={false} />)
    expect(screen.getByText("Kalori")).toBeInTheDocument()
  })

  it("seçim var ama fiyat gerçekten 0 ise (tüm ücretsiz kota) '0' gösterir, '—' değil (edge case)", () => {
    render(<SummaryTotals totals={{ ...realTotals, price: 0 }} hasSelection={true} />)
    expect(screen.getByText("₺0.00")).toBeInTheDocument()
  })

  it("makro etiketleri (Protein/Karbonhidrat/Yağ) her zaman render edilir", () => {
    render(<SummaryTotals totals={realTotals} hasSelection={true} />)
    expect(screen.getByText("Protein (g)")).toBeInTheDocument()
    expect(screen.getByText("Karbonhidrat (g)")).toBeInTheDocument()
    expect(screen.getByText("Yağ (g)")).toBeInTheDocument()
  })
})
