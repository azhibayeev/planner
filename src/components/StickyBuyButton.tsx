'use client'

import { useEffect, useState, useRef } from 'react'

export default function StickyBuyButton() {
  const [visible, setVisible] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

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
      >
        <div className="bg-white border-t border-gray-100 shadow-2xl px-4 py-3">
          <a
            href="#catalog"
            className="block w-full bg-black text-white text-center font-semibold py-3.5 rounded-xl text-sm"
          >
            🔥 Смотреть таблицы со скидкой
          </a>
        </div>
      </div>
    </>
  )
}
