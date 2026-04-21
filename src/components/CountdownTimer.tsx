'use client'

import { useEffect, useState } from 'react'

// Seats left — fixed per session so it doesn't flicker on re-render
const INITIAL_SEATS = 17

export default function CountdownTimer() {
  const [seats, setSeats] = useState(INITIAL_SEATS)

  useEffect(() => {
    // Slowly decrease seats count to simulate demand
    const id = setInterval(() => {
      setSeats(s => Math.max(5, s - 1))
    }, 45000) // every 45 seconds
    return () => clearInterval(id)
  }, [])

  return (
    <div className="bg-gray-900 border-y border-gray-800 text-white py-3 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
        <span className="text-sm font-medium">
          Скидки до 60% активны прямо сейчас
        </span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
          <span className="text-amber-400 font-bold text-sm">
            Осталось {seats} мест по акционной цене
          </span>
        </div>
      </div>
    </div>
  )
}
