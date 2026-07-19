// lib/user/profile-validation.test.ts
// Amaç:    validateProfileInput için happy path, edge case ve failure path testleri
// Bağlı:   lib/user/profile-validation.ts
// Risk:    Test eksikse DB'ye geçersiz/aşırı uzun veri yazılması fark edilmez
// Dokunma: AGENT.md Kural #6 — happy + edge + failure zorunlu

import { describe, it, expect } from "vitest"
import { validateProfileInput } from "./profile-validation"

describe("validateProfileInput", () => {
  it("happy path: geçerli adres ve isim kabul edilir", () => {
    const result = validateProfileInput({ address: "Bağdat Cad. No:1", displayName: "Ada" })
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.data.address).toBe("Bağdat Cad. No:1")
      expect(result.data.displayName).toBe("Ada")
    }
  })

  it("edge case: boş string'ler trim sonrası null'a döner (adres/isim silme senaryosu)", () => {
    const result = validateProfileInput({ address: "   ", displayName: "" })
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.data.address).toBeNull()
      expect(result.data.displayName).toBeNull()
    }
  })

  it("edge case: alan hiç gönderilmezse (undefined) null'a döner", () => {
    const result = validateProfileInput({})
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.data.address).toBeNull()
    }
  })

  it("failure path: 300 karakteri aşan adres reddedilir", () => {
    const result = validateProfileInput({ address: "a".repeat(301) })
    expect(result.valid).toBe(false)
  })

  it("failure path: string olmayan girdi (ör. obje/array) sanitize edilip boş kabul edilir", () => {
    const result = validateProfileInput({ address: { evil: true } as unknown as string })
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.data.address).toBeNull()
    }
  })
})
