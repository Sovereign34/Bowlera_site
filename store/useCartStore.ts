// store/useCartStore.ts
// Amaç:    Sepet state'ini yönetir (CartItem[]) — ekleme, çıkarma, tarayıcı kapansa da kalıcılık (persist)
// Bağlı:   components/customizer/AddToCartButton.tsx (onAddToCart üzerinden), components/cart/CartDrawer.tsx, CartBadge.tsx
// Risk:    Persist bozulursa veya removeFromCart yanlış cartId silerse kullanıcı yanlış/eksik sipariş verir.
//          fulfillmentChannel yanlış/boş kalırsa sipariş hangi kanaldan teslim edileceği belirsiz kalır.
// Dokunma: DEPENDENCIES.md §2 (Bileşen→Store) — yeni tüketici eklenirse oraya satır eklenmeli
//
// Değişiklik (bu session — ekleme, bkz. docs/schema-changes/
// 20260718070000_cartitem_unitcalories_ve_fulfillment_channel.md):
// fulfillmentChannel eklendi — sepet/oturum seviyesinde tek alan, ürün bazlı değil.
// Persist zaten tüm store state'ini kapsadığı için (partialize kullanılmıyor) ek konfigürasyon
// gerekmedi — fulfillmentChannel otomatik olarak "bowlera-cart" localStorage anahtarına yazılır.
//
// Edge case'ler:
// 1. Kanal seçilmeden sepete ürün eklenir — sorun değil, bu store'un sorumluluğu değil;
//    checkout ekranı (app/siparis) kanalı zorunlu kılmalı (henüz yazılmadı, ayrı görev).
// 2. clearCart() çağrılınca fulfillmentChannel SIFIRLANMIYOR — kullanıcı sepeti boşaltıp
//    yeniden sipariş verirken kanal tercihini kaybetmesin diye (VARSAYIM — onaylanmadı).
// 3. Eski localStorage verisinde ("bowlera-cart") fulfillmentChannel alanı yoksa (önceki
//    şemadan gelen kullanıcılar) hydration'da undefined gelir — başlangıç değeri null
//    olduğu için tip güvenliği bozulmaz, sadece kullanıcı kanalı yeniden seçmek zorunda kalır.
// 4. setFulfillmentChannel her zaman kapalı bir buton seti (pickup/dine-in) üzerinden
//    çağrılacağı için serbest metin girdisi yok — BSC-3 runtime validasyonu gerekmiyor.

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, FulfillmentChannel } from "@/types"

type CartState = {
  cart: CartItem[]
  fulfillmentChannel: FulfillmentChannel | null
  addToCart: (item: CartItem) => void
  removeFromCart: (cartId: string) => void
  setFulfillmentChannel: (channel: FulfillmentChannel) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      fulfillmentChannel: null,

      addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),

      // BSC-3: olmayan/geçersiz cartId sessizce yok sayılır (filter no-op) — yanlış satırı silme riski yok
      removeFromCart: (cartId) =>
        set((state) => ({ cart: state.cart.filter((item) => item.cartId !== cartId) })),

      setFulfillmentChannel: (channel) => set({ fulfillmentChannel: channel }),

      // NOT: fulfillmentChannel bilinçli olarak sıfırlanmıyor (bkz. Edge case #2)
      clearCart: () => set({ cart: [] }),
    }),
    { name: "bowlera-cart" } // localStorage key
  )
)
