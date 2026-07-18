// components/cart/FulfillmentChannelSelector.tsx
// Amaç:    Sepette teslimat kanalı (Gel-Al / Masaya Servis) seçtirir — sepet/oturum seviyesinde tek alan
// Bağlı:   store/useCartStore.ts (fulfillmentChannel, setFulfillmentChannel)
// Risk:    Kanal yanlış/boş seçilirse sipariş nereye hazırlanacağı belirsiz kalır — checkout ekranı
//          bu alanı zorunlu kılmalı (henüz yazılmadı, bkz. SESSION_INDEX.md açık görev)
// Dokunma: docs/schema-changes/20260718070000_cartitem_unitcalories_ve_fulfillment_channel.md

"use client"

import { useCartStore } from "@/store/useCartStore"
import type { FulfillmentChannel } from "@/types"

const CHANNELS: { value: FulfillmentChannel; label: string }[] = [
  { value: "pickup", label: "Gel-Al" },
  { value: "dine-in", label: "Masaya Servis" },
]

export default function FulfillmentChannelSelector() {
  const fulfillmentChannel = useCartStore((state) => state.fulfillmentChannel)
  const setFulfillmentChannel = useCartStore((state) => state.setFulfillmentChannel)

  return (
    <div className="mb-4">
      <p className="mb-2 font-body text-sm text-espresso">Nasıl teslim alacaksın?</p>
      <div className="flex gap-2">
        {CHANNELS.map((channel) => {
          const isSelected = fulfillmentChannel === channel.value
          return (
            <button
              key={channel.value}
              type="button"
              onClick={() => setFulfillmentChannel(channel.value)}
              aria-pressed={isSelected}
              className={`flex-1 rounded-full border px-3 py-2 font-body text-sm transition-colors ${
                isSelected
                  ? "border-olive-deep bg-olive-deep text-cream"
                  : "border-olive-deep/30 text-charcoal"
              }`}
            >
              {channel.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
