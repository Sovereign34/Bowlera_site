// lib/db/schema.ts
// Amaç:    Neon Postgres üzerindeki tabloları Drizzle ORM ile tanımlar (şu an: users)
// Bağlı:   lib/db/client.ts, auth.ts, app/api/auth/otp/verify/route.ts
// Risk:    Şema burada bozulursa migration'lar kullanıcı kimlik/oturum verisini bozar
// Dokunma: ARCHITECTURE.md §3 (AuthenticatedUser tipi) + types/index.ts ile senkron tutulmalı —
//          ikisi birbirinden bağımsız değişirse tip/DB uyuşmazlığı doğar (Açık Sorun olarak loglanmalı)

import { pgTable, text, timestamp, integer, uuid } from "drizzle-orm/pg-core"

// DB kararı bu sohbette ERTELENMİYOR (Karar #19 → #20 revizyonu) — ama kapsam bilinçli olarak
// minimal tutuluyor: sadece auth + adres + sadakat puanı zemini. Sipariş geçmişi, ödeme vb.
// bu tabloya dahil DEĞİL (ayrı fazın konusu).
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  phone: text("phone").notNull().unique(), // kimlik anahtarı — Karar #17, "1 numara = 1 hesap"
  address: text("address"), // bu sohbetin konusu — opsiyonel, kullanıcı ilk girişte vermeyebilir
  displayName: text("display_name"),
  loyaltyPoints: integer("loyalty_points").notNull().default(0), // mekanik henüz netleşmedi (Açık Sorun #30)
  verifiedAt: timestamp("verified_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export type UserRow = typeof users.$inferSelect
export type NewUserRow = typeof users.$inferInsert
