import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';
import * as crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, phone, amount, product_id } = body

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
          email_plain: email,
          phone: hashedPhone,
          amount: amount,
          product_id: product_id,
          ip_address: ip,
          user_agent: userAgent,
          fbp: fbp,
          fbc: fbc,
          status: 'pending'
        }
      ]);

    if (sbError) throw new Error(`Supabase error: ${sbError.message}`);

  // 5. ЗАПРОС В APIPAY.KZ
  const apiPayResponse = await fetch('https://bpapi.bazarbay.site/api/invoices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.APIPAY_API_KEY || ''
    },
    body: JSON.stringify({
      amount: amount,
      phone_number: phone,
      external_order_id: orderId,
      description: 'Оплата заказа в MyPlaner',
      callback_url: 'https://myplaner.asia/api/webhooks/apipay',
      success_url: 'https://myplaner.asia/success'
    })
  });

  // ПРОВЕРКА: Если ApiPay вернул ошибку, логгируем её текст (HTML)
  if (!apiPayResponse.ok) {
    const errorText = await apiPayResponse.text();
    console.error('ApiPay Error Response:', errorText);
    throw new Error(`ApiPay error: ${apiPayResponse.status} ${apiPayResponse.statusText}`);
  }

  const apiPayData = await apiPayResponse.json();
  return NextResponse.json({ url: apiPayData.payment_url });

    // 6. Возвращаем ссылку на оплату на фронтенд
    return NextResponse.json({ url: apiPayData.payment_url });

  } catch (error: any) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}