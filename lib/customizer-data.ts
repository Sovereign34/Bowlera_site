// lib/customizer-data.ts
// Amaç:    "Kâseni Yarat" bileşen kataloğunun tek veri kaynağı (Base/Main/Garden/Signature Flavor/Finish/Extras)
// Bağlı:   store/useCustomizerStore.ts, lib/customizer-pricing.ts
// Risk:    Buradaki değerler yanlış/eksikse fiyat ve kalori toplamı yanlış hesaplanır — müşteriye yanlış bilgi gider
// Dokunma: CUSTOMIZER_SPEC.md §2 (Adım Tanımları) — yeni ürün eklerken oradaki isim listesiyle tutarlı olmalı

import type { CustomizerCatalog } from "@/types"

// TODO: PROD — her dizi gerçek mutfak verisiyle (ürün adı + gerçek fiyat/kalori/protein) doldurulmalı.
// AGENT.md Kural #4 (Sahte Veri Yasağı) + BSC-5 gereği bu değerler Claude tarafından üretilemez —
// kalori/fiyat MASTER_PLAN §5.5'e göre zorunlu ve doğrulanmış bir kaynaktan gelmelidir.
export const customizerCatalog: CustomizerCatalog = {
  bases: [], // Jasmine Rice, Brown Rice, Quinoa, Mixed Greens, Spinach, Half Rice + Half Greens
  mains: [], // Grilled Chicken, Crispy Chicken, Beef, Falafel, Shrimp, Salmon, Tofu
  gardenItems: [], // Cherry Tomato, Cucumber, Corn, Pickled Onion, Red Cabbage, Carrot, Avocado
  // ⚠️ id: "avocado" olan öğe lib/customizer-pricing.ts'te her zaman ücretli sayılır (CUSTOMIZER_SPEC.md §4)
  signatureFlavors: [], // Mediterranean Herb, Smoky BBQ, Lemon Garlic, Spicy Harissa, Teriyaki Sesame, Sweet Chili
  finishItems: [], // Feta, Parmesan, Roasted Seeds, Crispy Onion, Fresh Herbs, Lime, Chili Flakes
  extraOptions: {
    // TODO: PROD — price/calories/protein gerçek mutfak verisiyle doldurulmalı
    extraAvocado: { id: "extra-avocado", name: "Extra Avocado", price: 0, calories: 0, protein: 0 },
    extraSauce: { id: "extra-sauce", name: "Extra Sauce", price: 0, calories: 0, protein: 0 },
    extraCrunch: { id: "extra-crunch", name: "Extra Crunch", price: 0, calories: 0, protein: 0 },
  },
}
