// lib/db/client.ts
// Amaç:    Neon Postgres'e serverless-uyumlu tek bağlantı noktası sağlar
// Bağlı:   auth.ts, app/api/auth/otp/verify/route.ts, ileride sadakat/profil route'ları
// Risk:    Yanlış/eksik DATABASE_URL → tüm auth akışı 500 döner, kullanıcı giriş yapamaz
// Dokunma: CONFIG_SCHEMA.md → DATABASE_URL (Vercel Marketplace Neon entegrasyonu tarafından
//          Production + Preview environment'larına otomatik enjekte edilir, .env.local'da
//          lokal geliştirme için `vercel env pull` ile çekilmeli)

import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

if (!process.env.DATABASE_URL) {
  // BSC-3: dışarıdan/ortamdan gelen zorunlu değer doğrulanmadan sisteme geçilmiyor
  throw new Error(
    "DATABASE_URL eksik — Vercel Storage → Neon entegrasyonu kontrol edilmeli (CONFIG_SCHEMA.md §2)"
  )
}

const sql = neon(process.env.DATABASE_URL)
export const db = drizzle(sql, { schema })
