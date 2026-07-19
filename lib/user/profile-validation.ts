// lib/user/profile-validation.ts
// Amaç:    Profil güncelleme (adres/isim) girdisini doğrular ve temizler
// Bağlı:   app/api/user/profile/route.ts
// Risk:    Doğrulama atlanırsa DB'ye aşırı uzun/zararlı veri yazılabilir (BSC-3)
// Dokunma: ARCHITECTURE.md §3 AuthenticatedUser tipiyle uyumlu tutulmalı

const MAX_ADDRESS_LENGTH = 300
const MAX_NAME_LENGTH = 60

export type ProfileUpdateInput = {
  address?: unknown
  displayName?: unknown
}

export type ProfileValidationResult =
  | { valid: true; data: { address: string | null; displayName: string | null } }
  | { valid: false; error: string }

export function validateProfileInput(input: ProfileUpdateInput): ProfileValidationResult {
  const rawAddress = typeof input.address === "string" ? input.address : ""
  const rawName = typeof input.displayName === "string" ? input.displayName : ""
  const address = rawAddress.trim()
  const displayName = rawName.trim()

  if (address.length > MAX_ADDRESS_LENGTH) {
    return { valid: false, error: `Adres en fazla ${MAX_ADDRESS_LENGTH} karakter olabilir.` }
  }
  if (displayName.length > MAX_NAME_LENGTH) {
    return { valid: false, error: `İsim en fazla ${MAX_NAME_LENGTH} karakter olabilir.` }
  }

  return {
    valid: true,
    data: {
      address: address.length > 0 ? address : null,
      displayName: displayName.length > 0 ? displayName : null,
    },
  }
}
