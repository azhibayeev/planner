import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Защищён middleware'ом (Basic Auth для всех /admin/* и /api/admin/*).
// Помечает заказ как refunded и логирует время.
export async function POST(req: Request) {
  try {
    const { order_id } = await req.json()
    if (!order_id || typeof order_id !== 'string') {
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status: 'refunded' })
      .eq('order_id', order_id)
      .eq('status', 'paid')
      .select('order_id, status, amount, email_plain')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!data) return NextResponse.json({ error: 'Order not found or not paid' }, { status: 404 })

    console.log(`[admin] Order ${order_id} refunded`)
    return NextResponse.json({ ok: true, order: data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
