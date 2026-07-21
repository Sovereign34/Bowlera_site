// lib/customizer-data.ts
// Amaç:    "Kâseni Yarat" bileşen kataloğunun tek veri kaynağı (Base/Main/Garden/Signature Flavor/Finish/Extras)
// Bağlı:   store/useCustomizerStore.ts, lib/customizer-pricing.ts
// Risk:    Buradaki değerler yanlış/eksikse fiyat ve kalori toplamı yanlış hesaplanır — müşteriye yanlış bilgi gider
// Dokunma: CUSTOMIZER_SPEC.md §2 / §2.1 (Adım Tanımları + Plant-Based Protein alt-varyant mekanizması) —
//          ⚠️ isimler Türkçeleştirildi, senkron. "plant-based-protein" main'i variants[] ile genişletilebilir
//          (yeni bir 3. varyant eklemek için sadece variants dizisine yeni obje eklenir, id/name/price/calories/protein).
//
// ⚠️⚠️⚠️ TEST VERİSİ — GERÇEK DEĞİL ⚠️⚠️⚠️
// Bu dosyadaki tüm fiyat/kalori/protein değerleri SADECE görsel/layout testi içindir.
// Rakamlar uydurma yuvarlak test değerleridir. PROD'a çıkmadan önce gerçek mutfak verisiyle
// (AGENT.md Kural #4 + BSC-5 gereği kullanıcıdan gelecek) değiştirilmesi ZORUNLU.
// Bkz. SESSION_INDEX.md Açık Sorun #17, #24.
//
// Değişiklik (bu session — v1.2): "plant-based-protein" main'i eklendi, variants: [] alanı ile
// (chickpea-simmered / Soslu Nohut, mexican-beans / Meksika Fasulyesi). signatureFlavors'a
// compatibleFlavorIds referansı main objesinde tutulur (flavor tarafında değil) — bu, yeni bir
// Main eklendiğinde flavor listesinin tekrar tekrar düzenlenmesini önler (tek kaynak main'de).
// Bkz. CUSTOMIZER_SPEC.md §2.1, SESSION_INDEX.md Karar #11 / Açık Sorun #22.

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
    // 🆕 v1.2 — Plant-Based Protein: tek Main kartı, 2 alt-varyant.
    // ⚠️ TEST VERİSİ (variants içindeki price/calories/protein dahil).
    // "variants" alanı SADECE bu main'de dolu — diğer 7 Main için undefined,
    // getTotals()/UI kodu bu alanın varlığına göre dallanır (CUSTOMIZER_SPEC.md §4).
    {
      id: "plant-based-protein",
      name: "Bitkisel Protein",
      price: 0,          // fallback — variants[0] öncelikli, bkz. §3.4/§4
      calories: 230,      // fallback — variants[0] ile aynı (Soslu Nohut)
      protein: 10,        // fallback — variants[0] ile aynı
      variants: [
        { id: "chickpea-simmered", name: "Soslu Nohut", price: 0, calories: 230, protein: 10 },
        { id: "mexican-beans", name: "Meksika Fasulyesi", price: 0, calories: 210, protein: 9 },
      ],
      // Signature Flavor adımında bu Main seçiliyse SADECE bu ID'ler gösterilir
      // (CUSTOMIZER_SPEC.md §2.1 — gurme uyumluluk gerekçesi orada).
      compatibleFlavorIds: ["mediterranean-herb", "spicy-harissa", "lemon-garlic"],
    },
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
