// app/menu/customize/[id]/page.tsx
// Amaç:    "Kâseni Yarat" customizer akışının ana sayfası — VisualPreview + adım alanı + özet panelini birleştirir
// Bağlı:   store/useCustomizerStore.ts, store/useCartStore.ts, components/customizer/*, lib/menu-data.json
// Risk:    Sepete ekleme burada gerçek useCartStore'a bağlanıyor — yanlış CartItem şeması sepet bütünlüğünü bozar (types/index.ts §CartItem)
// Dokunma: CUSTOMIZER_SPEC.md §1, §3, §6 — Step bileşenleri (StepBase vb.) henüz yazılmadı, TODO olarak bırakıldı.
//          customizerCatalog şu an boş ([]) — gerçek mutfak verisi eklenene kadar adım alanı içerik göstermeyecek (BSC-5).
//
// ⚠️ ONAY BEKLEYEN VARSAYIMLAR (bu session'da doğrulanamadı, PR öncesi teyit edilmeli):
// 1. lib/menu-data.json'ın bir BowlItem[] dizisi export ettiği varsayıldı. Gerçek şekli farklıysa
//    (örn. { bowls: BowlItem[] }) aşağıdaki `menuData.find(...)` satırı güncellenmeli.
// 2. Sepete ekleme sonrası customizer state otomatik reset() ediliyor (yeni kâse için temiz başlangıç).
//    Bu bir tasarım kararı olarak alındı — istenmiyorsa kaldırılabilir.
// 3. `notFound()` bir Client Component içinde çağrılıyor — App Router'da desteklenir, ama bu proje için
//    ilk kullanım, davranış canlıda görsel doğrulanmalı.

"use client"

import { useMemo } from "react"
import { notFound } from "next/navigation"
import menuData from "@/lib/menu-data.json"
import type { BowlItem, CartItem } from "@/types"
import { useCustomizerStore } from "@/store/useCustomizerStore"
import { useCartStore } from "@/store/useCartStore"
import VisualPreview from "@/components/customizer/VisualPreview"
import SummaryPanel from "@/components/customizer/SummaryPanel"
import MobileSummaryDrawer from "@/components/customizer/MobileSummaryDrawer"

type Props = {
  params: { id: string }
}

export default function CustomizePage({ params }: Props) {
  const bowl = useMemo(
    () => (menuData as BowlItem[]).find((item) => item.id === params.id) ?? null,
    [params.id]
  )

  const selections = useCustomizerStore((state) => state.selections)
  const currentStep = useCustomizerStore((state) => state.currentStep)
  const getTotals = useCustomizerStore((state) => state.getTotals)
  const reset = useCustomizerStore((state) => state.reset)

  if (!bowl) {
    notFound()
  }

  function handleAddToCart() {
    if (!bowl) return
    const totals = getTotals()
    const cartItem: CartItem = {
      cartId: crypto.randomUUID(),
      bowlItem: bowl,
      customization: selections,
      quantity: 1,
      unitPrice: totals.price,
      unitCalories: totals.calories,
    }
    useCartStore.getState().addToCart(cartItem)
    reset()
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 pb-32 md:pb-8">
      <h1 className="font-display text-3xl font-bold text-charcoal">
        {bowl?.name} — Kâseni Yarat
      </h1>

      <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <div className="mx-auto max-w-sm md:max-w-none">
            <VisualPreview />
          </div>

          {/* TODO: Step bileşenleri (StepBase, StepMain, StepGarden, StepSignatureFlavor, StepFinish)
              henüz yazılmadı. customizerCatalog boş olduğu sürece (lib/customizer-data.ts) bu alan
              gerçek ürün seçimi göstermeyecek. CUSTOMIZER_SPEC.md §2'ye göre currentStep'e göre
              ilgili Step bileşeni burada render edilecek. */}
          <div className="rounded-xl border border-dashed border-charcoal/20 p-6 text-center font-body text-sm text-espresso">
            Adım {currentStep}/5 — adım bileşenleri henüz eklenmedi (TODO)
          </div>
        </div>

        <div className="hidden md:block">
          <SummaryPanel onAddToCart={handleAddToCart} />
        </div>
      </div>

      <MobileSummaryDrawer onAddToCart={handleAddToCart} />
    </main>
  )
}
