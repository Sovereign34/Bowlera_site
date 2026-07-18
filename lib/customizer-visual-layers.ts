// lib/customizer-visual-layers.ts
// Amaç:    CustomizerSelection + customizerCatalog'dan VisualPreview'ın katman listesini türetir
// Bağlı:   components/customizer/VisualPreview.tsx, lib/customizer-data.ts, types/index.ts
// Risk:    Yanlış katman/z-index sırası → kullanıcı yanlış ürün görseli görür (CUSTOMIZER_SPEC.md §5.1)
// Dokunma: CUSTOMIZER_SPEC.md §5.1 (katman mantığı) — yeni adım eklenirse zIndex haritası burada güncellenmeli

import type { CustomizerCatalog, CustomizerSelection } from "@/types"

export type VisualLayer = {
  id: string
  src: string
  active: boolean
  zIndex: number
}

// DESIGN_SYSTEM.md §5.1 dosya adlandırma standardı: [kategori]-[ürün-adı-kebab-case].webp
// Şema notu: CustomizerComponentItem'da görsel alanı yok (types/index.ts) — bilinçli konvansiyon kararı,
// MODIFY_SCHEMA gerektirmeden id'den path türetiliyor.
function layerPath(category: string, id: string): string {
  return `/images/layers/${category}-${id}.webp`
}

const KASE_SRC = "/images/layers/kase-taban.webp" // sabit, seçime bağlı değil — CUSTOMIZER_SPEC §5.1 madde 1

// Not: Her katman kategorisi için TÜM katalog öğeleri döndürülür (yalnızca seçili olan değil).
// Bu, framer-motion'ın seçimler arası crossfade yapabilmesi içindir (CUSTOMIZER_SPEC §5.1 örnek koduyla
// birebir uyumlu: layer.active'e göre opacity 0/1 arasında geçiş, mount/unmount değil).
export function getVisualLayers(
  selections: CustomizerSelection,
  catalog: CustomizerCatalog
): VisualLayer[] {
  const layers: VisualLayer[] = [{ id: "kase", src: KASE_SRC, active: true, zIndex: 1 }]

  catalog.bases.forEach((item) => {
    layers.push({
      id: `base-${item.id}`,
      src: layerPath("base", item.id),
      active: selections.base === item.id,
      zIndex: 2,
    })
  })

  catalog.mains.forEach((item) => {
    layers.push({
      id: `main-${item.id}`,
      src: layerPath("main", item.id),
      active: selections.main === item.id,
      zIndex: 3,
    })
  })

  // Garden — çoklu seçim, her öğe ayrı katman (CUSTOMIZER_SPEC §5.1 madde 4)
  catalog.gardenItems.forEach((item) => {
    layers.push({
      id: `garden-${item.id}`,
      src: layerPath("garden", item.id),
      active: selections.garden.includes(item.id),
      zIndex: 4,
    })
  })

  catalog.signatureFlavors.forEach((item) => {
    layers.push({
      id: `signature-flavor-${item.id}`,
      src: layerPath("signature-flavor", item.id),
      active: selections.signatureFlavor === item.id,
      zIndex: 5,
    })
  })

  // Finish — çoklu seçim, her öğe ayrı katman (CUSTOMIZER_SPEC §5.1 madde 6)
  catalog.finishItems.forEach((item) => {
    layers.push({
      id: `finish-${item.id}`,
      src: layerPath("finish", item.id),
      active: selections.finish.includes(item.id),
      zIndex: 6,
    })
  })

  return layers
}
