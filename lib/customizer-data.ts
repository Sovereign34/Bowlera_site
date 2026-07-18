// lib/customizer-data.ts
// Amaç:    "Kâseni Yarat" bileşen kataloğunun tek veri kaynağı (Base/Main/Garden/Signature Flavor/Finish/Extras)
// Bağlı:   store/useCustomizerStore.ts, lib/customizer-pricing.ts
// Risk:    Buradaki değerler yanlış/eksikse fiyat ve kalori toplamı yanlış hesaplanır — müşteriye yanlış bilgi gider
// Dokunma: CUSTOMIZER_SPEC.md §2 (Adım Tanımları) — ⚠️ isimler Türkçeleştirildi, CUSTOMIZER_SPEC.md'deki
//          liste bu değişiklikle senkronize DEĞİL — orası ayrıca güncellenmeli (açık görev)
//
// ⚠️⚠️⚠️ TEST VERİSİ — GERÇEK DEĞİL ⚠️⚠️⚠️
// Bu dosyadaki tüm fiyat/kalori/protein değerleri SADECE görsel/layout testi içindir.
// Rakamlar uydurma yuvarlak test değerleridir. PROD'a çıkmadan önce gerçek mutfak verisiyle
// (AGENT.md Kural #4 + BSC-5 gereği kullanıcıdan gelecek) değiştirilmesi ZORUNLU.
// Bkz. SESSION_INDEX.md Açık Sorun #17, #24.
//
// Değişiklik (bu session — DÜZELTME): Tüm "name" alanları İngilizceden Türkçeye çevrildi
// (Karar #2'nin geri alınması). "id" alanları BİLİNÇLİ OLARAK değiştirilmedi — store/pricing/
// selection mantığı bu id'lere referans veriyor, id değişikliği ayrı bir şema değişikliği
// gerektirir ve bu görevin kapsamı dışında.

import type { CustomizerCatalog } from "@/types"

export const customizerCatalog: CustomizerCatalog = {
  bases: [
    { id: "jasmine-rice", name: "Jasmin Pirinç", price: 0, calories: 200, protein: 4 },
    { id: "brown-rice", name: "Esmer Pirinç", price: 0, calories: 215, protein: 5 },
    { id: "quinoa", name: "Kinoa", price: 15, calories: 220, protein: 8 },
    { id: "mixed-greens", name: "Karışık Yeşillik", price: 0, calories: 25, protein: 2 },
    { id: "spinach", name: "Ispanak", price: 0, calories: 20, protein: 2 },
    { id: "half-rice-half-greens", name: "Yarı Pirinç + Yarı Yeşillik", price: 0, calories: 110, protein: 3 },
  ],
  mains: [
    { id: "grilled-chicken", name: "Izgara Tavuk", price: 0, calories: 250, protein: 35 },
    { id: "crispy-chicken", name: "Çıtır Tavuk", price: 10, calories: 320, protein: 30 },
    { id: "beef", name: "Dana Eti", price: 40, calories: 300, protein: 32 },
    { id: "falafel", name: "Falafel", price: 0, calories: 260, protein: 12 },
    { id: "shrimp", name: "Karides", price: 35, calories: 180, protein: 28 },
    { id: "salmon", name: "Somon", price: 45, calories: 280, protein: 30 },
    { id: "tofu", name: "Tofu", price: 0, calories: 190, protein: 18 },
  ],
  gardenItems: [
    { id: "cherry-tomato", name: "Çeri Domates", price: 0, calories: 15, protein: 0 },
    { id: "cucumber", name: "Salatalık", price: 0, calories: 10, protein: 0 },
    { id: "corn", name: "Mısır", price: 0, calories: 60, protein: 2 },
    { id: "pickled-onion", name: "Turşu Soğan", price: 0, calories: 10, protein: 0 },
    { id: "red-cabbage", name: "Kırmızı Lahana", price: 0, calories: 15, protein: 1 },
    { id: "carrot", name: "Havuç", price: 0, calories: 20, protein: 0 },
    // ⚠️ id: "avocado" — lib/customizer-pricing.ts'te her zaman ücretli sayılır (CUSTOMIZER_SPEC.md §4)
    { id: "avocado", name: "Avokado", price: 15, calories: 120, protein: 1 },
  ],
  signatureFlavors: [
    { id: "mediterranean-herb", name: "Akdeniz Otları", price: 0, calories: 30, protein: 0 },
    { id: "smoky-bbq", name: "Dumanlı BBQ", price: 0, calories: 45, protein: 0 },
    { id: "lemon-garlic", name: "Limon Sarımsak", price: 0, calories: 25, protein: 0 },
    { id: "spicy-harissa", name: "Acılı Harissa", price: 0, calories: 35, protein: 0 },
    { id: "teriyaki-sesame", name: "Teriyaki Susam", price: 0, calories: 50, protein: 1 },
    { id: "sweet-chili", name: "Tatlı Acı Biber", price: 0, calories: 40, protein: 0 },
  ],
  finishItems: [
    { id: "feta", name: "Feta Peyniri", price: 10, calories: 70, protein: 4 },
    { id: "parmesan", name: "Parmesan Peyniri", price: 10, calories: 60, protein: 5 },
    { id: "roasted-seeds", name: "Kavrulmuş Çekirdek", price: 5, calories: 50, protein: 2 },
    { id: "crispy-onion", name: "Çıtır Soğan", price: 5, calories: 40, protein: 1 },
    { id: "fresh-herbs", name: "Taze Otlar", price: 0, calories: 5, protein: 0 },
    { id: "lime", name: "Misket Limonu", price: 0, calories: 5, protein: 0 },
    { id: "chili-flakes", name: "Pul Biber", price: 0, calories: 5, protein: 0 },
  ],
  extraOptions: {
    extraAvocado: { id: "extra-avocado", name: "Ekstra Avokado", price: 15, calories: 120, protein: 1 },
    extraSauce: { id: "extra-sauce", name: "Ekstra Sos", price: 10, calories: 60, protein: 0 },
    extraCrunch: { id: "extra-crunch", name: "Ekstra Çıtırlık", price: 8, calories: 45, protein: 1 },
  },
}
