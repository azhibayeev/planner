import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { sendCapiEvent } from '../../../../lib/capi'; // Если ты создал этот хелпер

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Incoming Webhook:', body);

    // 1. Берем данные из тела запроса ApiPay
    // Проверь ключи в документации ApiPay (обычно это order_id и status)
    const { order_id, status } = body;

    if (status === 'success' || status === 'paid') {
      
      // 2. Ищем данные о пользователе в Supabase, которые мы сохранили при чекауте
      const { data: order, error: fetchError } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('order_id', order_id)
        .single();

      if (fetchError || !order) {
        throw new Error('Order not found in database');
      }

      // 3. Обновляем статус в базе
      await supabaseAdmin
        .from('orders')
        .update({ status: 'paid' })
        .eq('order_id', order_id);

      // 4. ОТПРАВЛЯЕМ PURCHASE В META CAPI
      await sendCapiEvent({
        eventName: 'Purchase',
        eventId: order_id,
        sourceUrl: 'https://myplaner.asia',
        userData: {
          email: order.email,    // в capi.ts это 'email', а не 'em'
          ip: order.ip_address,  // в capi.ts это 'ip', а не 'client_ip_address'
          userAgent: order.user_agent, // в capi.ts это 'userAgent'
          fbp: order.fbp,
          fbc: order.fbc
        },
        customData: {
          value: order.amount || 0,
          currency: 'KZT'
        }
      });

      return NextResponse.json({ status: 'ok', message: 'Order updated and CAPI sent' });
    }

    return NextResponse.json({ status: 'ignored', message: 'Payment not successful' });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}