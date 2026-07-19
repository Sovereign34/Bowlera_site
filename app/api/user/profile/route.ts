// app/api/user/profile/route.ts
// Amaç:    GET — oturum sahibinin profilini (address, displayName) döner.
//          PATCH — oturum sahibinin profilini günceller.
// Bağlı:   app/hesap/page.tsx, components/account/useProfileForm.ts,
//          lib/db/queries/user-profile.ts, lib/user/profile-validation.ts, lib/auth/rate-limit.ts
// Risk:    Kimlik SADECE session.user.phone'dan alınır — request body'den phone KABUL EDİLMEZ
//          (BSC-3 kritik sınır, ARCHITECTURE.md §1 Katman Sınırı Kuralı madde 8). Bu route
//          dışında hiçbir yol users tablosuna adres/isim yazamaz.
// Dokunma: lib/db/schema.ts'teki users tablosu şeması değişirse lib/user/profile-validation.ts
//          ve lib/db/queries/user-profile.ts da güncellenmeli
//
// Değişiklik (BU SESSION — DÜZELTME, kullanıcı talebiyle "#37: rate-limit entegre et"):
// PATCH'e checkProfileRateLimit eklendi. Anahtar olarak session.user.phone kullanılıyor —
// IP DEĞİL, çünkü bu route zaten auth zorunlu (guest erişemez), phone benzersiz ve sahteciliğe
// kapalı (session'dan geliyor, request body'den değil). GET'e rate-limit eklenmedi: salt okuma,
// kötüye kullanım maliyeti PATCH'e göre ihmal edilebilir düzeyde (DB'ye yazma yok).

import { auth } from "@/auth"
import { getUserProfile, updateUserProfile } from "@/lib/db/queries/user-profile"
import { validateProfileInput } from "@/lib/user/profile-validation"
import { checkProfileRateLimit } from "@/lib/auth/rate-limit"

export async function GET() {
  const session = await auth()
  const phone = session?.user?.phone

  if (!phone) {
    return Response.json({ error: "Oturum bulunamadı." }, { status: 401 })
  }

  const profile = await getUserProfile(phone)

  if (!profile) {
    // Kullanıcı auth.ts'te ilk girişte otomatik oluşturulur (Karar #20) — teorik olarak
    // buraya düşmemeli, ama savunmacı olarak boş profil döndürülüyor (BSC-8).
    return Response.json({ address: null, displayName: null })
  }

  return Response.json({
    address: profile.address ?? null,
    displayName: profile.displayName ?? null,
  })
}

export async function PATCH(request: Request) {
  const session = await auth()
  const phone = session?.user?.phone

  if (!phone) {
    return Response.json({ error: "Oturum bulunamadı." }, { status: 401 })
  }

  const rateLimit = checkProfileRateLimit(phone)
  if (!rateLimit.allowed) {
    const retryAfterSeconds = Math.ceil((rateLimit.retryAfterMs ?? 0) / 1000)
    return Response.json(
      { error: "Çok fazla güncelleme isteği gönderildi. Lütfen biraz sonra tekrar dene." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    )
  }

  const body = await request.json().catch(() => null)
  if (!body) {
    return Response.json({ error: "Geçersiz istek gövdesi." }, { status: 400 })
  }

  const result = validateProfileInput(body)
  if (!result.valid) {
    return Response.json({ error: result.error }, { status: 400 })
  }

  await updateUserProfile(phone, result.data)

  return Response.json({ address: result.data.address, displayName: result.data.displayName })
}
