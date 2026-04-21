'use client'

import { useEffect, useState } from 'react'

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const HABITS = [
  { icon: '🏃', name: 'Спорт',     days: [1,1,1,1,1,0,1], color: 'bg-violet-500', light: 'bg-violet-50 text-violet-700' },
  { icon: '💧', name: 'Вода 2л',   days: [1,1,1,1,1,1,1], color: 'bg-blue-500',   light: 'bg-blue-50 text-blue-700'     },
  { icon: '📚', name: 'Чтение',    days: [1,0,1,1,0,1,1], color: 'bg-emerald-500',light: 'bg-emerald-50 text-emerald-700'},
  { icon: '🧘', name: 'Медитация', days: [1,1,0,1,1,0,1], color: 'bg-pink-500',   light: 'bg-pink-50 text-pink-700'     },
  { icon: '😴', name: 'Сон 8ч',   days: [0,1,1,1,1,1,1], color: 'bg-amber-500',  light: 'bg-amber-50 text-amber-700'   },
]

const pct = (days: number[]) =>
  Math.round((days.filter(Boolean).length / days.length) * 100)

const totalDone = HABITS.reduce((s, h) => s + h.days.filter(Boolean).length, 0)
const totalCells = HABITS.length * HABITS[0].days.length
const overallPct = Math.round((totalDone / totalCells) * 100)

export default function SpreadsheetPreview() {
  const [revealed, setRevealed] = useState<boolean[][]>(
    () => HABITS.map(() => DAYS.map(() => false))
  )
  const [showBars, setShowBars] = useState(false)

  useEffect(() => {
    const cells: [number, number][] = []
    HABITS.forEach((_, ri) => DAYS.forEach((_, ci) => cells.push([ri, ci])))

    cells.forEach(([ri, ci], i) =>
      setTimeout(() => {
        setRevealed(prev => {
          const next = prev.map(r => [...r])
          next[ri][ci] = true
          return next
        })
      }, 300 + i * 55)
    )
    setTimeout(() => setShowBars(true), 300 + cells.length * 55 + 150)
  }, [])

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 bg-white">

        {/* Заголовок окна */}
        <div className="bg-[#1e1e2e] px-4 py-2.5 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
          <span className="ml-3 text-xs text-gray-400 font-medium">
            Трекер привычек — Апрель 2026
          </span>
          <span className="ml-auto text-[10px] text-gray-600 bg-white/10 px-2 py-0.5 rounded-full">
            Неделя 3
          </span>
        </div>

        {/* Дашборд — карточки статистики */}
        <div className="bg-[#f8f9ff] px-4 py-3 grid grid-cols-3 gap-2 border-b border-gray-200">
          {/* Выполнено */}
          <div className="bg-white rounded-xl p-2.5 shadow-sm border border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 mb-0.5">Выполнено</p>
            <p className="text-lg font-extrabold text-gray-900">{totalDone}
              <span className="text-xs text-gray-400 font-normal">/{totalCells}</span>
            </p>
            <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all duration-1000"
                style={{ width: showBars ? `${overallPct}%` : '0%' }}
              />
            </div>
          </div>

          {/* Streak */}
          <div className="bg-white rounded-xl p-2.5 shadow-sm border border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 mb-0.5">Streak</p>
            <p className="text-lg font-extrabold text-orange-500">5 🔥</p>
            <p className="text-[10px] text-gray-400 mt-1">дней подряд</p>
          </div>

          {/* Лучшая */}
          <div className="bg-white rounded-xl p-2.5 shadow-sm border border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 mb-0.5">Лучшая</p>
            <p className="text-base font-extrabold text-blue-600">💧</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">100%</p>
          </div>
        </div>

        {/* Таблица привычек */}
        <div className="overflow-x-auto bg-white">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa]">
                <th className="text-left px-3 py-2 text-gray-400 font-semibold border-b border-r border-gray-100 min-w-[100px]">
                  Привычка
                </th>
                {DAYS.map(d => (
                  <th key={d} className="px-1.5 py-2 text-gray-400 font-semibold border-b border-r border-gray-100 text-center min-w-[28px]">
                    {d}
                  </th>
                ))}
                <th className="px-2 py-2 text-gray-400 font-semibold border-b border-gray-100 text-center min-w-[44px]">
                  %
                </th>
              </tr>
            </thead>
            <tbody>
              {HABITS.map((habit, ri) => {
                const p = pct(habit.days)
                return (
                  <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-[#fafbff]'}>
                    <td className="px-3 py-1.5 border-r border-b border-gray-100">
                      <span className="flex items-center gap-1.5 font-semibold text-gray-700">
                        <span>{habit.icon}</span>
                        <span className="truncate">{habit.name}</span>
                      </span>
                    </td>
                    {habit.days.map((done, ci) => (
                      <td key={ci} className="border-r border-b border-gray-100 text-center p-1">
                        <div className={`w-5 h-5 mx-auto rounded-md flex items-center justify-center transition-all duration-300 ${
                          revealed[ri]?.[ci]
                            ? done
                              ? `${habit.color} text-white scale-100 opacity-100`
                              : 'bg-gray-100 text-gray-300 scale-100 opacity-100'
                            : 'scale-50 opacity-0'
                        }`}>
                          {done
                            ? <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            : <span className="text-[9px]">–</span>
                          }
                        </div>
                      </td>
                    ))}
                    <td className="px-2 py-1.5 border-b border-gray-100">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className={`font-bold text-[11px] ${p===100?'text-emerald-600':p>=70?'text-blue-600':'text-amber-500'}`}>
                          {p}%
                        </span>
                        <div className="w-7 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${p===100?'bg-emerald-500':p>=70?'bg-blue-500':'bg-amber-400'}`}
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
        <div className="bg-[#1e1e2e] px-4 py-2 flex items-center justify-between">
          <span className="text-[10px] text-gray-500">5 привычек · Апрель 2026</span>
          <span className="text-[10px] text-emerald-400 font-semibold">{overallPct}% выполнено ✨</span>
        </div>
      </div>

      <p className="text-center text-gray-500 text-xs mt-3">
        Пример — скопируй в свой Google Drive за 1 клик
      </p>
    </div>
  )
}
