import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Проверяем статус от APIPay
    // В зависимости от их API, статус может быть 'success', 'paid' или 'completed'
    if (body.status === 'success' || body.status === 'paid') {
      const orderId = body.order_id;

      // 2. Идем в Supabase и достаем данные покупателя по order_id
      const { data: order, error: sbError } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (sbError || !order) {
        console.error('Order not found in Supabase:', orderId);
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // 3. ОТПРАВЛЯЕМ ДАННЫЕ В META CAPI (Purchase)
      const fbResponse = await fetch(`https://graph.facebook.com/v19.0/${process.env.FB_PIXEL_ID}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [{
            event_name: "Purchase",
            event_time: Math.floor(Date.now() / 1000),
            event_id: orderId, // Обязательно тот же ID для дедупликации
            action_source: "website",
            user_data: {
              em: [order.email],
              ph: [order.phone],
              client_ip_address: order.ip_address,
              client_user_agent: order.user_agent,
              fbp: order.fbp,
              fbc: order.fbc
            },
            custom_data: {
              currency: "KZT",
              value: body.amount || 0
            }
          }],
          access_token: process.env.FB_ACCESS_TOKEN // Твой токен Meta
        })
      });

      const fbResult = await fbResponse.json();
      console.log('Meta CAPI Success:', fbResult);

      // 4. Обновляем статус заказа в базе на 'paid'
      await supabaseAdmin
        .from('orders')
        .update({ status: 'paid' })
        .eq('order_id', orderId);
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error('Webhook Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}