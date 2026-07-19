// lib/auth/phone.test.ts
// Amaç:    isValidTurkishPhone / normalizeToE164 için happy + edge + failure testleri
// Bağlı:   lib/auth/phone.ts

import { describe, it, expect } from "vitest"
import { isValidTurkishPhone, normalizeToE164 } from "./phone"

describe("isValidTurkishPhone", () => {
  // Happy path
  it("kabul eder: 05XXXXXXXXX formatı", () => {
    expect(isValidTurkishPhone("05321234567")).toBe(true)
  })

  it("kabul eder: +905XXXXXXXXX formatı", () => {
    expect(isValidTurkishPhone("+905321234567")).toBe(true)
  })

  it("kabul eder: boşluk/tire içeren format", () => {
    expect(isValidTurkishPhone("0532 123 45 67")).toBe(true)
  })

  // Edge case
  it("reddeder: 5 ile başlamayan operatör kodu", () => {
    expect(isValidTurkishPhone("05221234567".replace("52", "42"))).toBe(false)
  })

  it("reddeder: eksik haneli numara", () => {
    expect(isValidTurkishPhone("0532123456")).toBe(false)
  })

  // Failure path
  it("reddeder: boş string", () => {
    expect(isValidTurkishPhone("")).toBe(false)
  })

  it("reddeder: undefined/null benzeri girdi", () => {
    // @ts-expect-error kasıtlı olarak yanlış tip test ediliyor
    expect(isValidTurkishPhone(undefined)).toBe(false)
  })
})

describe("normalizeToE164", () => {
  it("05XXXXXXXXX → +905XXXXXXXXX", () => {
    expect(normalizeToE164("05321234567")).toBe("+905321234567")
  })

  it("geçersiz numarada hata fırlatır", () => {
    expect(() => normalizeToE164("123")).toThrow()
  })
})
