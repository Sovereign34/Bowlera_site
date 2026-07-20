// components/order/FulfillmentGate.tsx
// Amaç:    Checkout'ta teslimat kanalı (Gel Al / Masada) seçimini ZORUNLU kılar
// Bağlı:   app/siparis/page.tsx, store/useCartStore.ts (setFulfillmentChannel)
// Risk:    Kanal seçilmeden sipariş ilerlerse teslimat şekli belirsiz kalır (Açık Sorun #26)
// Dokunma: FulfillmentChannel tipi değişirse (yeni kanal eklenirse) OPTIONS dizisi güncellenmeli

"use client"

import { useCartStore } from "@/store/useCartStore"
import type { FulfillmentChannel } from "@/types"

const OPTIONS: { value: FulfillmentChannel; label: string }[] = [
  { value: "pickup", label: "Gel Al" },
  { value: "dine-in", label: "Masada" },
]

export function FulfillmentGate() {
  const channel = useCartStore((state) => state.fulfillmentChannel)
  const setChannel = useCartStore((state) => state.setFulfillmentChannel)

  return (
    <section className="mb-6">
      <p className="mb-2 text-sm text-charcoal/70">
        {channel ? "Teslimat şekli:" : "Devam etmeden önce teslimat şeklini seç:"}
      </p>
      <div className="flex gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setChannel(opt.value)}
            aria-pressed={channel === opt.value}
            className={
              channel === opt.value
                ? "rounded-md border border-olive-deep bg-olive-deep px-4 py-2 text-white"
                : "rounded-md border border-charcoal/20 px-4 py-2"
            }
          >
            {opt.label}
          </button>
        ))}
      </div>
    </section>
  )
}
