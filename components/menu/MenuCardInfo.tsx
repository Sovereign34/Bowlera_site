// components/menu/MenuCardInfo.tsx
// Amaç:    Ürün adı, kalori (ZORUNLU) ve fiyatı render eder
// Bağlı:   MenuCard.tsx
// Risk:    Kalori render edilmezse yasal/UX ihlali (MASTER_PLAN §5.5) — bu alan asla koşullu gösterilmez
// Dokunma: DESIGN_SYSTEM.md §2 — fiyat rengi text-espresso, kalori text-charcoal

export function MenuCardInfo({
  name,
  calories,
  protein,
  price,
}: {
  name: string
  calories: number
  protein: number
  price: number
}) {
  return (
    <div className="flex flex-col gap-1 px-1">
      <h3 className="font-display text-lg font-bold text-charcoal">{name}</h3>
      <p className="font-body text-sm text-charcoal">
        {calories} kcal · {protein}g protein
      </p>
      <p className="font-body text-base font-semibold text-espresso">
        {price}₺
      </p>
    </div>
  )
}
