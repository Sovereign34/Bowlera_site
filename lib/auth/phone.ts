// lib/auth/phone.ts
// Amaç:    Türkiye cep telefonu numarasını doğrular ve Twilio'nun beklediği E.164 formatına normalize eder
// Bağlı:   app/api/auth/otp/send/route.ts, app/api/auth/otp/verify/route.ts
// Risk:    Geçersiz format Twilio'ya gidip gereksiz API çağrısı/kota tüketir (BSC-3, BSC-7)
// Dokunma: INTEGRATIONS.md §5.1 — "Geçersiz telefon numarası" edge case'i burada karşılanır

// Kabul edilen girdi formatları: 05XXXXXXXXX, 5XXXXXXXXX, +905XXXXXXXXX, 905XXXXXXXXX
// Türkiye cep telefonu operatör prefix'leri 5 ile başlar (yerleşik/GSM), toplam 10 hane.
const TR_MOBILE_REGEX = /^(?:\+?90)?0?(5\d{9})$/

export function isValidTurkishPhone(rawPhone: string): boolean {
  if (!rawPhone || typeof rawPhone !== "string") return false
  const cleaned = rawPhone.replace(/[\s()-]/g, "")
  return TR_MOBILE_REGEX.test(cleaned)
}

export function normalizeToE164(rawPhone: string): string {
  const cleaned = rawPhone.replace(/[\s()-]/g, "")
  const match = cleaned.match(TR_MOBILE_REGEX)
  if (!match) {
    throw new Error("Geçersiz telefon numarası formatı") // çağıran taraf önce isValidTurkishPhone kontrol etmeli
  }
  return `+90${match[1]}`
}
