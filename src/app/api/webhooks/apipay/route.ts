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
      // Теперь Facebook увидит, что этот конкретный IP/Email реально купил!
      await sendCapiEvent({
        eventName: 'Purchase',
        eventId: order_id,
        sourceUrl: 'https://myplaner.asia',
        userData: {
          em: order.email, // Уже хэширован при сохранении
          ph: order.phone, // Уже хэширован
          client_ip_address: order.ip_address,
          client_user_agent: order.user_agent,
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