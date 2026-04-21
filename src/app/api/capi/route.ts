import { NextResponse } from 'next/server'
import { sendCapiEvent } from '../../../lib/capi'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { eventName, eventId, sourceUrl, userData, customData } = body

    if (!eventName || !eventId) {
      return NextResponse.json({ error: 'Missing eventName or eventId' }, { status: 400 })
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '0.0.0.0'
    const userAgent = req.headers.get('user-agent') || ''

    await sendCapiEvent({
      eventName,
      eventId,
      sourceUrl: sourceUrl || 'https://myplaner.asia',
      userData: {
        ...userData,
        ip: userData?.ip || ip,
        userAgent: userData?.userAgent || userAgent,
      },
      customData,
    })

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('[/api/capi] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
