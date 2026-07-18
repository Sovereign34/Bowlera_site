// app/menu/customize/[id]/page.tsx
// Amaç:    "Kâseni Yarat" customizer akışının ana sayfası — VisualPreview + adım alanı + özet panelini birleştirir
// Bağlı:   store/useCustomizerStore.ts, store/useCartStore.ts, components/customizer/*, lib/menu-data.json
// Risk:    Sepete ekleme burada gerçek useCartStore'a bağlanıyor — yanlış CartItem şeması sepet bütünlüğünü bozar (types/index.ts §CartItem)
// Dokunma: CUSTOMIZER_SPEC.md §1, §3, §6
//
// Değişiklik (bu session — DÜZELTME): TODO placeholder kaldırıldı, 5 Step bileşeni (StepBase,
// StepMain, StepGarden, StepSignatureFlavor, StepFinish) currentStep'e göre koşullu render
// ediliyor. customizerCatalog şu an TEST VERİSİYLE dolu (lib/customizer-data.ts, SESSION_INDEX.md
// Açık Sorun #17) — gerçek mutfak verisi gelene kadar sadece layout/akış testi içindir.
//
// ⚠️ ONAY BEKLEYEN VARSAYIMLAR (değişmedi, hâlâ teyit edilmedi):
// 1. lib/menu-data.json'ın bir BowlItem[] dizisi export ettiği varsayıldı.
// 2. Sepete ekleme sonrası customizer state otomatik reset() ediliyor.
// 3. `notFound()` bir Client Component içinde çağrılıyor — davranış canlıda görsel doğrulanmalı.

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
import StepBase from "@/components/customizer/StepBase"
import StepMain from "@/components/customizer/StepMain"
import StepGarden from "@/components/customizer/StepGarden"
import StepSignatureFlavor from "@/components/customizer/StepSignatureFlavor"
import StepFinish from "@/components/customizer/StepFinish"

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

          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            {currentStep === 1 && <StepBase />}
            {currentStep === 2 && <StepMain />}
            {currentStep === 3 && <StepGarden />}
            {currentStep === 4 && <StepSignatureFlavor />}
            {currentStep === 5 && <StepFinish />}
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
