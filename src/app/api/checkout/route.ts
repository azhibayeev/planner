import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';
import { checkRateLimit, getClientIp } from '../../../lib/rateLimit';
import * as crypto from 'crypto';

const WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const IP_LIMIT = 5
const PHONE_LIMIT = 3

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, phone: rawPhone, amount, product_id } = body

    // Нормализуем телефон → формат 8XXXXXXXXXX (требование ApiPay)
    const digits = (rawPhone || '').replace(/\D/g, '')
    const phone = digits.startsWith('7') ? '8' + digits.slice(1)
                : digits.startsWith('8') ? digits
                : digits

    // Rate limit: защита от создания массы счетов одним IP / на один телефон
    const clientIp = getClientIp(req)
    const ipCheck = checkRateLimit(`checkout:ip:${clientIp}`, IP_LIMIT, WINDOW_MS)
    if (!ipCheck.allowed) {
      const retryAfter = Math.ceil((ipCheck.resetAt - Date.now()) / 1000)
      return NextResponse.json(
        { error: 'Слишком много попыток. Попробуйте через несколько минут.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      )
    }
    if (phone) {
      const phoneCheck = checkRateLimit(`checkout:phone:${phone}`, PHONE_LIMIT, WINDOW_MS)
      if (!phoneCheck.allowed) {
        const retryAfter = Math.ceil((phoneCheck.resetAt - Date.now()) / 1000)
        return NextResponse.json(
          { error: 'На этот номер уже создано несколько счетов. Подождите 10 минут.' },
          { status: 429, headers: { 'Retry-After': String(retryAfter) } }
        )
      }
    }

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
  // callback_url включает APIPAY_WEBHOOK_SECRET как часть пути — APIPAY режет
  // query-параметры из callback_url, но путь сохраняет полностью.
  const webhookSecret = process.env.APIPAY_WEBHOOK_SECRET
  if (!webhookSecret) {
    throw new Error('APIPAY_WEBHOOK_SECRET is not configured')
  }
  const callbackUrl = `https://myplaner.asia/api/webhooks/apipay/${encodeURIComponent(webhookSecret)}`

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
      callback_url: callbackUrl,
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
  console.log('ApiPay Success Response:', JSON.stringify(apiPayData));

  // ApiPay отправляет push в Kaspi-приложение — redirect URL не возвращается.
  // Возвращаем orderId, чтобы клиент использовал его как event_id на success-странице
  // → Purchase event дедуплицируется с серверным (webhook).
  return NextResponse.json({ success: true, invoiceId: apiPayData.id, orderId });

  } catch (error: any) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}