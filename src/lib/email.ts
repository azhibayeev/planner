import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Ссылки «Сделать копию» для каждого продукта
const PRODUCT_LINKS: Record<string, { name: string; copyUrl: string }> = {
  'habit-tracker': {
    name: 'Трекер привычек',
    copyUrl: 'https://docs.google.com/spreadsheets/d/1_CGkd5MjE654wLTzYjXfjVaoDsVGvSw3HzxqlvpszXI/copy',
  },
  'task-tracker': {
    name: 'Трекер задач',
    copyUrl: 'https://docs.google.com/spreadsheets/d/1T3oXdlk-A5Ku2Gsm5Ix80fnUMla8UZgLy9tkfLpJMTY/copy',
  },
  'budget': {
    name: 'Финансовый планер',
    copyUrl: 'https://docs.google.com/spreadsheets/d/1dMrQHluKWOXG1LShT2prdXBzYlBNcpybSBH2zJuisfY/copy',
  },
  'planer-week': {
    name: 'Планер на неделю',
    copyUrl: 'https://docs.google.com/spreadsheets/d/1km2Qi_578NjdkdTRcKrNKBiJEi0BLvpWKVvNV0kyhow/copy',
  },
  'pink-habit-tracker': {
    name: 'Розовый трекер привычек',
    copyUrl: 'https://docs.google.com/spreadsheets/d/16V-BmFDy04NmwkZ1AR0-IRnFzEiuO-77Us3zyp_gz3Q/copy',
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

export async function sendOrderEmail(to: string, productId: string): Promise<void> {
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
