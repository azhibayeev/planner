'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  orderId: string
  amount: number | null
}

export default function RefundButton({ orderId, amount }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRefund = async () => {
    const sum = amount ? `${amount.toLocaleString('ru-RU')} ₸` : 'эту сумму'
    if (!confirm(`Пометить заказ ${orderId} как возвращённый (${sum})?`)) return

    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Ошибка')
      } else {
        router.refresh()
      }
    } catch (e: any) {
      setError(e.message || 'Сетевая ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleRefund}
        disabled={loading}
        className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline disabled:opacity-50"
        title="Пометить как возвращённый"
      >
        {loading ? '...' : 'Возврат'}
      </button>
      {error && <span className="ml-2 text-xs text-red-500">{error}</span>}
    </>
  )
}
