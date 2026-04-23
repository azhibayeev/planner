'use client'

import { useEffect, useState } from 'react'

const PURCHASES = [
  { name: 'Айгерим', city: 'Алматы', product: 'Трекер привычек', ago: '2 минуты назад' },
  { name: 'Дина', city: 'Астана', product: 'Все 5 таблиц', ago: '5 минут назад' },
  { name: 'Сабина', city: 'Шымкент', product: 'Финансовый планер', ago: '7 минут назад' },
  { name: 'Медина', city: 'Алматы', product: 'Розовый трекер', ago: '11 минут назад' },
  { name: 'Камила', city: 'Астана', product: 'Планер на неделю', ago: '14 минут назад' },
  { name: 'Аружан', city: 'Атырау', product: 'Все 5 таблиц', ago: '18 минут назад' },
  { name: 'Малика', city: 'Алматы', product: 'Трекер задач', ago: '23 минуты назад' },
  { name: 'Зарина', city: 'Алматы', product: 'Трекер привычек', ago: '31 минуту назад' },
]

export default function RecentPurchaseToast() {
  const [visible, setVisible] = useState(false)
  const [current, setCurrent] = useState(PURCHASES[0])

  useEffect(() => {
    let showTimeout: ReturnType<typeof setTimeout>
    let hideTimeout: ReturnType<typeof setTimeout>

    const show = () => {
      setCurrent(PURCHASES[Math.floor(Math.random() * PURCHASES.length)])
      setVisible(true)
      hideTimeout = setTimeout(() => {
        setVisible(false)
        showTimeout = setTimeout(show, 20000 + Math.random() * 10000)
      }, 5000)
    }

    showTimeout = setTimeout(show, 8000)
    return () => { clearTimeout(showTimeout); clearTimeout(hideTimeout) }
  }, [])

  return (
    <div
      className={`fixed bottom-20 left-4 z-40 transition-[transform,opacity] duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-4 py-3 flex items-center gap-3 max-w-[280px]">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {current.name[0]}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {current.name} из {current.city}
          </p>
          <p className="text-xs text-gray-500 truncate">купила «{current.product}»</p>
          <p className="text-xs text-gray-400">{current.ago}</p>
        </div>
      </div>
    </div>
  )
}
