import { Resend } from 'resend'

// Ссылки «Сделать копию» для каждого продукта
const PRODUCT_LINKS: Record<string, { name: string; copyUrl: string }> = {
  'habit-tracker': {
    name: 'Трекер привычек',
    copyUrl: 'https://docs.google.com/spreadsheets/d/1ppzcUwoDr_aeGani6yuL3a-PXyUwEmnxD5TsgrqWIAU/copy',
  },
  'task-tracker': {
    name: 'Трекер задач',
    copyUrl: 'https://docs.google.com/spreadsheets/d/1_425hUdYRBuI6FK6GuWRbsQbgKsw4Tm10gGlVjHZqrA/copy',
  },
  'budget': {
    name: 'Финансовый планер',
    copyUrl: 'https://docs.google.com/spreadsheets/d/13T32-Vfy_0am27yKdnUSM2xgWnvnzwisiXOOEiIpGuo/copy',
  },
  'planer-week': {
    name: 'Планер на неделю',
    copyUrl: 'https://docs.google.com/spreadsheets/d/10MdVOdzoVnQolknhgsv5HOEUuo7QUO9Q/copy',
  },
  'pink-habit-tracker': {
    name: 'Розовый трекер привычек',
    copyUrl: 'https://docs.google.com/spreadsheets/d/11HFPZDJ9O6zh5YWEmy_3WCshBmEQx9RKUgO60sEt0wU/copy',
  },
  'bundle-all': {
    name: 'Все вместе',
    copyUrl: '', // для бандла используем несколько ссылок ниже
  },
}

const BUNDLE_LINKS = [
  PRODUCT_LINKS['habit-tracker'],
  PRODUCT_LINKS['task-tracker'],
  PRODUCT_LINKS['budget'],
  PRODUCT_LINKS['planer-week'],
  PRODUCT_LINKS['pink-habit-tracker'],
]

function buildEmailHtml(productId: string): string {
  const isBundle = productId === 'bundle-all'
  const product = PRODUCT_LINKS[productId]

  const linksHtml = isBundle
    ? BUNDLE_LINKS.map(
        (p) => `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
            <span style="font-weight: 600; color: #111;">${p.name}</span><br/>
            <a href="${p.copyUrl}"
               style="color: #7c3aed; text-decoration: none; font-size: 14px;">
              Открыть и скопировать →
            </a>
          </td>
        </tr>`
      ).join('')
    : `
        <tr>
          <td style="padding: 16px 0;">
            <a href="${product.copyUrl}"
               style="display: inline-block; background: #111; color: #fff;
                      font-weight: 600; font-size: 15px; padding: 14px 28px;
                      border-radius: 10px; text-decoration: none;">
              Открыть таблицу →
            </a>
          </td>
        </tr>`

  return `
    <!DOCTYPE html>
    <html lang="ru">
    <head><meta charset="UTF-8"/></head>
    <body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 16px;">
        <tr>
          <td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08);">

              <!-- Header -->
              <tr>
                <td style="background:#111;padding:28px 32px;">
                  <span style="color:#fff;font-size:20px;font-weight:700;">MyPlaner</span>
                  <span style="color:#f59e0b;font-size:20px;font-weight:700;">.</span>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:32px;">
                  <h1 style="margin:0 0 8px;font-size:22px;color:#111;">Оплата прошла успешно! 🎉</h1>
                  <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
                    Спасибо за покупку. ${isBundle ? 'Все ваши таблицы' : `Ваша таблица <strong style="color:#111;">${product?.name}</strong>`} готовы — нажмите на ссылку${isBundle ? 'и' : ''}, чтобы скопировать ${isBundle ? 'их' : 'её'} в свой Google Drive.
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${linksHtml}
                  </table>

                  <div style="margin-top:28px;background:#f9fafb;border-radius:10px;padding:16px 20px;">
                    <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">
                      <strong style="color:#111;">Как пользоваться:</strong><br/>
                      1. Нажмите на ссылку выше<br/>
                      2. Google спросит «Создать копию?» — нажмите <strong>ОК</strong><br/>
                      3. Таблица появится в вашем Google Drive — можно начинать!
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:20px 32px;border-top:1px solid #f0f0f0;">
                  <p style="margin:0;color:#9ca3af;font-size:12px;">
                    Если что-то пошло не так — напишите нам:
                    <a href="mailto:support@myplaner.asia" style="color:#7c3aed;">support@myplaner.asia</a>
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

export async function sendPendingReminderEmail(to: string, productName: string): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'MyPlaner <noreply@myplaner.asia>',
    to,
    subject: 'Подтвердите оплату в Kaspi',
    html: `
      <!DOCTYPE html>
      <html lang="ru">
      <head><meta charset="UTF-8"/></head>
      <body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 16px;">
          <tr><td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08);">
              <tr><td style="background:#111;padding:28px 32px;">
                <span style="color:#fff;font-size:20px;font-weight:700;">MyPlaner</span>
                <span style="color:#f59e0b;font-size:20px;font-weight:700;">.</span>
              </td></tr>
              <tr><td style="padding:32px;">
                <h1 style="margin:0 0 8px;font-size:22px;color:#111;">Счёт ждёт подтверждения 🔔</h1>
                <p style="margin:0 0 20px;color:#6b7280;font-size:15px;line-height:1.6;">
                  Вы оформили заказ на <strong style="color:#111;">${productName}</strong>.<br/>
                  Счёт выставлен в Kaspi — осталось только подтвердить оплату.
                </p>
                <div style="background:#fef3c7;border-radius:10px;padding:16px 20px;margin-bottom:20px;">
                  <p style="margin:0;color:#92400e;font-size:14px;line-height:1.6;">
                    <strong>Как подтвердить:</strong><br/>
                    1. Откройте приложение <strong>Kaspi</strong><br/>
                    2. Перейдите во вкладку <strong>«Платежи»</strong><br/>
                    3. Найдите счёт от MyPlaner и нажмите <strong>«Оплатить»</strong>
                  </p>
                </div>
                <p style="margin:0;color:#9ca3af;font-size:13px;">
                  После оплаты ссылка на таблицу придёт на этот email автоматически.
                </p>
              </td></tr>
              <tr><td style="padding:20px 32px;border-top:1px solid #f0f0f0;">
                <p style="margin:0;color:#9ca3af;font-size:12px;">
                  Вопросы? <a href="mailto:support@myplaner.asia" style="color:#7c3aed;">support@myplaner.asia</a>
                </p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
  })
}

