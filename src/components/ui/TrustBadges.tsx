import Image from 'next/image'

export default function TrustBadges() {
  return (
    <div className="flex flex-col gap-2.5 items-center pt-1">
      <div className="flex items-center gap-3">
        <Image src="/icons/kaspi.png" alt="Kaspi" width={64} height={22} className="object-contain" />
        <span className="w-px h-4 bg-gray-200" aria-hidden="true" />
        <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
          <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Защищённая оплата
        </span>
      </div>
      <p className="text-[11px] text-ink-soft">
        <a href="/privacy" className="hover:text-ink underline-offset-2 hover:underline">Политика конфиденциальности</a>
      </p>
    </div>
  )
}

export function GuaranteeBadge() {
  return (
    <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-xl px-4 py-3 flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-white border border-emerald-200 flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <div className="text-left">
        <p className="text-emerald-900 text-sm font-semibold">Гарантия возврата 7 дней</p>
        <p className="text-emerald-700 text-xs">Не подойдёт — вернём 100% оплаты</p>
      </div>
    </div>
  )
}
