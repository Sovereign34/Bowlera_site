// components/layout/navLinks.ts
// Amaç:    Header/Footer'ın paylaştığı navigasyon linkleri — tek kaynak (DRY)
// Bağlı:   Header.tsx, Footer.tsx
// Risk:    İki dosyada ayrı ayrı tanımlanırsa linkler birbirinden sapar
// Dokunma: MASTER_PLAN.md §3 Sitemap ile senkron tutulmalı

export const NAV_LINKS = [
  { href: '/menu', label: 'Menü' },
  { href: '/siparis', label: 'Sipariş Ver' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/subeler', label: 'Şubeler' },
  { href: '/iletisim', label: 'İletişim' },
] as const
