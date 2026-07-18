// components/cart/CartBadge.tsx
// Amaç:    Header'daki sepet ikonu üzerinde ürün adedini gösterir, sayı değişince logo-degrade "pulse" oynatır
// Bağlı:   store/useCartStore.ts (cart.length)
// Risk:    Yanlış/gecikmiş sayı → kullanıcı sepetinde kaç ürün olduğuna güvenemez
// Dokunma: DESIGN_SYSTEM.md §2.1 (logo-degrade badge kullanımı — izinli 4 yerden biri), §6.1 (400ms spring)

"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimationControls, useReducedMotion } from "framer-motion"
import { useCartStore } from "@/store/useCartStore"

export default function CartBadge() {
  const count = useCartStore((state) => state.cart.length)
  const controls = useAnimationControls()
  const reduceMotion = useReducedMotion()
  const prevCount = useRef(count)

  useEffect(() => {
    if (count !== prevCount.current && !reduceMotion) {
      controls.start({ scale: [1, 1.3, 1], transition: { duration: 0.4, type: "spring" } })
    }
    prevCount.current = count
  }, [count, controls, reduceMotion])

  if (count === 0) return null

  return (
    <motion.span
      animate={controls}
      aria-label={`Sepette ${count} ürün`}
      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold text-cream"
      style={{ background: "linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)" }}
    >
      {count}
    </motion.span>
  )
}
