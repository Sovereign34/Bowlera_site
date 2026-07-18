// components/customizer/AddToCartButton.test.tsx
// Amaç:    Adım guard'ı, BSC-6 çift tıklama koruması ve eksik prop failure path'ini doğrular

import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import AddToCartButton from "./AddToCartButton"

describe("AddToCartButton", () => {
  it("isValid true iken tıklamada onAddToCart bir kez çağrılır (happy path)", () => {
    const onAddToCart = vi.fn()
    render(<AddToCartButton isValid={true} onAddToCart={onAddToCart} />)
    fireEvent.click(screen.getByRole("button", { name: "Sepete Ekle" }))
    expect(onAddToCart).toHaveBeenCalledTimes(1)
  })

  it("isValid false iken buton disabled'dır ve tıklama hiçbir şey yapmaz", () => {
    const onAddToCart = vi.fn()
    render(<AddToCartButton isValid={false} onAddToCart={onAddToCart} />)
    const button = screen.getByRole("button", { name: "Sepete Ekle" })
    expect(button).toBeDisabled()
    fireEvent.click(button)
    expect(onAddToCart).not.toHaveBeenCalled()
  })

  it("hızlı çift tıklamada onAddToCart yalnızca bir kez çağrılır (BSC-6 race condition koruması)", () => {
    const onAddToCart = vi.fn()
    render(<AddToCartButton isValid={true} onAddToCart={onAddToCart} />)
    const button = screen.getByRole("button", { name: "Sepete Ekle" })
    fireEvent.click(button)
    fireEvent.click(button)
    fireEvent.click(button)
    expect(onAddToCart).toHaveBeenCalledTimes(1)
  })

  it("onAddToCart verilmediğinde hata fırlatmaz, güvenli şekilde no-op yapar (failure path)", () => {
    render(<AddToCartButton isValid={true} />)
    const button = screen.getByRole("button", { name: "Sepete Ekle" })
    expect(() => fireEvent.click(button)).not.toThrow()
  })

  it("erişilebilir isim (aria-label) doğru ayarlanmış", () => {
    render(<AddToCartButton isValid={true} />)
    expect(screen.getByRole("button", { name: "Sepete Ekle" })).toBeInTheDocument()
  })
})
