import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
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
})
