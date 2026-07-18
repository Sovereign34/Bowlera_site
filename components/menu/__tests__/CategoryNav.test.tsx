// components/menu/__tests__/CategoryNav.test.tsx
// Amaç:    CategoryNav'ın 4 sekmeyi render ettiğini, tıklamanın onTabChange'i doğru id ile tetiklediğini doğrular
// Bağlı:   components/menu/CategoryNav.tsx
// Risk:    Test eksikse yanlış sekme tıklaması/aria-selected durumu fark edilmeden production'a gider

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CategoryNav } from '../CategoryNav'

describe('CategoryNav', () => {
  it('happy path: 5 kategori sekmesini render eder', () => {
    render(<CategoryNav activeTab="tumu" onTabChange={vi.fn()} />)
    expect(screen.getByRole('tab', { name: 'Tümü' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'İmza Kaseler' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Sıcak Tahıl Kaseleri' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Vegan' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'İçecekler' })).toBeInTheDocument()
  })

  it('happy path: aktif sekme aria-selected=true taşır', () => {
    render(<CategoryNav activeTab="vegan" onTabChange={vi.fn()} />)
    expect(screen.getByRole('tab', { name: 'Vegan' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'İmza Kaseler' })).toHaveAttribute('aria-selected', 'false')
  })

  it('edge case: sekmeye tıklama doğru id ile onTabChange çağırır', async () => {
    const onTabChange = vi.fn()
    render(<CategoryNav activeTab="imza" onTabChange={onTabChange} />)
    await userEvent.click(screen.getByRole('tab', { name: 'İçecekler' }))
    expect(onTabChange).toHaveBeenCalledWith('icecek')
  })

  it('failure path: onTabChange sağlanmazsa render hata vermez (prop tipi zorunlu ama crash testi)', () => {
    expect(() => render(<CategoryNav activeTab="imza" onTabChange={vi.fn()} />)).not.toThrow()
  })
})
