// components/menu/MenuCard.test.tsx
// Amaç:    MenuCard'ın kalori/fiyat zorunluluğunu ve rozet edge case'lerini doğrular
// Bağlı:   MenuCard.tsx
// Risk:    Bu test kırılırsa kalori alanının render'dan düşmediği garanti edilemez
// Dokunma: Test çerçevesi Vitest + React Testing Library varsayıldı — package.json'da yoksa kullanıcıya sorulmalı

import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { MenuCard } from "./MenuCard"
import { BowlItem } from "@/types"

const baseItem: BowlItem = {
  id: "sig-teriyaki-tavuk",
  name: "Teriyaki Tavuklu Kase",
  category: "signature",
  price: 245,
  image: "signature-teriyaki-tavuk-kase.webp",
  tags: ["yüksek protein"],
  calories: 540,
  protein: 38,
}

describe("MenuCard", () => {
  it("happy path: kalori, protein ve fiyatı render eder", () => {
    render(<MenuCard item={baseItem} />)
    expect(screen.getByText(/540 kcal/)).toBeInTheDocument()
    expect(screen.getByText(/245₺/)).toBeInTheDocument()
  })

  it("edge case: calories/protein = 0 olsa bile gizlenmez (örn. kombucha)", () => {
    render(<MenuCard item={{ ...baseItem, calories: 0, protein: 0, name: "Kombucha" }} />)
    expect(screen.getByText(/0 kcal/)).toBeInTheDocument()
  })

  it("edge case: boş tags dizisi rozet alanını boş bırakır, hata fırlatmaz", () => {
    render(<MenuCard item={{ ...baseItem, tags: [] }} />)
    expect(screen.queryByText(/yüksek protein/)).not.toBeInTheDocument()
  })

  it("failure path: eksik/boş image alanı kartın çökmesine neden olmaz", () => {
    expect(() =>
      render(<MenuCard item={{ ...baseItem, image: "" }} />)
    ).not.toThrow()
  })
})
