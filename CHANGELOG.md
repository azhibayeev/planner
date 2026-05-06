# Changelog

## 2026-05-05 / 2026-05-06 — большой апдейт

### UX / Conversion

- Прямой Buy CTA в Hero и Sticky-кнопке вместо «Смотреть каталог»
- Удалены 4 fake-urgency механизма (countdown, viewers, toast, reservation timer)
- Новый H1 «5 готовых Google Таблиц / для привычек, задач и финансов»
- ProductCard: разделены клик по обложке (детали) и кнопка «Купить»
- OrderModal: убраны дубли цен, добавлен зелёный «Гарантия возврата 7 дней»
- WhatsApp как полноценный альтернативный путь оплаты в OrderModal
- Skeleton loaders для изображений
- Прибит `−53%` бейдж к углу CTA (раньше висел отдельной строкой на мобайле)
- Реальные фото покупателей в секции Reviews (3 шт. в одной строке, 3:4 аспект)
- Lightbox при клике на фото отзыва
- Обложки товаров: PNG/JPG → WebP, 17 MB → 700 KB

### Tracking

- Pixel/CAPI обновлены на новый ID `1973265446896964`
- Tracking helper `trackEvent()` — одной функцией Pixel + CAPI с общим event_id
- Починен дубль InitiateCheckout (React Strict Mode useEffect двойной fire)
- Починен дубль Purchase (webhook eventId vs client UUID — теперь одинаковый order_id)

### Security / Operations

- Webhook `/api/webhooks/apipay` верифицирует через GET к APIPAY API
- Rate limit на `/api/checkout` (5/IP, 3/phone, 10-мин окно)
- HSTS + X-Frame-Options + Permissions-Policy headers
- SSH password auth выключен на сервере, только по ключу
- PM2 ecosystem config (memory limit 512M, crash-loop guard, log rotation)
- CI typecheck (`tsc --noEmit`) перед каждым деплоем
- Зашифрованный бэкап `.env.local` (AES-256-CBC + PBKDF2)
- Health check endpoint `/api/health` (Supabase + env проверки)
- Cleanup тестовых заказов в Supabase (53 → 14)

### Admin

- `/admin/orders` страница с фильтрами и статистикой
- HTTP Basic Auth через Edge middleware (timing-safe compare)
- Кнопка «Возврат» для оплаченных заказов

### SEO

- Schema.org Product + AggregateRating (звёздочки в выдаче Google)
- Динамический OG image через `next/og` (1200×630 PNG)
- Twitter Card auto-attached

### Deps

- Next.js 14.2.5 → 14.2.35 (5 CVE починены)
