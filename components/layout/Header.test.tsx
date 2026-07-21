// components/layout/Header.test.tsx
// Amaç:    Header'ın temel render davranışını ve erişilebilirlik kontratını doğrular
// Kapsam:  Happy path + edge (tüm nav linkleri) + failure (sepet butonu erişilebilir mi)
// Dokunma: Header.tsx useSession() kullanıyor (Açık Sorun #33 çözümü) — bu test
//          auth davranışını DEĞİL, temel render/erişilebilirliği doğruladığı için
//          next-auth/react tamamen mock'landı (gerçek SessionProvider'a gerek yok).
//          Guest (unauthenticated) durumu sabit döndürülüyor.

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from './Header'
import { NAV_LINKS } from './navLinks'

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
}))

describe('Header', () => {
  it('happy path — logo ve marka adını render eder', () => {
    render(<Header />)
    expect(screen.getByText('Bowlera')).toBeInTheDocument()
  })

  it('edge — tüm nav linkleri eksiksiz render edilir', () => {
    render(<Header />)
    NAV_LINKS.forEach((link) => {
      expect(screen.getByText(link.label)).toBeInTheDocument()
    })
  })

  it('failure/erişilebilirlik — sepet butonu aria-label içermeden render edilmez', () => {
    render(<Header />)
    // Tam string yerine regex: gerçek aria-label "Sepeti aç" — Açık Sorun #40'ın
    // ikinci parçası (stale exact-match assertion) bu turda düzeltildi.
    expect(screen.getByLabelText(/sepet/i)).toBeInTheDocument()
  })
})
