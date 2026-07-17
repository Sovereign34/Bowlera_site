// tailwind.config.ts
// Amaç:    DESIGN_SYSTEM.md §2 ve §3'teki renk/tipografi token'larını tek kaynaktan sağlar
// Bağlı:   Tüm bileşenler — inline hex kod yasak, sadece bu token'lar kullanılır (ARCHITECTURE §1 Kural 6)
// Risk:    Token değişirse tüm site renk/tipografi kimliğini kaybeder
// Dokunma: DESIGN_SYSTEM.md §2 (Renk), §3 (Tipografi) güncellenmeden bu dosya değiştirilmez

import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F4F0E7',
        charcoal: '#1F1A18',
        espresso: '#38221D',
        'olive-primary': '#53502A',
        'olive-deep': '#6A6541',
        bronze: '#816E44',
      },
      backgroundImage: {
        // DESIGN_SYSTEM.md §2.1 — yalnızca 4 izinli yerde kullanılır, site arka planında ASLA
        'logo-gradient': 'linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'serif'],
        body: ['var(--font-nunito)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
