'use client'

import { useEffect, useState, useRef } from 'react'
import { products } from '@/lib/products'
import { useCheckout } from './CheckoutContext'

const bundle = products.find(p => p.id === 'bundle-all')!

export default function StickyBuyButton() {
  const [visible, setVisible] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const { openCheckout } = useCheckout()

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Невидимый маркер — конец Hero секции */}
      <div ref={sentinelRef} className="absolute top-[90vh]" />

      <div
        className={`fixed bottom-0 left-0 right-0 z-30 sm:hidden transition-all duration-300 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="bg-white border-t border-gray-100 shadow-2xl px-4 py-3">
          <button
            type="button"
            onClick={() => openCheckout(bundle)}
            className="w-full bg-primary text-white font-semibold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
          >
            Забрать все 5 таблиц
          </button>
        </div>
      </div>
    </>
  )
}
