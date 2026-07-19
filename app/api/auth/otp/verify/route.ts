// app/api/auth/otp/verify/route.ts
// Amaç:    Girilen kodu Twilio Verify'a doğrular, başarılıysa Auth.js session'ı (JWT) açar
// Bağlı:   /giris sayfası kod formu → auth.ts Credentials provider
// Risk:    Doğrulama idempotent OLMALI (aynı kod çift gönderimde çift oturum açmamalı) — bu
//          versiyonda idempotency garantisi YOK (bilinçli teknik borç, bkz. Test Koşulu notu).
//          Twilio Verify kendi tarafında bir kodu tekrar "approved" döndürmez (kod tek kullanımlık),
//          bu doğal bir idempotency sağlıyor ama bizim tarafta ayrıca kilit yok.
// Dokunma: INTEGRATIONS.md §5.2, §5.4 — edge case'ler orada; auth.ts → authorize() bu route'un
//          Twilio onayına GÜVENİR, kendi başına tekrar doğrulama yapmaz (güvenlik sınırı orada belirtilmiş)

import twilio from "twilio"
import { signIn } from "@/auth"
import { isValidTurkishPhone, normalizeToE164 } from "@/lib/auth/phone"

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

export async function POST(req: Request) {
  const { phone, code } = await req.json().catch(() => ({ phone: undefined, code: undefined }))

  if (!isValidTurkishPhone(phone) || !code || typeof code !== "string") {
    return Response.json({ error: "Geçersiz istek" }, { status: 400 }) // BSC-3
  }

  const e164Phone = normalizeToE164(phone)

  let checkStatus: string
  try {
    const check = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verificationChecks.create({ to: e164Phone, code })
    checkStatus = check.status
  } catch (err) {
    console.error({ event: "OTP_VERIFY_FAILED", phone: e164Phone, error: String(err) }) // BSC-4
    return Response.json({ error: "Doğrulama sırasında hata oluştu" }, { status: 502 })
  }

  if (checkStatus !== "approved") {
    return Response.json({ error: "Kod hatalı veya süresi dolmuş" }, { status: 401 })
  }

  // Bu, kod tabanında signIn('credentials', ...) çağrısının tek meşru yeri (auth.ts'teki yorum).
  await signIn("credentials", { phone: e164Phone, redirect: false })

  return Response.json({ status: "VERIFIED" })
}
