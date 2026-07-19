// lib/db/queries/user-profile.ts
// Amaç:    users tablosunda adres/isim okuma ve güncelleme sorgularını izole eder
// Bağlı:   app/api/user/profile/route.ts
// Risk:    Sorgu phone dışında bir alanla filtrelenirse başka kullanıcının verisi okunur/yazılır
// Dokunma: lib/db/schema.ts (users tablosu) ile senkron tutulmalı

import { db } from "@/lib/db/client"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function getUserProfile(phone: string) {
  const rows = await db.select().from(users).where(eq(users.phone, phone)).limit(1)
  return rows[0] ?? null
}

export async function updateUserProfile(
  phone: string,
  data: { address: string | null; displayName: string | null }
) {
  await db.update(users).set(data).where(eq(users.phone, phone))
}
