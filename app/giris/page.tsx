// app/giris/page.tsx
// Amaç:    Telefon + OTP giriş akışının kullanıcıya görünen tarafı — iki adımlı form
// Bağlı:   app/api/auth/otp/send/route.ts, app/api/auth/otp/verify/route.ts,
//          lib/auth/phone.ts (client-side format doğrulama, ekstra istek atmadan erken feedback)
// Risk:    Hatalı/eksik hata mesajları kullanıcıyı OTP akışında kilitleyebilir (BSC-3, kullanılabilirlik)
// Dokunma: CONTENT_GUIDE.md §1 (marka sesi) — abartı sıfat yok, doğrudan hitap, aksan riski
//          taşıyan (â/î) kelimelerden kaçınıldı (Karar #14/#16 ile aynı hassasiyet)

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { isValidTurkishPhone } from "@/lib/auth/phone"

type Step = "phone" | "code"

export default function GirisPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("phone")
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!isValidTurkishPhone(phone)) {
      setError("Telefon numaranı 05XX XXX XX XX formatında gir.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Kod gönderilemedi, tekrar dene.")
        return
      }
      setStep("code")
    } catch {
      setError("Bağlantı sorunu oldu, tekrar dene.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (code.length < 4) {
      setError("Kodu eksiksiz gir.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Kod hatalı, tekrar dene.")
        return
      }
      router.push("/")
      router.refresh()
    } catch {
      setError("Bağlantı sorunu oldu, tekrar dene.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-cream px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-bold text-charcoal text-center mb-2">
          Giriş Yap
        </h1>
        <p className="font-body text-sm text-espresso text-center mb-8">
          {step === "phone"
            ? "Telefon numaranla, şifresiz gir."
            : `${phone} numarasına gönderdiğimiz kodu gir.`}
        </p>

        {step === "phone" ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="05XX XXX XX XX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 font-body text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-olive-primary"
              disabled={isSubmitting}
            />
            {error && <p className="font-body text-sm text-red-700">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-olive-primary py-3 font-body font-semibold text-cream transition-opacity duration-200 disabled:opacity-50"
            >
              {isSubmitting ? "Gönderiliyor..." : "Kod Gönder"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Doğrulama kodu"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-center font-body text-charcoal tracking-widest placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-olive-primary"
              disabled={isSubmitting}
            />
            {error && <p className="font-body text-sm text-red-700">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-olive-primary py-3 font-body font-semibold text-cream transition-opacity duration-200 disabled:opacity-50"
            >
              {isSubmitting ? "Doğrulanıyor..." : "Giriş Yap"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("phone")
                setCode("")
                setError(null)
              }}
              className="w-full font-body text-sm text-espresso/70 hover:text-espresso transition-colors duration-200"
            >
              Numarayı değiştir
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
