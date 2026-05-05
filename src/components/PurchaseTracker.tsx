'use client'

import { useEffect, useRef } from 'react'
import { pixelTrack, getFbCookies } from '@/lib/pixel'
import { v4 as uuidv4 } from 'uuid'

export default function PurchaseTracker() {
  // Защита от двойного fire в React Strict Mode (dev).
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true

    const raw = localStorage.getItem('last_order')
    if (!raw) return

    try {
      const order = JSON.parse(raw)
      // Используем order_id как event_id, чтобы дедуплицировать
      // с Purchase event'ом из webhook (который тоже использует order_id).
      // Fallback на UUID для старых сохранённых заказов без order_id.
      const eventId = order.order_id || uuidv4()
      const { fbp, fbc } = getFbCookies()

      pixelTrack('Purchase', {
        value: order.value,
        currency: order.currency,
        content_ids: order.content_ids,
      }, eventId)

      fetch('/api/capi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: 'Purchase',
          eventId,
          sourceUrl: window.location.href,
          userData: { fbp, fbc },
          customData: {
            value: order.value,
            currency: order.currency,
            content_ids: order.content_ids,
          },
        }),
      })

      localStorage.removeItem('last_order')
    } catch {
      // ignore parse errors
    }
  }, [])

  return null
}
