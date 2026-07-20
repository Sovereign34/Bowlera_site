// app/siparis/page.tsx
// Amaç:    Checkout sayfası — sepet özeti + ZORUNLU teslimat kanalı seçimi + sipariş CTA'sı
// Bağlı:   store/useCartStore.ts, components/order/{OrderSummary,FulfillmentGate,WhatsAppOrderButton}.tsx
// Risk:    Kanal seçimi zorunlu kılınmazsa teslimat şekli belirsiz sipariş oluşur (Açık Sorun #26)
// Dokunma: ARCHITECTURE.md §1 Katman Sınırı Kuralı 7 — guest checkout burada da korunmalı,
//          bu sayfa auth ZORUNLU KILAMAZ (oturum kontrolü bilinçli olarak yapılmıyor)

"use client"

import { useCartStore } from "@/store/useCartStore"
import { OrderSummary } from "@/components/order/OrderSummary"
import { FulfillmentGate } from "@/components/order/FulfillmentGate"
import { WhatsAppOrderButton } from "@/components/order/WhatsAppOrderButton"

export default function OrderPage() {
  const cart = useCartStore((state) => state.cart)
  const fulfillmentChannel = useCartStore((state) => state.fulfillmentChannel)

  if (cart.length === 0) {
    return (
      <main className="px-4 py-12 text-center text-charcoal/70">
        Sepetin boş — sipariş vermek için önce menüden ürün ekle.
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 font-heading text-3xl text-olive-deep">Siparişi Tamamla</h1>
      <OrderSummary cart={cart} />
      <FulfillmentGate />
      <WhatsAppOrderButton disabled={!fulfillmentChannel} />
    </main>
  )
}
