// lib/customizer-data.ts
// Amaç:    "Kâseni Yarat" bileşen kataloğunun tek veri kaynağı (Base/Main/Garden/Signature Flavor/Finish/Extras)
// Bağlı:   store/useCustomizerStore.ts, lib/customizer-pricing.ts
// Risk:    Buradaki değerler yanlış/eksikse fiyat ve kalori toplamı yanlış hesaplanır — müşteriye yanlış bilgi gider
// Dokunma: CUSTOMIZER_SPEC.md §2 (Adım Tanımları) — yeni ürün eklerken oradaki isim listesiyle tutarlı olmalı
//
// ⚠️⚠️⚠️ TEST VERİSİ — GERÇEK DEĞİL ⚠️⚠️⚠️
// Bu dosyadaki tüm fiyat/kalori/protein değerleri SADECE görsel/layout testi içindir.
// İsimler CUSTOMIZER_SPEC.md'deki listeyle uyumlu ama rakamlar uydurma yuvarlak test değerleridir.
// PROD'a çıkmadan önce gerçek mutfak verisiyle (AGENT.md Kural #4 + BSC-5 gereği kullanıcıdan
// gelecek) değiştirilmesi ZORUNLU. Bkz. SESSION_INDEX.md Açık Sorun #17.

import type { CustomizerCatalog } from "@/types"

export const customizerCatalog: CustomizerCatalog = {
  bases: [
    { id: "jasmine-rice", name: "Jasmine Rice", price: 0, calories: 200, protein: 4 },
    { id: "brown-rice", name: "Brown Rice", price: 0, calories: 215, protein: 5 },
    { id: "quinoa", name: "Quinoa", price: 15, calories: 220, protein: 8 },
    { id: "mixed-greens", name: "Mixed Greens", price: 0, calories: 25, protein: 2 },
    { id: "spinach", name: "Spinach", price: 0, calories: 20, protein: 2 },
    { id: "half-rice-half-greens", name: "Half Rice + Half Greens", price: 0, calories: 110, protein: 3 },
  ],
  mains: [
    { id: "grilled-chicken", name: "Grilled Chicken", price: 0, calories: 250, protein: 35 },
    { id: "crispy-chicken", name: "Crispy Chicken", price: 10, calories: 320, protein: 30 },
    { id: "beef", name: "Beef", price: 40, calories: 300, protein: 32 },
    { id: "falafel", name: "Falafel", price: 0, calories: 260, protein: 12 },
    { id: "shrimp", name: "Shrimp", price: 35, calories: 180, protein: 28 },
    { id: "salmon", name: "Salmon", price: 45, calories: 280, protein: 30 },
    { id: "tofu", name: "Tofu", price: 0, calories: 190, protein: 18 },
  ],
  gardenItems: [
    { id: "cherry-tomato", name: "Cherry Tomato", price: 0, calories: 15, protein: 0 },
    { id: "cucumber", name: "Cucumber", price: 0, calories: 10, protein: 0 },
    { id: "corn", name: "Corn", price: 0, calories: 60, protein: 2 },
    { id: "pickled-onion", name: "Pickled Onion", price: 0, calories: 10, protein: 0 },
    { id: "red-cabbage", name: "Red Cabbage", price: 0, calories: 15, protein: 1 },
    { id: "carrot", name: "Carrot", price: 0, calories: 20, protein: 0 },
    // ⚠️ id: "avocado" — lib/customizer-pricing.ts'te her zaman ücretli sayılır (CUSTOMIZER_SPEC.md §4)
    { id: "avocado", name: "Avocado", price: 15, calories: 120, protein: 1 },
  ],
  signatureFlavors: [
    { id: "mediterranean-herb", name: "Mediterranean Herb", price: 0, calories: 30, protein: 0 },
    { id: "smoky-bbq", name: "Smoky BBQ", price: 0, calories: 45, protein: 0 },
    { id: "lemon-garlic", name: "Lemon Garlic", price: 0, calories: 25, protein: 0 },
    { id: "spicy-harissa", name: "Spicy Harissa", price: 0, calories: 35, protein: 0 },
    { id: "teriyaki-sesame", name: "Teriyaki Sesame", price: 0, calories: 50, protein: 1 },
    { id: "sweet-chili", name: "Sweet Chili", price: 0, calories: 40, protein: 0 },
  ],
  finishItems: [
    { id: "feta", name: "Feta", price: 10, calories: 70, protein: 4 },
    { id: "parmesan", name: "Parmesan", price: 10, calories: 60, protein: 5 },
    { id: "roasted-seeds", name: "Roasted Seeds", price: 5, calories: 50, protein: 2 },
    { id: "crispy-onion", name: "Crispy Onion", price: 5, calories: 40, protein: 1 },
    { id: "fresh-herbs", name: "Fresh Herbs", price: 0, calories: 5, protein: 0 },
    { id: "lime", name: "Lime", price: 0, calories: 5, protein: 0 },
    { id: "chili-flakes", name: "Chili Flakes", price: 0, calories: 5, protein: 0 },
  ],
  extraOptions: {
    extraAvocado: { id: "extra-avocado", name: "Extra Avocado", price: 15, calories: 120, protein: 1 },
    extraSauce: { id: "extra-sauce", name: "Extra Sauce", price: 10, calories: 60, protein: 0 },
    extraCrunch: { id: "extra-crunch", name: "Extra Crunch", price: 8, calories: 45, protein: 1 },
  },
}
