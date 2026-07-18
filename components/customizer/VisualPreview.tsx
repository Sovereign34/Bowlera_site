// components/customizer/VisualPreview.tsx
// Amaç:    Seçimlere göre katmanlı (CSS/SVG) kâse görselini z-index sırasıyla render eder
// Bağlı:   store/useCustomizerStore.ts (selections), lib/customizer-data.ts, lib/customizer-visual-layers.ts
// Risk:    Yanlış katman gösterimi → kullanıcı yanlış ürünü sipariş ettiği algısına kapılır (CUSTOMIZER_SPEC.md §5)
// Dokunma: CUSTOMIZER_SPEC.md §5.1 — yeni malzeme eklenirse ilgili .webp katmanı public/images/layers/'a eklenmeli

"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useCustomizerStore } from "@/store/useCustomizerStore"
import { customizerCatalog } from "@/lib/customizer-data"
import { getVisualLayers } from "@/lib/customizer-visual-layers"

type Props = {
  className?: string
}

export default function VisualPreview({ className }: Props) {
  const selections = useCustomizerStore((state) => state.selections)
  const reduceMotion = useReducedMotion()
  const layers = getVisualLayers(selections, customizerCatalog)

  return (
    <div
      className={`relative aspect-square w-full overflow-hidden rounded-full bg-cream ${className ?? ""}`}
      role="img"
      aria-label="Kâse önizlemesi"
    >
      {layers.map((layer) => (
        <motion.img
          key={layer.id}
          src={layer.src}
          alt=""
          aria-hidden="true"
          style={{ zIndex: layer.zIndex }}
          className="absolute inset-0 h-full w-full object-contain"
          initial={false}
          animate={
            reduceMotion
              ? { opacity: layer.active ? 1 : 0 }
              : { opacity: layer.active ? 1 : 0, scale: layer.active ? 1 : 0.9 }
          }
          transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
        />
      ))}
    </div>
  )
}
