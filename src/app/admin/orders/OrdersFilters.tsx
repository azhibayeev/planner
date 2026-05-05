'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

interface Props {
  status: string
  days: string
  q: string
}

const STATUSES = [
  { value: 'all', label: 'Все' },
  { value: 'paid', label: 'Оплачено' },
  { value: 'pending', label: 'В ожидании' },
  { value: 'pending_reminded', label: 'Напоминание' },
  { value: 'failed', label: 'Ошибка' },
]

const DAY_RANGES = [
  { value: '1', label: '24ч' },
  { value: '7', label: '7д' },
  { value: '30', label: '30д' },
  { value: '90', label: '90д' },
  { value: '365', label: 'Год' },
]

export default function OrdersFilters({ status, days, q }: Props) {
  const router = useRouter()
  const params = useSearchParams()
  const [search, setSearch] = useState(q)

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value === 'all' || !value) next.delete(key)
    else next.set(key, value)
    router.push(`/admin/orders?${next.toString()}`)
  }

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    update('q', search.trim())
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-white rounded-xl border border-gray-200 p-3">
      <div className="flex flex-wrap gap-1">
        {STATUSES.map(s => (
          <button
            key={s.value}
            onClick={() => update('status', s.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              status === s.value || (s.value === 'all' && !status)
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="hidden sm:block w-px h-6 bg-gray-200" />

      <div className="flex flex-wrap gap-1">
        {DAY_RANGES.map(r => (
          <button
            key={r.value}
            onClick={() => update('days', r.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              days === r.value
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <form onSubmit={submitSearch} className="sm:ml-auto flex gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="email или order_id"
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent w-48"
        />
        <button
          type="submit"
          className="bg-black text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-gray-800"
        >
          Найти
        </button>
      </form>
    </div>
  )
}
