// types/next-auth.d.ts
// Amaç:    Auth.js'in Session/JWT/User tiplerine `phone` alanını ekler (module augmentation)
// Bağlı:   auth.ts — jwt() ve session() callback'leri bu tiplere göre derlenir
// Risk:    Bu dosya olmadan session.user.phone / token.phone erişimi derleme hatası verir
// Dokunma: auth.ts değişirse (örn. yeni bir custom alan eklenirse) burası da güncellenmeli

import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      phone?: string
    } & DefaultSession["user"]
  }
  interface User {
    phone?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    phone?: string
  }
}
