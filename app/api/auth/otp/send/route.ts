// app/api/auth/otp/send/route.ts
// Amaç:    Girilen telefon numarasına Twilio Verify ile OTP kodu gönderir
// Bağlı:   /giris sayfası telefon formu (henüz üretilmedi)
// Risk:    Rate limit yoksa SMS bombalama / kota tükenmesi (BSC-7); Twilio down ise kullanıcı
//          giriş yapamaz (BSC-8 — bu adımda fallback yok, giriş zaten opsiyonel/guest checkout korunuyor)
// Dokunma: CONFIG_SCHEMA.md → TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_VERIFY_SERVICE_SID
//          lib/auth/phone.ts, lib/auth/rate-limit.ts

import twilio from "twilio"
import { isValidTurkishPhone, normalizeToE164 } from "@/lib/auth/phone"
import { checkOtpRateLimit } from "@/lib/auth/rate-limit"

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

export async function POST(req: Request) {
  const { phone } = await req.json().catch(() => ({ phone: undefined }))

  if (!isValidTurkishPhone(phone)) {
    return Response.json({ error: "Geçersiz telefon numarası" }, { status: 400 }) // BSC-3
  }

  const e164Phone = normalizeToE164(phone)

  // BSC-7: IP + telefon bazlı — sadece telefon numarası kullanmak, aynı numaraya farklı
  // IP'lerden gelen isteklerde bombalamayı engellemez, bu yüzden ikisi birleştiriliyor.
  const ip = req.headers.get("x-forwarded-for") ?? "unknown"
  const rateLimit = checkOtpRateLimit(`${ip}:${e164Phone}`)

  if (!rateLimit.allowed) {
    return Response.json(
      { error: "Çok fazla deneme. Lütfen daha sonra tekrar deneyin." },
      { status: 429 }
    )
  }

  try {
    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verifications.create({ to: e164Phone, channel: "sms" })
    return Response.json({ status: "SENT" })
  } catch (err) {
    // BSC-4: structured log + güvenli (detay sızdırmayan) mesaj
    console.error({ event: "OTP_SEND_FAILED", phone: e164Phone, error: String(err) })
    return Response.json({ error: "Kod gönderilemedi, lütfen tekrar deneyin" }, { status: 502 })
  }
}
