// lib/menu-filters.test.ts
// Amaç:    filterByCategory/filterByExcludedAllergens/filterByDietTags fonksiyonlarını doğrular
// Bağlı:   lib/menu-filters.ts
// Risk:    Test eksikse yanlış filtre mantığı fark edilmeden production'a gider
// Dokunma: BowlItem şeması değişirse mockItems güncellenmeli

import { describe, it, expect } from 'vitest'
import { filterByCategory, filterByExcludedAllergens, filterByDietTags } from './menu-filters'
import { BowlItem } from '@/types'

const mockItems: BowlItem[] = [
  {
    id: '1', name: 'Teriyaki Tavuk Kase', category: 'signature', price: 240,
    image: 'signature-teriyaki-tavuk-kase.webp', tags: ['yüksek protein'],
    allergens: ['soy'], calories: 520, protein: 35,
  },
  {
    id: '2', name: 'Kinoa Vegan Kase', category: 'build-your-own', price: 200,
    image: 'build-your-own-kinoa-vegan-kase.webp', tags: ['vegan', 'düşük kalori'],
    calories: 380, protein: 18,
  },
  {
    id: '3', name: 'Sıcak Tahıl Kase', category: 'build-your-own', price: 220,
    image: 'build-your-own-sicak-tahil-kase.webp', tags: ['sıcak-tahıl', 'gluten'],
    allergens: ['gluten', 'nuts'], calories: 460, protein: 22,
  },
  {
    id: '4', name: 'Limonata', category: 'içecek', price: 60,
    image: 'icecek-limonata.webp', tags: [], calories: 90, protein: 0,
  },
]

describe('filterByCategory', () => {
  it('happy path: tumu sekmesi tüm ürünleri döner (varsayılan sekme)', () => {
    expect(filterByCategory(mockItems, 'tumu')).toHaveLength(4)
  })

  it('happy path: imza sekmesi sadece signature döner', () => {
    expect(filterByCategory(mockItems, 'imza').map((i) => i.id)).toEqual(['1'])
  })

  it('edge case: vegan sekmesi category enum yerine tags üzerinden eşler', () => {
    expect(filterByCategory(mockItems, 'vegan').map((i) => i.id)).toEqual(['2'])
  })

  it('edge case: sicak-tahil sekmesi tags["sıcak-tahıl"] üzerinden eşler', () => {
    expect(filterByCategory(mockItems, 'sicak-tahil').map((i) => i.id)).toEqual(['3'])
  })

  it('failure path: eşleşen ürün yoksa boş dizi döner (crash yok)', () => {
    expect(filterByCategory([], 'imza')).toEqual([])
  })
})

describe('filterByExcludedAllergens', () => {
  it('happy path: seçili alerjeni içeren ürün dışlanır', () => {
    expect(filterByExcludedAllergens(mockItems, ['soy']).map((i) => i.id)).toEqual(['2', '3', '4'])
  })

  it('edge case: boş excluded dizisi → filtre uygulanmaz', () => {
    expect(filterByExcludedAllergens(mockItems, [])).toHaveLength(4)
  })

  it('edge case: allergens undefined olan ürün her zaman güvenli sayılır', () => {
    const result = filterByExcludedAllergens(mockItems, ['gluten', 'nuts', 'soy', 'dairy', 'shellfish'])
    expect(result.map((i) => i.id)).toEqual(['2', '4'])
  })
})

describe('filterByDietTags', () => {
  it('happy path: tek diyet etiketi eşleşen ürünleri döner', () => {
    expect(filterByDietTags(mockItems, ['vegan']).map((i) => i.id)).toEqual(['2'])
  })

  it('edge case: birden fazla etiket AND mantığıyla daraltır', () => {
    expect(filterByDietTags(mockItems, ['vegan', 'düşük kalori']).map((i) => i.id)).toEqual(['2'])
  })

  it('failure path: kesişimi olmayan etiketler boş dizi döner', () => {
    expect(filterByDietTags(mockItems, ['keto', 'vegan'])).toEqual([])
  })
})
