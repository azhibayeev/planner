# Planer.Shop

Клон planer-plan.ru на Next.js + Meta Conversions API.

## Запуск

```bash
npm install
npm run dev
```

Открой: http://localhost:3000

## Переменные окружения

Скопируй `.env.local.example` → `.env.local` и заполни:

| Переменная | Описание |
|---|---|
| `NEXT_PUBLIC_PIXEL_ID` | Pixel / Dataset ID (публичный, идёт в браузер) |
| `META_DATASET_ID` | Тот же Dataset ID (для серверного CAPI) |
| `META_ACCESS_TOKEN` | System User Token (никогда не светить!) |
| `META_TEST_EVENT_CODE` | Код тест-событий — убери в продакшене |

## CAPI: как работает дедупликация

```
Пользователь → кнопка "Купить"
       ↓
  Браузер: fbq('track', 'Lead', data, { eventID: 'uuid' })  ← Pixel
       ↓
  fetch('/api/capi', { eventId: 'uuid', ... })              ← Server → Meta
```

Meta получает два события с одинаковым `event_id` → засчитывает одно.

## События Meta

| Действие | Pixel | CAPI |
|---|---|---|
| Загрузка страницы | PageView (авто) | — |
| Клик «Подробнее» | ViewContent | ViewContent |
| Открытие корзины | InitiateCheckout | InitiateCheckout |
| Отправка формы | Lead | Lead (+ email/имя захешированы) |

## Деплой на Vercel

1. `vercel --prod`
2. В настройках проекта добавь все переменные из `.env.local`
3. Удали `META_TEST_EVENT_CODE` — события начнут считаться в рекламном кабинете
