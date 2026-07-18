// components/menu/__tests__/FilterPanel.test.tsx
// Amaç:    FilterPanel'in alerjen/diyet gruplarını render ettiğini, checkbox toggle'ının doğru callback'i
//          doğru id ile tetiklediğini doğrular
// Bağlı:   components/menu/FilterPanel.tsx, FilterCheckboxGroup.tsx
// Risk:    Test eksikse iki grup (dışlama vs dahil etme) birbirine karışsa fark edilmeden production'a gider

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterPanel } from '../FilterPanel'

const baseProps = {
  excludedAllergens: [],
  onExcludedAllergensChange: vi.fn(),
  selectedDietTags: [],
  onDietTagsChange: vi.fn(),
}

describe('FilterPanel', () => {
  it('happy path: alerjen ve diyet gruplarını render eder', () => {
    render(<FilterPanel {...baseProps} />)
    expect(screen.getByText('Alerjen (İçermeyenleri göster)')).toBeInTheDocument()
    expect(screen.getByText('Diyet & Kalori')).toBeInTheDocument()
    expect(screen.getByLabelText('Glüten')).toBeInTheDocument()
    expect(screen.getByLabelText('Keto')).toBeInTheDocument()
  })

  it('edge case: alerjen checkbox işaretlenince onExcludedAllergensChange doğru id ile çağrılır', async () => {
    const onExcludedAllergensChange = vi.fn()
    render(<FilterPanel {...baseProps} onExcludedAllergensChange={onExcludedAllergensChange} />)
    await userEvent.click(screen.getByLabelText('Kuruyemiş'))
    expect(onExcludedAllergensChange).toHaveBeenCalledWith(['nuts'])
  })

  it('edge case: zaten seçili diyet etiketi tekrar tıklanınca listeden çıkar', async () => {
    const onDietTagsChange = vi.fn()
    render(<FilterPanel {...baseProps} selectedDietTags={['vegan']} onDietTagsChange={onDietTagsChange} />)
    await userEvent.click(screen.getByLabelText('Vegan'))
    expect(onDietTagsChange).toHaveBeenCalledWith([])
  })

  it('failure path: boş seçim durumunda hiçbir checkbox işaretli görünmez', () => {
    render(<FilterPanel {...baseProps} />)
    expect(screen.getByLabelText('Glüten')).not.toBeChecked()
    expect(screen.getByLabelText('Keto')).not.toBeChecked()
  })
})
