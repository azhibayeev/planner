'use client'

import { useEffect } from 'react'
import { pixelTrack, getFbCookies } from '@/lib/pixel'
import { v4 as uuidv4 } from 'uuid'

let fired = false

export default function PageViewTracker() {
  useEffect(() => {
    if (fired) return
    fired = true
    pixelTrack('PageView')
    const eventId = uuidv4()
    const { fbp, fbc } = getFbCookies()
    fetch('/api/capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'PageView', eventId,
        sourceUrl: window.location.href,
        userData: { fbp, fbc },
        customData: {},
      }),
    })
  }, [])
  return null
}
