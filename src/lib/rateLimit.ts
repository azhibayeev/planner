// Sliding-window rate limiter в памяти процесса.
// Достаточно для single-instance PM2; если когда-нибудь масштабируемся —
// заменим на Upstash Redis или аналогичный shared store.

interface Bucket {
  hits: number[]
}

const store = new Map<string, Bucket>()

interface CheckResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

/**
 * Throttle by composite key. Returns whether the call is allowed
 * and how many calls remain in the current window.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): CheckResult {
  const now = Date.now()
  const cutoff = now - windowMs

  const bucket = store.get(key) ?? { hits: [] }
  // Drop hits older than window
  bucket.hits = bucket.hits.filter((t) => t > cutoff)

  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0]
    return {
      allowed: false,
      remaining: 0,
      resetAt: oldest + windowMs,
    }
  }

  bucket.hits.push(now)
  store.set(key, bucket)

  return {
    allowed: true,
    remaining: limit - bucket.hits.length,
    resetAt: now + windowMs,
  }
}

// Periodic cleanup of stale buckets so the map doesn't grow unbounded.
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000 // 5 minutes
let cleanupTimer: NodeJS.Timeout | null = null

function startCleanup() {
  if (cleanupTimer) return
  cleanupTimer = setInterval(() => {
    const now = Date.now()
    const veryOld = now - 60 * 60 * 1000 // 1h ago
    store.forEach((bucket, key) => {
      if (bucket.hits.length === 0 || bucket.hits[bucket.hits.length - 1] < veryOld) {
        store.delete(key)
      }
    })
  }, CLEANUP_INTERVAL_MS)
  // Don't keep the event loop alive just for cleanup
  if (typeof cleanupTimer.unref === 'function') cleanupTimer.unref()
}
startCleanup()

export function getClientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}
