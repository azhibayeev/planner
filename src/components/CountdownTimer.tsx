'use client'

import { useEffect, useState } from 'react'

function getTimeUntilMidnight() {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0)
  const diff = Math.max(0, midnight.getTime() - now.getTime())
  const h = Math.floor(diff / 1000 / 60 / 60)
  const m = Math.floor((diff / 1000 / 60) % 60)
  const s = Math.floor((diff / 1000) % 60)
  return { h, m, s }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function CountdownTimer() {
  const [time, setTime] = useState(getTimeUntilMidnight)

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeUntilMidnight()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="bg-red-600 text-white py-3 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
        <span className="text-sm font-medium">🔥 Скидки до 60% — только сегодня!</span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-red-200">Осталось:</span>
          {[
            { val: time.h, label: 'ч' },
            { val: time.m, label: 'мин' },
            { val: time.s, label: 'сек' },
          ].map(({ val, label }, i) => (
            <span key={i} className="flex items-center gap-0.5">
              <span className="bg-white/20 text-white font-bold text-sm px-2 py-0.5 rounded-md min-w-[32px] text-center tabular-nums">
                {pad(val)}
              </span>
              <span className="text-red-200 text-xs">{label}</span>
              {i < 2 && <span className="text-red-300 font-bold text-sm mx-0.5">:</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
