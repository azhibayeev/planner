'use client'

import { useEffect } from 'react'
import { pixelTrack } from '@/lib/pixel'

let fired = false

export default function PageViewTracker() {
  useEffect(() => {
    if (fired) return
    fired = true
    pixelTrack('PageView')
  }, [])
  return null
}
