// Утилиты для работы с Meta Pixel на клиенте

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void
    _fbq: unknown
  }
}

export function pixelTrack(
  eventName: string,
  params?: Record<string, unknown>,
  eventId?: string
) {
  if (typeof window === 'undefined' || !window.fbq) return
  if (eventId) {
    window.fbq('track', eventName, params || {}, { eventID: eventId })
  } else {
    window.fbq('track', eventName, params || {})
  }
}

// Получаем fbp и fbc из cookies для передачи в CAPI
export function getFbCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === 'undefined') return {}
  const cookies = document.cookie.split(';').reduce<Record<string, string>>((acc, c) => {
    const [k, v] = c.trim().split('=')
    acc[k] = v
    return acc
  }, {})
  return {
    fbp: cookies['_fbp'],
    fbc: cookies['_fbc'],
  }
}
