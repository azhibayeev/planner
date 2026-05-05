import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { supabaseAdmin } from '../../../../lib/supabase'
import { sendCapiEvent } from '../../../../lib/capi'
import { sendOrderEmail, sendPendingReminderEmail, sendPaymentErrorEmail } from '../../../../lib/email'
import { PRODUCT_NAMES } from '../../../../lib/orderHelpers'

function secretsMatch(provided: string | null, expected: string | undefined): boolean {
  if (!expected || !provided) return false
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export async function POST(req: Request) {
  // Auth: только запросы с правильным секретом в URL принимаем.
  // APIPAY эхо-возвращает callback_url, который мы задаём при создании счёта.
  const url = new URL(req.url)
  const providedSecret = url.searchParams.get('secret')
  const expectedSecret = process.env.APIPAY_WEBHOOK_SECRET

  if (!secretsMatch(providedSecret, expectedSecret)) {
    console.warn('[Webhook] Unauthorized — secret mismatch or missing')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    console.log('Incoming Webhook:', JSON.stringify(body))

    // ApiPay шлёт данные внутри body.invoice, тест — на корневом уровне
    const invoice = body.invoice || body
    const orderId = invoice.external_order_id || invoice.order_id || body.external_order_id || body.order_id
    const status = invoice.status || body.status

    if (!orderId) {
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 })
    }

    if (status === 'success' || status === 'paid') {

      // 1. Берём данные заказа из Supabase
      const { data: order, error: fetchError } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('order_id', orderId)
        .single()

      if (fetchError || !order) {
        throw new Error(`Order not found: ${orderId}`)
      }

      // Идемпотентность: если уже оплачен, не дублируем Purchase event и письмо
      if (order.status === 'paid') {
        console.log(`[Webhook] Order ${orderId} already paid — ignoring duplicate`)
        return NextResponse.json({ status: 'already_paid' })
      }

      // 2. Обновляем статус
      await supabaseAdmin
        .from('orders')
        .update({ status: 'paid' })
        .eq('order_id', orderId)

      // 3. Отправляем Purchase в Meta CAPI
      await sendCapiEvent({
        eventName: 'Purchase',
        eventId: orderId,
        sourceUrl: 'https://myplaner.asia',
        userData: {
          email: order.email,
          ip: order.ip_address,
          userAgent: order.user_agent,
          fbp: order.fbp,
          fbc: order.fbc,
        },
        customData: {
          value: order.amount || 0,
          currency: 'KZT',
        },
      })

      // 4. Отправляем письмо с таблицей
      if (order.email_plain && order.product_id) {
        await sendOrderEmail(order.email_plain, order.product_id)
        console.log(`Email sent to ${order.email_plain} for product ${order.product_id}`)
      } else {
        console.warn(`Missing email_plain or product_id for order ${orderId}`)
      }

      return NextResponse.json({ status: 'ok' })
    }

    if (status === 'pending') {
      const { data: order } = await supabaseAdmin
        .from('orders')
        .select('email_plain, product_id, status')
        .eq('order_id', orderId)
        .single()

      // Не шлём напоминалку, если заказ уже завершён
      if (order?.status === 'paid' || order?.status === 'pending_reminded') {
        return NextResponse.json({ status: 'ignored' })
      }

      if (order?.email_plain && order?.product_id) {
        const productName = PRODUCT_NAMES[order.product_id] ?? 'MyPlaner'
        await sendPendingReminderEmail(order.email_plain, productName)
        await supabaseAdmin
          .from('orders')
          .update({ status: 'pending_reminded' })
          .eq('order_id', orderId)
        console.log(`Pending reminder sent to ${order.email_plain}`)
      }
      return NextResponse.json({ status: 'pending_reminder_sent' })
    }

    if (status === 'error') {
      const { data: order } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('order_id', orderId)
        .single()

      if (!order) {
        return NextResponse.json({ status: 'ignored', message: 'order not found' })
      }

      // Идемпотентность для error
      if (order.status === 'failed') {
        return NextResponse.json({ status: 'already_failed' })
      }

      // Трекаем неуспешный платёж в Meta CAPI для ретаргетинга
      await sendCapiEvent({
        eventName: 'PaymentFailed',
        eventId: `failed_${orderId}`,
        sourceUrl: 'https://myplaner.asia',
        userData: {
          email: order.email,
          ip: order.ip_address,
          userAgent: order.user_agent,
          fbp: order.fbp,
          fbc: order.fbc,
        },
        customData: {
          value: order.amount || 0,
          currency: 'KZT',
          order_id: orderId,
        },
      })
      console.log(`PaymentFailed CAPI event sent for order ${orderId}`)

      if (order.email_plain && order.product_id) {
        const productName = PRODUCT_NAMES[order.product_id] ?? 'MyPlaner'
        await sendPaymentErrorEmail(order.email_plain, productName)
        console.log(`Payment error email sent to ${order.email_plain}`)
      }

      await supabaseAdmin
        .from('orders')
        .update({ status: 'failed' })
        .eq('order_id', orderId)

      return NextResponse.json({ status: 'error_email_sent' })
    }

    return NextResponse.json({ status: 'ignored', message: `Status: ${status}` })

  } catch (error: any) {
    console.error('Webhook Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
