// components/layout/Footer.tsx
// Amaç:    Site geneli alt bilgi — navigasyon tekrarı, marka satırı, iletişim özeti
// Bağlı:   app/layout.tsx (her sayfada render edilir)
// Risk:    Eksik/bozuk iletişim bilgisi → kullanıcı şubeye ulaşamaz
// Dokunma: Şube telefon/adres bilgisi CONTENT_GUIDE.md §5 NAP verisiyle senkron tutulmalı

import Link from 'next/link'
import { NAV_LINKS } from './navLinks'

export function Footer() {
  return (
    <footer className="bg-espresso text-cream mt-24">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-bold">Bowlera</p>
          <p className="mt-2 text-sm text-cream/70 font-body">Healthy Bowls</p>
        </div>
        <nav className="flex flex-col gap-2 font-body text-sm">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-bronze transition-colors duration-200">
              {link.label}
            </Link>
          ))}
        </nav>
        {/* TODO Oturum 5: gerçek şube NAP verisi + Google Business Profile linki (CONTENT_GUIDE.md §4) */}
        <p className="text-sm text-cream/70 font-body">
          Şube bilgileri yakında burada — gerçek adres/telefon Oturum 5&apos;te eklenecek.
        </p>
      </div>
      <div className="border-t border-cream/10 py-4 text-center text-xs text-cream/50 font-body">
        © {new Date().getFullYear()} Bowlera. Tüm hakları saklıdır.
      </div>
    </footer>
  )
}
