import { NextRequest, NextResponse } from 'next/server'
import { sendCapiEvent, CapiUserData } from '@/lib/capi'

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    eventName: string
    eventId: string
    sourceUrl: string
    userData?: CapiUserData
    customData?: Record<string, unknown>
  }

  const { eventName, eventId, sourceUrl, userData = {}, customData } = body

  if (!eventName || !eventId || !sourceUrl) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // IP и User-Agent берём из заголовков запроса (надёжнее, чем с клиента)
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '0.0.0.0'

  const userAgent = req.headers.get('user-agent') || ''

  await sendCapiEvent({
    eventName,
    eventId,
    sourceUrl,
    userData: {
      ...userData,
      ip,
      userAgent,
    },
    customData,
  })

  return NextResponse.json({ ok: true })
}
