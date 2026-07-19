// app/hesap/page.tsx
// Amaç:    Kayıtlı kullanıcının profilini (adres/isim) görüntüleyip düzenleyebileceği sayfa
// Bağlı:   components/account/ProfileForm.tsx
// Risk:    Session kontrolü burada yapılmazsa giriş yapmamış kullanıcı boş/yetkisiz form görür
// Dokunma: auth.ts (session.user.phone) — session yoksa /giris'e yönlendirilir

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/account/ProfileForm"

export default async function AccountPage() {
  const session = await auth()
  if (!session?.user?.phone) {
    redirect("/giris") // BSC-3 uzantısı: yetkisiz erişim formu göstermeden engellenir
  }

  return (
    <main className="mx-auto max-w-md px-4 py-8">
      <h1 className="text-2xl font-serif">Hesabım</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Adresini kaydet, bir sonraki siparişte tekrar yazmana gerek kalmasın.
      </p>
      <div className="mt-6">
        <ProfileForm />
      </div>
    </main>
  )
}
