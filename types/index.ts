// types/index.ts
// Amaç:    BowlItem/CartItem/CustomizerSelection ve customizer bileşen veri modelini tek yerden tanımlar
// Bağlı:   menu-data.json, lib/customizer-data.ts, MenuCard, useCartStore, useCustomizerStore,
//          lib/db/schema.ts (AuthenticatedUser artık DB'deki users tablosuyla kısmen örtüşüyor)
// Risk:    Tip burada bozulursa menü kartı, sepet, customizer state, fiyat hesabı ve auth aynı anda kırılır
// Dokunma: ARCHITECTURE.md §3 (Veri Modeli) + CUSTOMIZER_SPEC.md §3.1 — değişiklik önce orada onaylanmalı
//
// Değişiklik (bu session — Karar #20, DB kararının kısmi revizyonu):
// AuthenticatedUser'a `address` alanı eklendi. Artık DB'de (Neon, lib/db/schema.ts → users
// tablosu) kalıcı saklanıyor — Karar #19'daki "DB tamamen ertelendi" notu bu kapsamda güncellendi.

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

// --- Customizer bileşen kataloğu — CUSTOMIZER_SPEC.md §2, §4 ---
// Şema notu: docs/schema-changes/20260718060000_customizer_selection_5_adim_tip_ve_katalog_eklendi.md

export type CustomizerComponentItem = {
  id: string
  name: string
  price: number // ücretsiz kotaya dahilse hesaplama katmanında (lib/customizer-pricing.ts) 0 sayılır
  calories: number // ZORUNLU (MASTER_PLAN §5.5)
  protein: number // ZORUNLU
  carbs?: number
  fat?: number
}

export type CustomizerExtraOptions = {
  extraAvocado: CustomizerComponentItem
  extraSauce: CustomizerComponentItem
  extraCrunch: CustomizerComponentItem
}

export type CustomizerCatalog = {
  bases: CustomizerComponentItem[]
  mains: CustomizerComponentItem[]
  gardenItems: CustomizerComponentItem[]
  signatureFlavors: CustomizerComponentItem[]
  finishItems: CustomizerComponentItem[]
  extraOptions: CustomizerExtraOptions
}

// --- Customizer seçim state'i — CUSTOMIZER_SPEC.md §3.1 (v1.1, 5 adım) ---

export type CustomizerSelection = {
  base: string | null
  main: string | null
  mainPortion: "single" | "double"
  garden: string[] // max 4 ücretsiz (avokado hariç), sonrası ücretli
  signatureFlavor: string | null
  finish: string[] // max 1 ücretsiz, sonrası ücretli
  extras: {
    extraAvocado: boolean
    extraSauce: boolean
    extraCrunch: boolean
  }
}

export type CustomizerTotals = {
  price: number
  calories: number
  protein: number
  carbs: number
  fat: number
}

// --- Sepet / teslimat kanalı — bkz. docs/schema-changes/
// 20260718070000_cartitem_unitcalories_ve_fulfillment_channel.md ---

// Sepet/oturum seviyesinde tek alan — ürün (CartItem) bazlı DEĞİL.
// Yemeksepeti/Getir/Trendyol bilinçli olarak dahil edilmedi (kullanıcı siteden ayrılıp
// marketplace'e yönlendiriliyor, kendi sepetimiz tamamlanmıyor — ayrı bir UI akışı).
// "delivery" (kendi kurye) ileride buraya eklenecek, CartItem şeması etkilenmeyecek.
export type FulfillmentChannel = "pickup" | "dine-in"

export type CartItem = {
  cartId: string
  bowlItem: BowlItem | null
  customization?: CustomizerSelection
  quantity: number
  unitPrice: number
  unitCalories: number
}

// --- Auth — INTEGRATIONS.md §5, ARCHITECTURE.md §2.7 (Karar #17/#19/#20) ---

export type AuthenticatedUser = {
  phone: string // kimlik anahtarı — Karar #17, "1 numara = 1 hesap"
  verifiedAt: string // ISO timestamp — son OTP doğrulama zamanı
  // Karar #20: DB (Neon, lib/db/schema.ts) artık bu alanları KALICI saklıyor.
  // JWT session bu değerleri taşımaya devam eder (performans, ekstra DB sorgusu önler)
  // ama artık tek kaynak değil — DB güncellenince JWT bir sonraki girişte senkronlanır.
  address?: string
  displayName?: string
  loyaltyPoints?: number // sadakat programı — mekanik henüz netleşmedi (Açık Sorun #30)
}
