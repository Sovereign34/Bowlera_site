// app/api/auth/[...nextauth]/route.ts
// Amaç:    Auth.js'in kendi iç route'larını (session, csrf, callback) karşılar
// Bağlı:   auth.ts — handlers buradan export edilir, Auth.js App Router konvansiyonu gereği
// Risk:    Bu dosya silinirse/yanlış konumlanırsa Auth.js session yönetimi tamamen çalışmaz
// Dokunma: auth.ts değişmeden bu dosyaya dokunulmaz — sadece re-export

import { handlers } from "@/auth"

export const { GET, POST } = handlers
