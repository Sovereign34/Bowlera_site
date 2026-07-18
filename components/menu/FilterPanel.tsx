// components/menu/FilterPanel.tsx
// Amaç:    Alerjen (dışlama mantığı) ve diyet/kalori (dahil etme mantığı) filtrelerini bir arada sunar
// Bağlı:   app/menu/page.tsx — seçili filtreler parent'ta tutulur (controlled component),
//          filtreleme lib/menu-filters.ts fonksiyonlarıyla uygulanır
// Risk:    İki grubun mantığı (dışlama vs dahil etme) karışırsa yanlış ürün listesi gösterilir —
//          bu yüzden başlıklar açıkça "İçermeyenleri göster" ifadesini taşır
// Dokunma: ALLERGEN_FILTERS/DIET_FILTERS (lib/menu-filters.ts) güncellenirse bu dosya otomatik yansıtır

'use client'

import { ALLERGEN_FILTERS, DIET_FILTERS } from '@/lib/menu-filters'
import { FilterCheckboxGroup } from './FilterCheckboxGroup'

interface FilterPanelProps {
  excludedAllergens: string[]
  onExcludedAllergensChange: (ids: string[]) => void
  selectedDietTags: string[]
  onDietTagsChange: (ids: string[]) => void
}

export function FilterPanel({
  excludedAllergens,
  onExcludedAllergensChange,
  selectedDietTags,
  onDietTagsChange,
}: FilterPanelProps) {
  return (
    <aside aria-label="Menü filtreleri" className="w-full md:w-64 shrink-0">
      <FilterCheckboxGroup
        title="Alerjen (İçermeyenleri göster)"
        options={ALLERGEN_FILTERS}
        selected={excludedAllergens}
        onChange={onExcludedAllergensChange}
      />
      <FilterCheckboxGroup
        title="Diyet & Kalori"
        options={DIET_FILTERS}
        selected={selectedDietTags}
        onChange={onDietTagsChange}
      />
    </aside>
  )
}
