// components/order/WhatsAppOrderButton.test.tsx
// Amaç:    WhatsAppOrderButton'ın her koşulda devre dışı kaldığını ve doğru gerekçeyi gösterdiğini doğrular
// Bağlı:   components/order/WhatsAppOrderButton.tsx
// Risk:    Testsiz kalırsa gelecekte yanlışlıkla aktif edilip şube numarası olmadan tıklanabilir hale gelebilir
// Dokunma: INTEGRATIONS.md §0'daki şube numarası durumu değişip bu buton gerçekten bağlanınca bu test seti tamamen yeniden yazılmalı

import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { WhatsAppOrderButton } from "./WhatsAppOrderButton"

describe("WhatsAppOrderButton", () => {
  it("happy path: disabled prop ne olursa olsun buton her zaman disabled render edilir", () => {
    render(<WhatsAppOrderButton disabled={false} />)
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("edge case: disabled=true iken 'önce teslimat şeklini seç' mesajını gösterir", () => {
    render(<WhatsAppOrderButton disabled={true} />)
    expect(screen.getByText(/Önce teslimat şeklini seç/)).toBeInTheDocument()
  })

  it("failure/gap path: disabled=false iken bile şube numarası blokaj mesajını gösterir (BSC-5 ihlali yok)", () => {
    render(<WhatsAppOrderButton disabled={false} />)
    expect(screen.getByText(/Şube telefon numaraları henüz tanımlanmadı/)).toBeInTheDocument()
  })
})
