// Helpers для Yandex Metrica.
// Counter ID берётся из env (NEXT_PUBLIC_YM_ID), поэтому работает только если он задан.

declare global {
  interface Window {
    ym?: (counterId: number, method: string, ...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

function counterId(): number | null {
  const raw = process.env.NEXT_PUBLIC_YM_ID
  if (!raw) return null
  const n = parseInt(raw, 10)
  return Number.isNaN(n) ? null : n
}

/** Отправить достижение цели по имени. */
export function ymGoal(name: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || !window.ym) return
  const id = counterId()
  if (id === null) return
  if (params) {
    window.ym(id, 'reachGoal', name, params)
  } else {
    window.ym(id, 'reachGoal', name)
  }
}

/** E-commerce: пользователь открыл карточку товара. */
export function ymEcomDetail(productId: string, name: string, price: number): void {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    ecommerce: {
      detail: {
        products: [{ id: productId, name, price }],
      },
    },
  })
}

/** E-commerce: пользователь начал оформление. */
export function ymEcomAdd(productId: string, name: string, price: number): void {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    ecommerce: {
      add: {
        products: [{ id: productId, name, price, quantity: 1 }],
      },
    },
  })
}

/** E-commerce: оплата прошла. */
export function ymEcomPurchase(orderId: string, productId: string, name: string, price: number): void {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    ecommerce: {
      purchase: {
        actionField: { id: orderId, revenue: price },
        products: [{ id: productId, name, price, quantity: 1 }],
      },
    },
  })
}
