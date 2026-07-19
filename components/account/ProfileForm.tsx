// components/account/ProfileForm.tsx
// Amaç:    Adres/isim inputlarını render eder, useProfileForm hook'una bağlanır
// Bağlı:   app/hesap/page.tsx
// Risk:    Hatalı render → kullanıcı adresini kaydettiğini sanıp aslında kaydedemez
// Dokunma: useProfileForm.ts kontratı değişirse burası da güncellenmeli
//
// ⚠️ Açık Sorun (yeni): Buton/renk sınıfları ("bg-olive-600" vb.) DESIGN_SYSTEM.md görülmeden
// TAHMİN edildi — gerçek tailwind.config.ts token adıyla teyit edilmeli (Kural #7 riski).

"use client"

import { useProfileForm } from "./useProfileForm"

export function ProfileForm() {
  const { address, setAddress, displayName, setDisplayName, status, errorMessage, save } =
    useProfileForm()

  if (status === "loading") return <p>Yükleniyor...</p>

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        save()
      }}
      className="space-y-4"
    >
      <label className="block">
        <span className="text-sm font-medium">İsim</span>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="mt-1 w-full rounded border px-3 py-2"
          maxLength={60}
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Adres</span>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 w-full rounded border px-3 py-2"
          maxLength={300}
          rows={3}
        />
      </label>
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      <button
        type="submit"
        disabled={status === "saving"}
        className="rounded bg-olive-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {status === "saving" ? "Kaydediliyor..." : "Kaydet"}
      </button>
      {status === "saved" && <p className="text-sm text-green-700">Kaydedildi.</p>}
    </form>
  )
}
