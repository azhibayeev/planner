import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'
import { sendCapiEvent } from '../../../../lib/capi'
import { sendOrderEmail } from '../../../../lib/email'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('Incoming Webhook:', JSON.stringify(body))

    // ApiPay шлёт данные внутри body.invoice, тест — на корневом уровне
    const invoice = body.invoice || body
    const orderId = invoice.external_order_id || invoice.order_id || body.external_order_id || body.order_id
    const status = invoice.status || body.status

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

      // 2. Обновляем статус
      await supabaseAdmin
        .from('orders')
        .update({ status: 'paid' })
        .eq('order_id', orderId)

      // 3. Отправляем Purchase в Meta CAPI
      await sendCapiEvent({
        eventName: 'Purchase',
        eventId: order_id,
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

    return NextResponse.json({ status: 'ignored', message: `Status: ${status}` })

  } catch (error: any) {
    console.error('Webhook Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
