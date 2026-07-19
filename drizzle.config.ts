// drizzle.config.ts
// Amaç:    drizzle-kit CLI'nin (generate/push/studio) şema ve bağlantı konumunu bulmasını sağlar
// Bağlı:   lib/db/schema.ts, package.json (db:generate/db:push/db:studio script'leri)
// Risk:    DATABASE_URL yoksa migration komutları çalışmaz — CONFIG_SCHEMA.md'ye bakılmalı

import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
