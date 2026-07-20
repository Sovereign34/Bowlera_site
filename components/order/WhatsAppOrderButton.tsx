// components/order/WhatsAppOrderButton.tsx
// Amaç:    "WhatsApp ile Sipariş Ver" CTA'sı — şube telefon numarası gelene kadar BİLİNÇLİ devre dışı
// Bağlı:   app/siparis/page.tsx, lib/integrations/whatsapp.ts (HENÜZ BAĞLANMADI — INTEGRATIONS.md §0)
// Risk:    Şube numarası olmadan aktif edilirse wa.me linki boş/geçersiz numaraya gider (BSC-3, BSC-5)
// Dokunma: INTEGRATIONS.md §0'da "Şube telefon numaraları" durumu değişince bu bileşen
//          buildWhatsAppOrderLink()'e bağlanmalı — şu an bilinçli olarak BAĞLANMADI (CORE §9)

type Props = { disabled: boolean }

export function WhatsAppOrderButton({ disabled }: Props) {
  const reason = disabled
    ? "Önce teslimat şeklini seç"
    : "Şube telefon numaraları henüz tanımlanmadı — bu buton yakında aktif olacak"

  return (
    <div>
      <button
        type="button"
        disabled
        aria-disabled="true"
        title={reason}
        className="w-full cursor-not-allowed rounded-md bg-charcoal/20 px-4 py-3 text-center opacity-60"
      >
        WhatsApp ile Sipariş Ver
      </button>
      <p className="mt-2 text-xs text-charcoal/60">{reason}</p>
    </div>
  )
}
