// components/menu/CategoryNav.tsx
// Amaç:    Sticky kategori navigasyonu — menü sayfasının üstünde sabit kalır (İmza/Sıcak Tahıl/Vegan/İçecek)
// Bağlı:   app/menu/page.tsx — activeTab state'i burada TUTULMAZ, controlled component (parent yönetir)
// Risk:    Sticky konumlandırma Header.tsx ile çakışırsa nav görünmez/tıklanamaz olur
// Dokunma: `top-16` değeri Header.tsx yüksekliği VARSAYIMIdır — gerçek Header yüksekliği farklıysa
//          bu değer güncellenmeli (ARCHITECTURE.md §2.1 Header kontratı bu oturumda paylaşılmadı).

'use client'

import { CATEGORY_TABS, type CategoryTabId } from '@/lib/menu-filters'
import { CategoryTabButton } from './CategoryTabButton'

interface CategoryNavProps {
  activeTab: CategoryTabId
  onTabChange: (id: CategoryTabId) => void
}

export function CategoryNav({ activeTab, onTabChange }: CategoryNavProps) {
  return (
    <nav
      role="tablist"
      aria-label="Menü kategorileri"
      className="sticky top-16 z-30 flex gap-2 overflow-x-auto bg-cream/95 backdrop-blur-sm px-4 py-3 border-b border-olive-deep/10"
    >
      {CATEGORY_TABS.map((tab) => (
        <CategoryTabButton
          key={tab.id}
          id={tab.id}
          label={tab.label}
          isActive={activeTab === tab.id}
          onSelect={onTabChange}
        />
      ))}
    </nav>
  )
}
