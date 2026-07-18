// components/menu/CategoryTabButton.tsx
// Amaç:    Tek bir kategori sekmesini render eder — aktif/pasif görsel durumu
// Bağlı:   CategoryNav.tsx
// Risk:    Aktif durum yanlış render edilirse kullanıcı hangi kategoride olduğunu anlayamaz
// Dokunma: DESIGN_SYSTEM.md §2 (Primary Olive aktif renk), §6.2 (yalnızca transform/opacity — burada renk geçişi color/background-color, layout tetiklemiyor)

'use client'

import type { CategoryTabId } from '@/lib/menu-filters'

interface CategoryTabButtonProps {
  id: CategoryTabId
  label: string
  isActive: boolean
  onSelect: (id: CategoryTabId) => void
}

export function CategoryTabButton({ id, label, isActive, onSelect }: CategoryTabButtonProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => onSelect(id)}
      className={`px-4 py-2 rounded-full font-body text-sm whitespace-nowrap transition-colors duration-200 ease-in-out ${
        isActive ? 'bg-olive-primary text-cream' : 'text-espresso hover:bg-olive-deep/10'
      }`}
    >
      {label}
    </button>
  )
}
