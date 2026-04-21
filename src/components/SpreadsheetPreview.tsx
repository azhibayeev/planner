'use client'

import { useEffect, useState } from 'react'

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const HABITS = [
  { icon: '🏃', name: 'Спорт',      days: [1, 1, 1, 1, 1, 0, 1], color: 'bg-violet-500' },
  { icon: '💧', name: 'Вода 2л',    days: [1, 1, 1, 1, 1, 1, 1], color: 'bg-blue-500'   },
  { icon: '📚', name: 'Чтение',     days: [1, 0, 1, 1, 0, 1, 1], color: 'bg-emerald-500'},
  { icon: '🧘', name: 'Медитация',  days: [1, 1, 0, 1, 1, 0, 1], color: 'bg-pink-500'   },
  { icon: '😴', name: 'Сон 8ч',    days: [0, 1, 1, 1, 1, 1, 1], color: 'bg-amber-500'  },
]

function pct(days: number[]) {
  return Math.round((days.filter(Boolean).length / days.length) * 100)
}

export default function SpreadsheetPreview() {
  const [revealed, setRevealed] = useState<boolean[][]>(
    () => HABITS.map(h => h.days.map(() => false))
  )
  const [showBars, setShowBars] = useState(false)

  useEffect(() => {
    const cells: [number, number][] = []
    HABITS.forEach((_, ri) =>
      DAYS.forEach((_, ci) => cells.push([ri, ci]))
    )

    cells.forEach(([ri, ci], i) => {
      setTimeout(() => {
        setRevealed(prev => {
          const next = prev.map(r => [...r])
          next[ri][ci] = true
          return next
        })
      }, 400 + i * 60)
    })

    setTimeout(() => setShowBars(true), 400 + cells.length * 60 + 100)
  }, [])

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Окно */}
      <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 bg-white">

        {/* Заголовок окна */}
        <div className="bg-[#f1f3f4] px-4 py-2.5 flex items-center gap-2 border-b border-gray-200">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
          <span className="ml-3 text-xs text-gray-500 font-medium truncate">
            Трекер привычек — Апрель 2026
          </span>
          <div className="ml-auto flex gap-2">
            {['📊', '🔗'].map(e => (
              <span key={e} className="text-xs text-gray-400">{e}</span>
            ))}
          </div>
        </div>

        {/* Тулбар */}
        <div className="bg-white px-4 py-1.5 flex items-center gap-3 border-b border-gray-100">
          {['fx', 'B', 'I', 'A'].map(t => (
            <span key={t} className="text-[11px] text-gray-400 font-mono border border-gray-200 px-1.5 py-0.5 rounded">
              {t}
            </span>
          ))}
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded px-2 py-0.5">
            <span className="text-[11px] text-gray-400 font-mono">=СЧЁТЕСЛИ(B2:H2,"✓")</span>
          </div>
        </div>

        {/* Таблица */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            {/* Шапка */}
            <thead>
              <tr className="bg-[#f8f9fa]">
                <th className="text-left px-3 py-2 text-gray-500 font-semibold border-b border-r border-gray-200 min-w-[110px]">
                  Привычка
                </th>
                {DAYS.map(d => (
                  <th key={d} className="px-2 py-2 text-gray-500 font-semibold border-b border-r border-gray-200 text-center min-w-[32px]">
                    {d}
                  </th>
                ))}
                <th className="px-3 py-2 text-gray-500 font-semibold border-b border-gray-200 text-center min-w-[48px]">
                  %
                </th>
              </tr>
            </thead>

            <tbody>
              {HABITS.map((habit, ri) => {
                const p = pct(habit.days)
                return (
                  <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}>
                    {/* Название */}
                    <td className="px-3 py-2 border-r border-gray-100 border-b border-b-gray-100">
                      <span className="flex items-center gap-1.5 font-medium text-gray-700">
                        <span>{habit.icon}</span>
                        {habit.name}
                      </span>
                    </td>

                    {/* Дни */}
                    {habit.days.map((done, ci) => (
                      <td key={ci} className="border-r border-gray-100 border-b border-b-gray-100 text-center p-1">
                        <div
                          className={`w-6 h-6 mx-auto rounded flex items-center justify-center transition-all duration-300 ${
                            revealed[ri]?.[ci]
                              ? done
                                ? `${habit.color} text-white scale-100 opacity-100`
                                : 'bg-gray-100 text-gray-300 scale-100 opacity-100'
                              : 'scale-50 opacity-0'
                          }`}
                        >
                          {done ? (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-[10px]">—</span>
                          )}
                        </div>
                      </td>
                    ))}

                    {/* Прогресс */}
                    <td className="px-2 py-2 border-b border-gray-100">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`font-bold text-[11px] ${p === 100 ? 'text-emerald-600' : p >= 70 ? 'text-blue-600' : 'text-amber-600'}`}>
                          {p}%
                        </span>
                        <div className="w-8 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${p === 100 ? 'bg-emerald-500' : p >= 70 ? 'bg-blue-500' : 'bg-amber-500'}`}
                            style={{ width: showBars ? `${p}%` : '0%' }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Статус-бар */}
        <div className="bg-[#f8f9fa] px-4 py-1.5 border-t border-gray-200 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">Апрель 2026 · 5 привычек</span>
          <span className="text-[10px] text-emerald-600 font-semibold">
            ✓ Streak: 5 дней 🔥
          </span>
        </div>
      </div>

      {/* Подпись */}
      <p className="text-center text-gray-500 text-xs mt-3">
        Пример таблицы — скопируй в Google Drive за 1 клик
      </p>
    </div>
  )
}
