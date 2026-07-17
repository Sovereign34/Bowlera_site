// components/menu/MenuCardBadges.tsx
// Amaç:    Diyet etiketlerini (vegan, glutensiz vb.) küçük rozetler olarak render eder
// Bağlı:   MenuCard.tsx
// Risk:    Etiket eksik/yanlış gösterilirse kullanıcı alerjen riskiyle karşılaşabilir
// Dokunma: DESIGN_SYSTEM.md §2 — Bronze rengi burada YASAK (küçük gövde metni kuralı)

export function MenuCardBadges({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1 px-1">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-cream px-2 py-0.5 text-xs font-body text-olive-deep ring-1 ring-olive-deep/30"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}
