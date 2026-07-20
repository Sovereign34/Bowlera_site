// components/order/FulfillmentGate.test.tsx
// Amaç:    FulfillmentGate'in seçim zorunluluğu ve store senkronizasyonunu doğrular
// Bağlı:   components/order/FulfillmentGate.tsx, store/useCartStore.ts
// Risk:    Testsiz kalırsa kanal seçimi görsel olarak çalışıyor gibi görünüp store'a yazmayabilir
// Dokunma: useCartStore'un shape'i değişirse beforeEach'teki setState çağrısı da güncellenmeli

import { render, screen, fireEvent } from "@testing-library/react"
import { describe, expect, it, beforeEach } from "vitest"
import { FulfillmentGate } from "./FulfillmentGate"
import { useCartStore } from "@/store/useCartStore"

describe("FulfillmentGate", () => {
  beforeEach(() => {
    useCartStore.setState({ fulfillmentChannel: null })
  })

  it("happy path: seçim yokken zorunluluk uyarısını gösterir", () => {
    render(<FulfillmentGate />)
    expect(screen.getByText(/Devam etmeden önce teslimat şeklini seç/)).toBeInTheDocument()
  })

  it("edge case: bir seçeneğe tıklanınca store güncellenir ve buton aktif görünür", () => {
    render(<FulfillmentGate />)
    fireEvent.click(screen.getByText("Gel Al"))
    expect(useCartStore.getState().fulfillmentChannel).toBe("pickup")
    expect(screen.getByText("Gel Al")).toHaveAttribute("aria-pressed", "true")
  })

  it("failure/durum path: store'da zaten bir kanal varken doğru buton aktif render edilir", () => {
    useCartStore.setState({ fulfillmentChannel: "dine-in" })
    render(<FulfillmentGate />)
    expect(screen.getByText("Masada")).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByText("Gel Al")).toHaveAttribute("aria-pressed", "false")
  })
})
