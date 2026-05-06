import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Возвращает статус заказа по order_id. Используется фронтом для polling
// после оформления — когда status станет 'paid', редиректим пользователя на /success.
//
// Эндпоинт публичный: order_id предсказуемый (Date.now-based), но мы возвращаем
// только status и amount — никаких email/телефонов, поэтому утечка минимальна.
export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: { orderId: string } }) {
  const { orderId } = params
  if (!orderId || !orderId.startsWith('order_')) {
    return NextResponse.json({ error: 'Bad order_id' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('status, amount')
    .eq('order_id', orderId)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(
    { status: data.status, amount: data.amount },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
