// components/cart/CartDrawer.tsx
// Amaç:    Sepet çekmecesini render eder — teslimat kanalı seçici, ürün listesi, adet, toplam fiyat, ürün kaldırma
// Bağlı:   store/useCartStore.ts (cart, removeFromCart, fulfillmentChannel), FulfillmentChannelSelector.tsx
// Risk:    Toplam yanlış hesaplanırsa veya removeFromCart hatalı satır silerse kullanıcı yanlış sipariş verir
// Dokunma: types/index.ts (CartItem) — bowlItem null olabilir (customizer ürünleri), bu durumda "Özel Kâse" gösterilir
//
// Değişiklik (bu session — bugfix): Header.tsx'teki `backdrop-blur` sınıfı <header>'ı
// `position:fixed` için yeni bir containing block yapıyordu — CartDrawer viewport yerine
// header'ın küçük kutusuna sıkışıp içeriği sayfaya taşıyordu (Hero ile görsel çakışma).
// Çözüm: CartDrawer artık React Portal ile doğrudan document.body'ye render ediliyor,
// Header'ın stacking context'inden tamamen bağımsız. Header.tsx'e dokunulmadı.

"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useCartStore } from "@/store/useCartStore"
import FulfillmentChannelSelector from "./FulfillmentChannelSelector"

function formatPrice(value: number): string {
  return `₺${value.toFixed(2)}`
}

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: Props) {
  const cart = useCartStore((state) => state.cart)
  const removeFromCart = useCartStore((state) => state.removeFromCart)

  // Portal hedefi (document.body) yalnızca client'ta mevcut — SSR'da render etmiyoruz.
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isOpen || !isMounted) return null

  const total = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

  const drawer = (
    <div className="fixed inset-0 z-50 flex justify-end bg-charcoal/40" onClick={onClose}>
      <div
        className="h-full w-full max-w-sm bg-cream p-4 shadow-xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-label="Sepet"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-charcoal">Sepetim</h2>
          <button type="button" onClick={onClose} aria-label="Kapat" className="text-charcoal">
            ✕
          </button>
        </div>

        <FulfillmentChannelSelector />

        {cart.length === 0 ? (
          <p className="font-body text-espresso">Sepetiniz boş.</p>
        ) : (
          <>
            <ul className="space-y-3">
              {cart.map((item) => (
                <li
                  key={item.cartId}
                  className="flex items-center justify-between gap-2 border-b border-olive-deep/20 pb-2"
                >
                  <div className="font-body">
                    <p className="font-semibold text-charcoal">{item.bowlItem?.name ?? "Özel Kase"}</p>
                    <p className="text-sm text-espresso">
                      {item.quantity} × {formatPrice(item.unitPrice)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.cartId)}
                    aria-label="Ürünü kaldır"
                    className="text-sm text-espresso underline"
                  >
                    Kaldır
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between font-body font-semibold text-charcoal">
              <span>Toplam</span>
              <span>{formatPrice(total)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )

  return createPortal(drawer, document.body)
}
