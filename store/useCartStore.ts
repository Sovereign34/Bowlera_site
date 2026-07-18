// store/useCartStore.ts
// Amaç:    Sepet state'ini yönetir (CartItem[]) — ekleme, çıkarma, tarayıcı kapansa da kalıcılık (persist)
// Bağlı:   components/customizer/AddToCartButton.tsx (onAddToCart üzerinden), components/cart/CartDrawer.tsx, CartBadge.tsx
// Risk:    Persist bozulursa veya removeFromCart yanlış cartId silerse kullanıcı yanlış/eksik sipariş verir
// Dokunma: DEPENDENCIES.md §2 (Bileşen→Store) — yeni tüketici eklenirse oraya satır eklenmeli

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem } from "@/types"

type CartState = {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (cartId: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],

      addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),

      // BSC-3: olmayan/geçersiz cartId sessizce yok sayılır (filter no-op) — yanlış satırı silme riski yok
      removeFromCart: (cartId) =>
        set((state) => ({ cart: state.cart.filter((item) => item.cartId !== cartId) })),

      clearCart: () => set({ cart: [] }),
    }),
    { name: "bowlera-cart" } // localStorage key
  )
)
