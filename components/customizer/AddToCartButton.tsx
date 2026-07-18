// components/customizer/AddToCartButton.tsx
// Amaç:    "Sepete Ekle" CTA'sını render eder — yalnızca zorunlu adımlar (1/2/4) tamamlanmışsa aktif
// Bağlı:   components/customizer/SummaryPanel.tsx · (Oturum 4'te) store/useCartStore.ts'e onAddToCart ile bağlanacak
// Risk:    Guard'sız çift tıklama aynı ürünü iki kez sepete ekler (BSC-6); eksik seçimle sepete ekleme hatalı sipariş oluşturur
// Dokunma: CUSTOMIZER_SPEC.md §7 — race condition koruması ve isStepValid(5) kuralı burada uygulanır

"use client"

import { useRef } from "react"
import { motion, useAnimationControls, useReducedMotion } from "framer-motion"

type Props = {
  isValid: boolean
  // Oturum 3'te useCartStore henüz yok (ROADMAP.md — Oturum 4 kapsamı) — bilinçli bağımlılık ayrımı (AGENT.md Kural #5).
  // Gerçek sepete ekleme mantığı bu prop üzerinden Oturum 4'te enjekte edilecek.
  onAddToCart?: () => void
}

const DOUBLE_CLICK_LOCK_MS = 500

export default function AddToCartButton({ isValid, onAddToCart }: Props) {
  const isAdding = useRef(false)
  const controls = useAnimationControls()
  const reduceMotion = useReducedMotion()

  const handleClick = () => {
    if (isAdding.current || !isValid) return // BSC-6 kilidi + adım guard
    if (!onAddToCart) {
      // BSC-4: sessiz catch yasak — geliştiriciye net, structured uyarı
      console.warn("[AddToCartButton] onAddToCart henüz bağlanmadı — useCartStore Oturum 4'te üretilecek")
      return
    }
    isAdding.current = true
    if (!reduceMotion) controls.start({ scale: [0.95, 1.05, 1], transition: { duration: 0.3, type: "spring" } })
    onAddToCart()
    setTimeout(() => {
      isAdding.current = false
    }, DOUBLE_CLICK_LOCK_MS)
  }

  return (
    <div className="group relative rounded-lg p-[2px]">
      {/* CTA hover kenarlığı — logo-degradenin izinli 4 kullanım yerinden biri (DESIGN_SYSTEM §2.1.3) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{ background: "linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)" }}
      />
      <motion.button
        type="button"
        animate={controls}
        disabled={!isValid}
        onClick={handleClick}
        aria-label="Sepete Ekle"
        className="relative w-full rounded-lg bg-olive-primary px-4 py-3 font-body font-semibold text-cream
                   disabled:cursor-not-allowed disabled:opacity-50"
      >
        Sepete Ekle
      </motion.button>
    </div>
  )
}
