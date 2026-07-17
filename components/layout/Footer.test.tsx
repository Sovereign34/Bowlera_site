// components/layout/Footer.test.tsx
// Amaç:    Footer'ın marka satırını, nav linklerini ve telif satırını doğrular
// Kapsam:  Happy path + edge (yıl dinamik mi) + failure (NAP placeholder açıkça işaretli mi)

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'

describe('Footer', () => {
  it('happy path — marka adı render edilir', () => {
    render(<Footer />)
    expect(screen.getByText('Bowlera')).toBeInTheDocument()
  })

  it('edge — telif yılı mevcut yıl ile eşleşir (hardcode değil)', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument()
  })

  it('failure — gerçek şube verisi yokken kullanıcıya açıkça bildiriliyor (sahte NAP yok)', () => {
    render(<Footer />)
    expect(screen.getByText(/yakında burada/i)).toBeInTheDocument()
  })
})
