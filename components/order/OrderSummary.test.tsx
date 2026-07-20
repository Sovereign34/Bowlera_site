// components/order/OrderSummary.test.tsx
// Amaç:    OrderSummary'nin toplam hesaplama ve fallback davranışını doğrular
// Bağlı:   components/order/OrderSummary.tsx
// Risk:    Testsiz kalırsa yanlış toplam fiyat/kalori fark edilmeden canlıya çıkabilir
// Dokunma: CartItem tipi değişirse baseItem fixture'ı da güncellenmeli

import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { OrderSummary } from "./OrderSummary"
import type { CartItem } from "@/types"

const baseItem: CartItem = {
  cartId: "1",
  bowlItem: {
    id: "b1",
    name: "Akdeniz Humuslu Sıcak Kase",
    category: "signature",
    price: 220,
    image: "",
    tags: [],
    calories: 460,
    protein: 17,
  },
  quantity: 2,
  unitPrice: 220,
  unitCalories: 460,
}

describe("OrderSummary", () => {
  it("happy path: ürün adı, adet ve satır/toplam fiyatı doğru gösterir", () => {
    render(<OrderSummary cart={[baseItem]} />)
    expect(screen.getByText(/Akdeniz Humuslu Sıcak Kase × 2/)).toBeInTheDocument()
    expect(screen.getByText("440₺")).toBeInTheDocument()
  })

  it("edge case: bowlItem null ise (özel kase) 'Özel Kase' fallback'i gösterir", () => {
    render(<OrderSummary cart={[{ ...baseItem, bowlItem: null }]} />)
    expect(screen.getByText(/Özel Kase × 2/)).toBeInTheDocument()
  })

  it("failure path: boş sepette NaN üretmeden 0'lı toplam gösterir", () => {
    render(<OrderSummary cart={[]} />)
    expect(screen.getByText(/Toplam · 0 kcal/)).toBeInTheDocument()
    expect(screen.getByText("0₺")).toBeInTheDocument()
    expect(screen.queryByText(/NaN/)).not.toBeInTheDocument()
  })
})
