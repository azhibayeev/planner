'use client'

import { useEffect } from 'react'
import { pixelTrack, getFbCookies } from '@/lib/pixel'
import { v4 as uuidv4 } from 'uuid'

export default function PurchaseTracker() {
  useEffect(() => {
    const raw = localStorage.getItem('last_order')
    if (!raw) return

    try {
      const order = JSON.parse(raw)
      const eventId = uuidv4()
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
