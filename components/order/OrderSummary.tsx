// components/order/OrderSummary.tsx
// Amaç:    Sepetteki ürünleri (ad, adet, fiyat) ve toplam fiyat/kaloriyi listeler
// Bağlı:   app/siparis/page.tsx
// Risk:    Yanlış toplam gösterilirse kullanıcı yanlış tutarla sipariş verdiğini sanır
// Dokunma: CartItem tipi değişirse (types/index.ts) bu bileşen de güncellenmeli

import type { CartItem } from "@/types"

type Props = { cart: CartItem[] }

export function OrderSummary({ cart }: Props) {
  const totalPrice = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const totalCalories = cart.reduce((sum, item) => sum + item.unitCalories * item.quantity, 0)

  return (
    <section className="mb-6 divide-y divide-charcoal/10 rounded-lg border border-charcoal/10">
      {cart.map((item) => (
        <div key={item.cartId} className="flex items-center justify-between px-4 py-3">
          <span>
            {item.bowlItem?.name ?? "Özel Kase"} × {item.quantity}
          </span>
          <span>{item.unitPrice * item.quantity}₺</span>
        </div>
      ))}
      <div className="flex items-center justify-between px-4 py-3 font-semibold text-olive-deep">
        <span>Toplam · {totalCalories} kcal</span>
        <span>{totalPrice}₺</span>
      </div>
    </section>
  )
}
