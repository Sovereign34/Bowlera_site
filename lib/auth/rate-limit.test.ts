// lib/auth/rate-limit.test.ts
// Amaç:    checkOtpRateLimit için happy + edge + failure testleri
// Bağlı:   lib/auth/rate-limit.ts

import { describe, it, expect, beforeEach, vi } from "vitest"
import { checkOtpRateLimit, _resetRateLimitStore } from "./rate-limit"

describe("checkOtpRateLimit", () => {
  beforeEach(() => {
    _resetRateLimitStore()
    vi.useRealTimers()
  })

  // Happy path
  it("ilk istekte izin verir", () => {
    expect(checkOtpRateLimit("1.1.1.1:+905321234567").allowed).toBe(true)
  })

  it("limit altında kalan ardışık istekleri kabul eder", () => {
    const key = "1.1.1.1:+905321234568"
    checkOtpRateLimit(key)
    checkOtpRateLimit(key)
    expect(checkOtpRateLimit(key).allowed).toBe(true) // 3. istek, limit dahilinde
  })

  // Edge case
  it("limiti aşan isteği reddeder", () => {
    const key = "1.1.1.1:+905321234569"
    checkOtpRateLimit(key)
    checkOtpRateLimit(key)
    checkOtpRateLimit(key)
    const fourth = checkOtpRateLimit(key)
    expect(fourth.allowed).toBe(false)
    expect(fourth.retryAfterMs).toBeGreaterThan(0)
  })

  it("farklı anahtarlar (farklı IP+telefon) birbirini etkilemez", () => {
    const keyA = "1.1.1.1:+905321234570"
    const keyB = "2.2.2.2:+905321234570"
    checkOtpRateLimit(keyA)
    checkOtpRateLimit(keyA)
    checkOtpRateLimit(keyA)
    expect(checkOtpRateLimit(keyB).allowed).toBe(true)
  })

  // Failure/pencere sıfırlama davranışı
  it("pencere süresi dolunca sayaç sıfırlanır", () => {
    vi.useFakeTimers()
    const key = "1.1.1.1:+905321234571"
    checkOtpRateLimit(key)
    checkOtpRateLimit(key)
    checkOtpRateLimit(key)
    vi.advanceTimersByTime(10 * 60 * 1000 + 1)
    expect(checkOtpRateLimit(key).allowed).toBe(true)
    vi.useRealTimers()
  })
})
