import * as crypto from 'crypto'
import { supabaseAdmin } from './supabase'

export function sha256(value: string): string {
  // Если строка уже является SHA-256 хэшем (64 символа, только 0-9 и a-f), возвращаем как есть
  const isAlreadyHashed = /^[a-f0-9]{64}$/.test(value);
  if (isAlreadyHashed) return value;

  return crypto
    .createHash('sha256')
    .update(value.trim().toLowerCase())
    .digest('hex')
}

export interface CapiUserData {
  email?: string
  name?: string
  ip?: string
  userAgent?: string
  fbp?: string
  fbc?: string
}

export interface CapiEvent {
  eventName: string
  eventId: string
  sourceUrl: string
  userData: CapiUserData
  customData?: Record<string, unknown>
}

export async function sendCapiEvent(event: CapiEvent): Promise<void> {
  const datasetId = process.env.META_DATASET_ID
  const accessToken = process.env.META_ACCESS_TOKEN
  const testEventCode = process.env.META_TEST_EVENT_CODE

  if (!datasetId || !accessToken) {
    console.warn('[CAPI] Missing META_DATASET_ID or META_ACCESS_TOKEN')
    return
  }

  const userData: Record<string, unknown> = {}

  if (event.userData.email) {
    userData.em = [sha256(event.userData.email)]
  }
  if (event.userData.name) {
    const parts = event.userData.name.trim().split(' ')
    userData.fn = sha256(parts[0] || '')
    if (parts[1]) userData.ln = sha256(parts[1])
  }
  if (event.userData.ip) {
    userData.client_ip_address = event.userData.ip
  }
  if (event.userData.userAgent) {
    userData.client_user_agent = event.userData.userAgent
  }
  if (event.userData.fbp) {
    userData.fbp = event.userData.fbp
  }
  if (event.userData.fbc) {
    userData.fbc = event.userData.fbc
  }

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: event.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        event_source_url: event.sourceUrl,
        action_source: 'website',
        user_data: userData,
        ...(event.customData ? { custom_data: event.customData } : {}),
      },
    ],
  }

  if (testEventCode) {
    payload.test_event_code = testEventCode
  }

  const url = `https://graph.facebook.com/v21.0/${datasetId}/events?access_token=${accessToken}`

  // Логируем событие в Supabase (пропускаем localhost)
  if (!event.sourceUrl.includes('localhost')) {
    supabaseAdmin.from('capi_events').insert({
      event_name: event.eventName,
      event_id: event.eventId,
      order_id: (event.customData?.order_id as string) ?? null,
      email: event.userData.email ?? null,
      value: (event.customData?.value as number) ?? null,
      currency: (event.customData?.currency as string) ?? null,
      source_url: event.sourceUrl,
    }).then(({ error }) => {
      if (error) console.error('[CAPI] Supabase log error:', error.message)
    })
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const err = await res.text()
      console.error('[CAPI] Error:', err)
    } else {
      const json = await res.json()
      console.log('[CAPI] Success:', JSON.stringify(json))
    }
  } catch (e) {
    console.error('[CAPI] Fetch failed:', e)
  }
}
