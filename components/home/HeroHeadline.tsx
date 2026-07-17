// components/home/HeroHeadline.tsx
// Amaç:    Hero başlığını kelime bazlı staggered fade+slide ile render eder
// Bağlı:   Hero.tsx
// Risk:    Framer Motion yanlış kurulursa LCP gecikir — bu yüzden yalnızca transform/opacity kullanılır
// Dokunma: DESIGN_SYSTEM.md §6.1 satır 1 — 600ms ease-out, 80ms stagger

'use client'

import { motion } from 'framer-motion'

const WORDS = ['Şehrin', 'Ritmini', 'Yakalayan', 'Taze', 've', 'Sağlıklı', 'Kaseler']

export function HeroHeadline() {
  return (
    <h1 className="font-display text-4xl md:text-6xl font-bold text-charcoal flex flex-wrap gap-x-3">
      {WORDS.map((word, i) => (
        <motion.span
          key={word}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.08 }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  )
}
