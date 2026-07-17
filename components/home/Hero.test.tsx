// components/home/Hero.test.tsx
// Amaç:    Hero'nun CTA hedeflerini ve placeholder görsel erişilebilirliğini doğrular
// Kapsam:  Happy path + edge (CTA href doğru mu) + failure (görsel yokken alt/aria boş kalmıyor)

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'

describe('Hero', () => {
  it('happy path — her iki CTA da render edilir', () => {
    render(<Hero />)
    expect(screen.getByText('Kâseni Yarat')).toBeInTheDocument()
    expect(screen.getByText('Menüyü Keşfet')).toBeInTheDocument()
  })

  it('edge — "Kâseni Yarat" customizer rotasına, "Menüyü Keşfet" menü rotasına gider', () => {
    render(<Hero />)
    expect(screen.getByText('Kâseni Yarat').closest('a')).toHaveAttribute('href', '/menu/customize')
    expect(screen.getByText('Menüyü Keşfet').closest('a')).toHaveAttribute('href', '/menu')
  })

  it('failure — görsel eksikken aria-label boş kalmıyor (erişilebilirlik açığı yok)', () => {
    render(<Hero />)
    expect(screen.getByRole('img', { name: /Bowlera kase görseli/i })).toBeInTheDocument()
  })
})
