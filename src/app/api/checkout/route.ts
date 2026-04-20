import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';
import * as crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, phone, amount, items } = body;

    // 1. Генерируем уникальный ID заказа
    const orderId = `order_${Date.now()}`;

    // 2. Собираем данные браузера для Meta CAPI
    const ip = req.headers.get('x-forwarded-for') || '0.0.0.0';
    const userAgent = req.headers.get('user-agent') || '';
    
    // Пытаемся достать fbp/fbc из куки (если переданы с фронта)
    const fbp = req.headers.get('cookie')?.split('; ').find(row => row.startsWith('_fbp='))?.split('=')[1] || '';
    const fbc = req.headers.get('cookie')?.split('; ').find(row => row.startsWith('_fbc='))?.split('=')[1] || '';

    // 3. Хэшируем данные (SHA-256) для Meta
    const hashData = (str: string) => crypto.createHash('sha256').update(str.trim().toLowerCase()).digest('hex');
    const hashedEmail = email ? hashData(email) : null;
    const hashedPhone = phone ? hashData(phone) : null;

    // 4. СОХРАНЯЕМ В SUPABASE
    // Это наш "бекап" данных, который мы вытащим, когда придет вебхук об оплате
    const { error: sbError } = await supabaseAdmin
      .from('orders')
      .insert([
        { 
          order_id: orderId, 
          email: hashedEmail, 
          phone: hashedPhone,
          ip_address: ip,
          user_agent: userAgent,
          fbp: fbp,
          fbc: fbc,
          status: 'pending'
        }
      ]);

    if (sbError) throw new Error(`Supabase error: ${sbError.message}`);

    // 5. ЗАПРОС В APIPAY.KZ
    // Тут мы формируем запрос к платежке
    const apiPayResponse = await fetch('https://api.apipay.kz/v1/orders/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.APIPAY_API_KEY}` // Не забудь добавить в .env.local
      },
      body: JSON.stringify({
        amount: amount,
        order_id: orderId,
        description: 'Оплата заказа в MyPlaner',
        callback_url: `https://myplaner.asia/api/webhooks/apipay` // Куда придет уведомление
      })
    });

    const apiPayData = await apiPayResponse.json();

    // 6. Возвращаем ссылку на оплату на фронтенд
    return NextResponse.json({ url: apiPayData.payment_url });

  } catch (error: any) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}