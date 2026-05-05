import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface CheckResult {
  ok: boolean
  latency_ms?: number
  error?: string
}

async function checkSupabase(): Promise<CheckResult> {
  const start = Date.now()
  try {
    const { error } = await supabaseAdmin
      .from('orders')
      .select('order_id', { count: 'exact', head: true })
      .limit(1)
    if (error) return { ok: false, error: error.message }
    return { ok: true, latency_ms: Date.now() - start }
  } catch (e: any) {
    return { ok: false, error: e.message ?? 'unknown' }
  }
}

function checkEnv(): CheckResult {
  const required = [
    'NEXT_PUBLIC_PIXEL_ID',
    'META_DATASET_ID',
    'META_ACCESS_TOKEN',
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'APIPAY_API_KEY',
    'APIPAY_WEBHOOK_SECRET',
    'RESEND_API_KEY',
  ]
  const missing = required.filter((k) => !process.env[k])
  if (missing.length) return { ok: false, error: `missing: ${missing.join(',')}` }
  return { ok: true }
}

export async function GET() {
  const startedAt = Date.now()
  const [supabase, env] = await Promise.all([checkSupabase(), Promise.resolve(checkEnv())])

  const allOk = supabase.ok && env.ok
  const body = {
    status: allOk ? 'healthy' : 'degraded',
    uptime_s: Math.floor(process.uptime()),
    checks: { supabase, env },
    duration_ms: Date.now() - startedAt,
  }

  return NextResponse.json(body, {
    status: allOk ? 200 : 503,
    headers: { 'Cache-Control': 'no-store' },
  })
}
