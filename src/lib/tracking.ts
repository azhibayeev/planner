import { v4 as uuidv4 } from 'uuid'
import { pixelTrack, getFbCookies } from '@/lib/pixel'

interface TrackOptions {
  eventName: string
  contentIds: string[]
  value?: number
  currency?: string
  contentType?: string
  contentName?: string
  contentCategory?: string
  email?: string
  phone?: string
  externalId?: string
}

/**
 * Sends a Meta Pixel event AND mirrors it to our server-side CAPI endpoint
 * with a shared eventId for deduplication.
 */
export function trackEvent(opts: TrackOptions) {
  if (typeof window === 'undefined') return

  const eventId = uuidv4()
  const { fbp, fbc } = getFbCookies()

  const customData: Record<string, unknown> = {
    content_ids: opts.contentIds,
  }
  if (opts.value !== undefined) customData.value = opts.value
  if (opts.currency) customData.currency = opts.currency
  if (opts.contentType) customData.content_type = opts.contentType
  if (opts.contentName) customData.content_name = opts.contentName
  if (opts.contentCategory) customData.content_category = opts.contentCategory
  // contents — best practice для cart/purchase событий
  if (opts.value !== undefined && opts.contentIds.length > 0) {
    customData.contents = opts.contentIds.map(id => ({
      id,
      quantity: 1,
      item_price: opts.value,
    }))
    customData.num_items = opts.contentIds.length
  }

  pixelTrack(opts.eventName, customData, eventId)

  const userData: Record<string, unknown> = {
    fbp,
    fbc,
    country: 'kz', // KZ-only бизнес — бесплатный signal
  }
  if (opts.email) userData.email = opts.email
  if (opts.phone) userData.phone = opts.phone
  if (opts.externalId) userData.externalId = opts.externalId

  const body = JSON.stringify({
    eventName: opts.eventName,
    eventId,
    sourceUrl: window.location.href,
    userData,
    customData,
  })

  // sendBeacon гарантированно долетает даже если пользователь сразу
  // закрыл вкладку или ушёл на другую страницу. Fetch в этих случаях
  // отменяется и CAPI событие теряется → дедупликация ломается.
  const sent = typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function'
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
}
