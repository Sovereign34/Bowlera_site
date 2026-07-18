// components/menu/FilterCheckboxGroup.tsx
// Amaç:    Tek bir filtre grubunu (alerjen VEYA diyet) checkbox listesi olarak render eder — generic, config-driven
// Bağlı:   FilterPanel.tsx
// Risk:    Grup semantiği (dışlama vs dahil etme) çağıran tarafta karışırsa kullanıcı yanlış sonuç bekler —
//          bu bileşen semantiği bilmez, sadece seçim state'ini yönetir (sorumluluk FilterPanel'de)
// Dokunma: DESIGN_SYSTEM.md §3 (font-body), §2 (Primary Olive checkbox rengi — accent-olive-primary)

'use client'

interface FilterOption {
  id: string
  label: string
}

interface FilterCheckboxGroupProps {
  title: string
  options: FilterOption[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export function FilterCheckboxGroup({ title, options, selected, onChange }: FilterCheckboxGroupProps) {
  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id])

  return (
    <fieldset className="mb-4">
      <legend className="font-body font-semibold text-sm text-charcoal mb-2">{title}</legend>
      {options.map((opt) => (
        <label key={opt.id} className="flex items-center gap-2 text-sm text-espresso py-1 cursor-pointer">
          <input
            type="checkbox"
            checked={selected.includes(opt.id)}
            onChange={() => toggle(opt.id)}
            className="accent-olive-primary"
          />
          {opt.label}
        </label>
      ))}
    </fieldset>
  )
}
