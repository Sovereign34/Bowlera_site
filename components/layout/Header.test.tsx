// components/layout/Header.test.tsx
// Amaç:    Header'ın temel render davranışını ve erişilebilirlik kontratını doğrular
// Kapsam:  Happy path + edge (tüm nav linkleri) + failure (sepet butonu erişilebilir mi)

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from './Header'
import { NAV_LINKS } from './navLinks'

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
    expect(screen.getByLabelText('Sepet')).toBeInTheDocument()
  })
})
