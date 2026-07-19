// lib/auth/rate-limit.ts
// Amaç:    OTP gönderme isteklerini IP+telefon bazlı token-bucket ile sınırlar (BSC-7)
// Bağlı:   app/api/auth/otp/send/route.ts
// Risk:    Rate limit yoksa SMS bombalama / Twilio kotası tükenmesi — hesap askıya alınabilir
// Dokunma: FAILURE_PATTERNS.md → "üçüncü parti kota aşımı" senaryosuna referans verir
//
// ⚠️ BİLİNÇLİ TEKNİK BORÇ (tahmin değil, açık gap-flag): Bu implementasyon in-memory Map
// kullanıyor. Vercel serverless fonksiyonları her istekte aynı instance'ı garanti etmez —
// çoklu instance'larda sayaç paylaşılmaz, rate limit "gevşek" çalışır (tam garantisiz).
// Gerçek trafik ölçeğinde Upstash Redis (Vercel Marketplace) gibi paylaşımlı bir store'a
// geçilmeli. Şimdilik MVP için kabul edilebilir — SMS bombalama riskini SIFIRA indirmez ama
// tek instance'ta (çoğu düşük-trafik senaryosu) etkili çalışır.

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

const WINDOW_MS = 10 * 60 * 1000 // 10 dakika — Twilio Verify kod geçerlilik süresiyle uyumlu
const MAX_REQUESTS = 3 // aynı anahtar için 10dk'da en fazla 3 OTP isteği

export function checkOtpRateLimit(key: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true }
  }

  if (bucket.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfterMs: bucket.resetAt - now }
  }

  bucket.count += 1
  return { allowed: true }
}

// Test/temizlik amaçlı — production kodunda çağrılmaz
export function _resetRateLimitStore(): void {
  buckets.clear()
}
