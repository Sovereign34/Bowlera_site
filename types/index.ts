// types/index.ts
// Amaç:    BowlItem/CartItem/CustomizerSelection veri modelini tek yerden tanımlar
// Bağlı:   menu-data.json, MenuCard, useCartStore, useCustomizerStore
// Risk:    Tip burada bozulursa menü kartı, sepet ve customizer aynı anda kırılır
// Dokunma: ARCHITECTURE.md §3 (Veri Modeli) — değişiklik önce orada onaylanmalı

export type BowlItem = {
  id: string
  name: string
  category: "signature" | "build-your-own" | "içecek"
  price: number
  image: string
  tags: string[]
  allergens?: ("gluten" | "dairy" | "nuts" | "soy" | "shellfish")[]
  calories: number // ZORUNLU alan — opsiyonel değil (MASTER_PLAN §5.5)
  protein: number // ZORUNLU alan
  carbs?: number
  fat?: number
}

export type CustomizerSelection = {
  base: string
  protein: string
  toppings: string[]
  sauce: string
}

export type CartItem = {
  cartId: string
  bowlItem: BowlItem | null
  customization?: CustomizerSelection
  quantity: number
  unitPrice: number
  unitCalories: number
}