export async function sendPaymentErrorEmail(to: string, productName: string): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'MyPlaner <noreply@myplaner.asia>',
    to,
    subject: 'Не удалось выставить счёт — попробуйте ещё раз',
    html: `
      <!DOCTYPE html>
      <html lang="ru">
      <head><meta charset="UTF-8"/></head>
      <body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 16px;">
          <tr><td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08);">
              <tr><td style="background:#111;padding:28px 32px;">
                <span style="color:#fff;font-size:20px;font-weight:700;">MyPlaner</span>
                <span style="color:#f59e0b;font-size:20px;font-weight:700;">.</span>
              </td></tr>
              <tr><td style="padding:32px;">
                <h1 style="margin:0 0 8px;font-size:22px;color:#111;">Не удалось выставить счёт 😔</h1>
                <p style="margin:0 0 20px;color:#6b7280;font-size:15px;line-height:1.6;">
                  К сожалению, не получилось выставить счёт в Kaspi для заказа <strong style="color:#111;">${productName}</strong>.<br/>
                  Это может случиться если номер не привязан к Kaspi или временная ошибка сервиса.
                </p>
                <a href="https://myplaner.asia" style="display:inline-block;background:#111;color:#fff;font-weight:600;font-size:15px;padding:14px 28px;border-radius:10px;text-decoration:none;">
                  Попробовать снова →
                </a>
                <div style="margin-top:16px;">
                  <a href="http://wa.me/77079297008" style="display:inline-flex;align-items:center;gap:8px;background:#25D366;color:#fff;font-weight:600;font-size:15px;padding:14px 28px;border-radius:10px;text-decoration:none;">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/500px-WhatsApp.svg.png" alt="WhatsApp" width="18" height="18" style="vertical-align:middle;"/>
                    Оплатить через WhatsApp
                  </a>
                </div>
                <p style="margin:20px 0 0;color:#9ca3af;font-size:13px;">
                  Если проблема повторяется — напишите нам, разберёмся вместе.
                </p>
              </td></tr>
              <tr><td style="padding:20px 32px;border-top:1px solid #f0f0f0;">
                <p style="margin:0;color:#9ca3af;font-size:12px;">
                  <a href="mailto:support@myplaner.asia" style="color:#7c3aed;">support@myplaner.asia</a> ·
                  <a href="https://t.me/myplaner_support" style="color:#7c3aed;">Telegram</a>
                </p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
  })
}

export async function sendOrderEmail(to: string, productId: string): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const isBundle = productId === 'bundle-all'
  const product = PRODUCT_LINKS[productId]
  const subject = isBundle
    ? 'Ваши таблицы MyPlaner готовы!'
    : `Ваша таблица «${product?.name ?? 'MyPlaner'}» готова!`

  await resend.emails.send({
    from: 'MyPlaner <noreply@myplaner.asia>',
    to,
    subject,
    html: buildEmailHtml(productId),
  })
}
