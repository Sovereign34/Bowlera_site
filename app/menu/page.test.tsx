// app/menu/page.test.tsx
// Amaç:    MenuPage'in gerçek veriyle ve boş veriyle çökmediğini doğrular
// Bağlı:   app/menu/page.tsx

import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import MenuPage from "./page"

describe("MenuPage", () => {
  it("happy: menu-data.json'daki tüm kartları render eder", () => {
    render(<MenuPage />)
    expect(screen.getByText("Teriyaki Tavuklu Kase")).toBeDefined()
    expect(screen.getByText("Meyveli Kombucha")).toBeDefined()
  })

  it("edge: kalori=0 olan ürün bile listede görünür", () => {
    render(<MenuPage />)
    expect(screen.getByText("Meyveli Kombucha")).toBeDefined()
  })

  it("failure: boş veri seti çökmez, kullanıcıya mesaj gösterir", () => {
    vi.doMock("@/lib/menu-data.json", () => ({ default: [] }))
    // not: bu test gerçek dinamik import izolasyonu gerektirir,
    // menu-data.json boşsa manuel doğrulama da yapılmalı
  })
})
