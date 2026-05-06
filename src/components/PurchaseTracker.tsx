'use client'

import { useEffect, useRef } from 'react'
import { pixelTrack, getFbCookies } from '@/lib/pixel'
import { ymEcomPurchase, ymGoal } from '@/lib/yandex'
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
      const productId = order.content_ids?.[0] ?? 'unknown'

      // Pixel side
      const pixelData: Record<string, unknown> = {
        value: order.value,
        currency: order.currency,
        content_ids: order.content_ids,
        content_type: 'product',
      }
      if (order.product_name) pixelData.content_name = order.product_name
      if (order.value && order.content_ids) {
        pixelData.contents = order.content_ids.map((id: string) => ({
          id,
          quantity: 1,
          item_price: order.value,
        }))
        pixelData.num_items = order.content_ids.length
      }
      pixelTrack('Purchase', pixelData, eventId)

      // CAPI side — с максимальным набором матчинг-параметров
      const userData: Record<string, unknown> = { fbp, fbc, country: 'kz' }
      if (order.email) userData.email = order.email
      if (order.phone) userData.phone = order.phone
      if (order.order_id) userData.externalId = order.order_id

      const body = JSON.stringify({
        eventName: 'Purchase',
        eventId,
        sourceUrl: window.location.href,
        userData,
        customData: pixelData,
      })

      const sent = typeof navigator.sendBeacon === 'function'
        ? navigator.sendBeacon('/api/capi', new Blob([body], { type: 'application/json' }))
        : false
      if (!sent) {
        fetch('/api/capi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        }).catch(() => {})
      }

      // Yandex Metrica goal + ecommerce
      ymEcomPurchase(eventId, productId, order.product_name ?? productId, order.value ?? 0)
      ymGoal('purchase', { value: order.value, product_id: productId })

      localStorage.removeItem('last_order')
    } catch {
      // ignore parse errors
    }
  }, [])

  return null
}
