// components/layout/Header.tsx
// Amaç:    Site geneli üst navigasyon — logo, menü linkleri, sepet ikonu (statik)
// Bağlı:   app/layout.tsx (her sayfada render edilir)
// Risk:    Bozuk navigasyon → kullanıcı menüye/sepete ulaşamaz, sipariş kaybı riski
// Dokunma: Sepet sayaç mantığı Oturum 4'te useCartStore ile bağlanacak — şimdilik statik ikon (TODO)
//          Logo: /public/images/logo-bowlera.png — orijinal mor/pembe/turuncu degrade,
//          site paletine (zeytin/amber/toprak kızılı) uyarlanarak recolor edildi (Session 1).

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import { NAV_LINKS } from './navLinks'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-charcoal/10">
      <div className="mx-auto max-w-6xl px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2" aria-label="Bowlera anasayfa">
          <Image
            src="/images/logo-bowlera.png"
            alt="Bowlera - Healthy Bowls"
            width={44}
            height={44}
            priority
            className="h-10 w-10 object-contain"
          />
          <span className="font-display text-2xl font-bold text-charcoal">Bowlera</span>
        </Link>
        <nav className="hidden md:flex gap-6 font-body text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-espresso hover:text-olive-primary transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {/* TODO Oturum 4: useCartStore.cart.length ile sayaç + logo-degrade pulse (DESIGN_SYSTEM §6.1) */}
        <button
          aria-label="Sepet"
          className="relative p-2 rounded-full hover:bg-olive-primary/10 transition-colors duration-200"
        >
          <ShoppingBag className="w-5 h-5 text-charcoal" />
        </button>
      </div>
    </header>
  )
}
