// auth.ts
// Amaç:    Auth.js (NextAuth v5) yapılandırması — Credentials provider + JWT session
// Bağlı:   app/api/auth/otp/verify/route.ts (signIn burayı çağırır), middleware (ileride, header hesap ikonu)
// Risk:    AUTH_SECRET yanlış/eksikse oturum imzalanamaz veya sahte JWT kabul edilebilir (BSC-2)
// Dokunma: INTEGRATIONS.md §5.2 — bu provider'ın authorize() fonksiyonu OTP'yi TEKRAR DOĞRULAMAZ,
//          çünkü telefon numarası buraya sadece app/api/auth/otp/verify/route.ts'in Twilio
//          Verify onayından SONRA gönderilir. Bu route dışında signIn('credentials', ...) asla
//          çağrılmamalı — aksi halde OTP doğrulaması bypass edilmiş olur (KRİTİK güvenlik sınırı).

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "@/lib/db/client"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: { phone: {} },
      async authorize(credentials) {
        const phone = credentials?.phone as string | undefined
        if (!phone) return null // BSC-3: eksik/dışarıdan gelen veri doğrulanmadan geçmiyor

        // Karar #20: kullanıcı DB'de yoksa oluşturulur (ilk giriş), varsa verifiedAt güncellenir.
        // address/displayName/loyaltyPoints burada DOKUNULMAZ — profil güncelleme ayrı bir akış.
        const existing = await db.select().from(users).where(eq(users.phone, phone)).limit(1)

        if (existing.length === 0) {
          await db.insert(users).values({ phone, verifiedAt: new Date() })
        } else {
          await db.update(users).set({ verifiedAt: new Date() }).where(eq(users.phone, phone))
        }

        return { id: phone, phone }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.phone = (user as { phone: string }).phone
      return token
    },
    async session({ session, token }) {
      if (token.phone) session.user = { ...session.user, phone: token.phone as string }
      return session
    },
  },
})
