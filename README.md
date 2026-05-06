# Planer.Shop

Интернет-магазин готовых Google Таблиц для продуктивности (привычки, задачи, финансы, планер недели). Next.js 14, продакшен на VPS под `myplaner.asia`.

## Локальный запуск

```bash
npm install
cp .env.local.example .env.local  # заполнить значения
npm run dev
```

Откройте http://localhost:3000

## Переменные окружения

Полный список — в `.env.local.example`. Главные:

| Переменная | Описание |
|---|---|
| `NEXT_PUBLIC_PIXEL_ID` | Meta Pixel ID (попадает в браузер) |
| `META_DATASET_ID` | Тот же ID, для серверного CAPI |
| `META_ACCESS_TOKEN` | System User Token Meta — секрет |
| `META_TEST_EVENT_CODE` | Опциональный код Test Events — **убрать на проде** |
| `NEXT_PUBLIC_SUPABASE_URL` | URL проекта Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (секрет) |
| `APIPAY_API_KEY` | API key APIPAY.kz для Kaspi-платежей |
| `RESEND_API_KEY` | Resend API key для писем с таблицами |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Basic Auth для `/admin/*` |

## Архитектура

```
Покупатель → Hero/Catalog → OrderModal (форма)
              → /api/checkout                 ← создаёт Kaspi-счёт через APIPAY
              → APIPAY дашборд webhook → /api/webhooks/apipay
                                          ↓
                                    верификация через GET /api/invoices/{id}
                                          ↓
                          обновление Supabase + Meta CAPI Purchase + Resend email
```

## Подсистемы

### Tracking (Meta Pixel + CAPI)

Каждое конверсионное событие отправляется **дважды** с одним `event_id` для дедупликации:

```
fbq('track', 'Lead', data, { eventID: 'uuid' })  ← клиент
fetch('/api/capi', { eventId: 'uuid', ... })     ← сервер
```

Helper в `src/lib/tracking.ts` — `trackEvent({...})` делает оба вызова разом.

| Событие | Триггер |
|---|---|
| `PageView` | Загрузка страницы (Pixel auto-fire) |
| `ViewContent` | Клик по карточке товара |
| `InitiateCheckout` | Открытие OrderModal |
| `AddPaymentInfo` | Успешное создание Kaspi-счёта |
| `Lead` | Успешное создание Kaspi-счёта |
| `Purchase` | Webhook от APIPAY с `status:paid` |
| `PaymentFailed` | Webhook с `status:error` |

### Webhook security

APIPAY на этом аккаунте **не подписывает** webhooks через `X-Webhook-Signature` (хотя по докам должно быть). Вместо HMAC верификации используется **server-to-server проверка**:

1. Webhook приходит на `/api/webhooks/apipay`
2. Из payload берём `invoice.id`
3. Вызываем `GET https://bpapi.bazarbay.site/api/invoices/{id}` с нашим API key
4. Сравниваем `status` и `external_order_id` с тем что в webhook
5. Если совпало — обрабатываем, иначе 401

Атакующий не может подделать ответ APIPAY без нашего API key.

### Rate limiting

`/api/checkout` ограничен через in-memory sliding window:
- 5 попыток с одного IP за 10 минут
- 3 попытки на один телефон за 10 минут

Реализация: `src/lib/rateLimit.ts`. Single-instance PM2 — shared store не нужен.

### Admin panel

`/admin/orders` — таблица заказов с фильтрами (статус, период, поиск), статистикой и кнопкой возврата для оплаченных. Защищён HTTP Basic Auth через `src/middleware.ts`.

`/api/admin/refund` — POST с `order_id`, помечает как `refunded`. Под тем же middleware.

### Health check

`GET /api/health` возвращает 200 healthy / 503 degraded. Проверяет:
- доступность Supabase
- наличие всех критичных env vars
- uptime процесса

Подходит для UptimeRobot и подобных мониторов.

## Деплой

GitHub Actions (`.github/workflows/deploy.yml`):
1. Push в `main` → CI запускает `tsc --noEmit`
2. Если прошло — SSH на VPS, запускает `/usr/local/bin/deploy-planer.sh`
3. Скрипт делает `git pull + npm ci + npm run build + pm2 startOrReload ecosystem.config.js`

PM2 конфиг — `ecosystem.config.js` (memory limit 512MB, crash-loop guard, log rotation).

## Безопасность

- ✅ HTTP Basic Auth для админки (timing-safe сравнение)
- ✅ Webhook верификация через APIPAY API
- ✅ Rate limiting на checkout
- ✅ HSTS / X-Frame-Options / Permissions-Policy headers (`next.config.js`)
- ✅ SSH только по ключу (`PasswordAuthentication no`)
- ✅ `.env.local` в .gitignore, на сервере отдельно

## Что в каталоге

```
src/
├─ app/
│  ├─ page.tsx                 ← главная (Hero, Catalog, Reviews, FAQ...)
│  ├─ opengraph-image.tsx      ← динамический OG image
│  ├─ admin/orders/            ← админ-панель
│  └─ api/
│     ├─ capi/                 ← /api/capi
│     ├─ checkout/             ← создание Kaspi-счёта
│     ├─ health/               ← health check
│     ├─ admin/refund/         ← возврат заказа
│     └─ webhooks/apipay/      ← обработка платёжных событий
├─ components/
│  ├─ Hero.tsx, ProductCard.tsx, OrderModal.tsx, ...
│  ├─ ui/                      ← Button, Badge, Price, TrustBadges, ImageSkeleton
│  └─ CheckoutContext.tsx      ← модалки checkout/detail общим стейтом
├─ lib/
│  ├─ tracking.ts              ← unified Pixel+CAPI helper
│  ├─ capi.ts                  ← server CAPI sender
│  ├─ products.ts              ← каталог
│  ├─ rateLimit.ts             ← in-memory limiter
│  ├─ orderHelpers.ts          ← статусы/форматирование заказов
│  ├─ supabase.ts, email.ts    ← интеграции
└─ middleware.ts               ← Basic Auth для /admin
```

## Скрипты

```bash
npm run dev          # dev server
npm run build        # production build
npm run start        # run built (используется PM2 в проде)
npx tsc --noEmit     # typecheck (тот же что в CI)
```

## Бэкап и восстановление

`.env.local` бэкапится зашифрованным архивом в `~/Documents/myplaner-backups/`. Восстановление:

```bash
echo -n 'PASSPHRASE' | openssl enc -aes-256-cbc -d -pbkdf2 -iter 100000 \
  -in myplaner-env-*.tar.gz.enc -pass stdin | tar -xz
```

Положить `.env.local.prod` в `/var/www/planner/.env.local` на сервере, перезапустить PM2.
