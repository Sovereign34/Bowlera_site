// components/account/useProfileForm.ts
// Amaç:    Profil formunun state'ini yönetir — mevcut profili yükler, güncellemeyi kaydeder
// Bağlı:   components/account/ProfileForm.tsx
// Risk:    Çift submit korumasız kalırsa aynı güncelleme isteği birden fazla kez DB'ye gider (BSC-6)
// Dokunma: app/api/user/profile/route.ts ile kontrat senkron tutulmalı

import { useEffect, useState } from "react"

type Status = "loading" | "idle" | "saving" | "saved" | "error"

export function useProfileForm() {
  const [address, setAddress] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [status, setStatus] = useState<Status>("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        setAddress(data.address ?? "")
        setDisplayName(data.displayName ?? "")
        setStatus("idle")
      })
      .catch(() => {
        setErrorMessage("Profil yüklenemedi. Sayfayı yenilemeyi dene.")
        setStatus("error") // BSC-8: yükleme başarısızsa boş formla sessizce devam edilmez
      })
  }, [])

  async function save() {
    if (status === "saving") return // BSC-6: çift submit koruması
    setStatus("saving")
    setErrorMessage(null)
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, displayName }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setErrorMessage(data.error ?? "Bir hata oluştu.")
      setStatus("error")
      return
    }
    setStatus("saved")
  }

  return { address, setAddress, displayName, setDisplayName, status, errorMessage, save }
}
