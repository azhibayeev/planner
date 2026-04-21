'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Product, products } from '@/lib/products'
import { pixelTrack, getFbCookies } from '@/lib/pixel'
import { v4 as uuidv4 } from 'uuid'

const bundleProduct = products.find(p => p.id === 'bundle-all')!

interface Props {
  product: Product | null
  onClose: () => void
}

function Countdown() {
  const [seconds, setSeconds] = useState(10 * 60)
  useEffect(() => {
    const id = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [])
  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')
  return <>{m}:{s}</>
}

export default function OrderModal({ product: initialProduct, onClose }: Props) {
  const [product, setProduct] = useState<Product | null>(initialProduct)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    if (!product) return
    const eventId = uuidv4()
    const { fbp, fbc } = getFbCookies()
    pixelTrack('InitiateCheckout', { content_ids: [product.id], value: product.price, currency: 'KZT' }, eventId)
    fetch('/api/capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'InitiateCheckout', eventId,
        sourceUrl: window.location.href,
        userData: { fbp, fbc },
        customData: { content_ids: [product.id], value: product.price, currency: 'KZT' },
      }),
    })
  }, [product])

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return
    setLoading(true)
    setError('')
    const { fbp, fbc } = getFbCookies()

    const addPaymentEventId = uuidv4()
    pixelTrack('AddPaymentInfo', { content_ids: [product.id], value: product.price, currency: 'KZT' }, addPaymentEventId)
    fetch('/api/capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'AddPaymentInfo', eventId: addPaymentEventId,
        sourceUrl: window.location.href,
        userData: { email, fbp, fbc },
        customData: { content_ids: [product.id], value: product.price, currency: 'KZT' },
      }),
    })

    const eventId = uuidv4()
    pixelTrack('Lead', { content_ids: [product.id], value: product.price, currency: 'KZT' }, eventId)
    fetch('/api/capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'Lead', eventId,
        sourceUrl: window.location.href,
        userData: { email, fbp, fbc },
        customData: { content_ids: [product.id], value: product.price, currency: 'KZT' },
      }),
    })

    localStorage.setItem('last_order', JSON.stringify({
      value: product.price,
      currency: 'KZT',
      content_ids: [product.id],
    }))

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email, phone,
          amount: product.price,
          product_id: product.id,
          items: [{ name: product.name, price: product.price, quantity: 1 }],
        }),
      })
      const data = await response.json()
      if (data.success) {
        setSent(true)
      } else {
        setError(data.error || 'Ошибка при создании заказа. Попробуйте ещё раз.')
      }
    } catch {
      setError('Произошла ошибка. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  if (!product) return null

  if (sent) return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md p-8 shadow-2xl text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold mb-2">Счёт выставлен!</h2>
        <p className="text-gray-600 text-sm mb-4">
          Откройте приложение <strong>Kaspi</strong> на вашем телефоне и подтвердите оплату во вкладке «Платежи».
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-left">
          <p className="text-amber-800 text-sm font-semibold mb-0.5">📧 Доступ придёт на почту</p>
          <p className="text-amber-700 text-xs">
            Сразу после оплаты мы автоматически отправим ссылку на <strong>{email}</strong>. Проверьте папку «Спам», если письмо не пришло в течение 5 минут.
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors mb-3"
        >
          Понятно
        </button>
        <p className="text-xs text-gray-400">
          Возникли проблемы?{' '}
          <a href="https://t.me/myplaner_support" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            Напишите нам в Telegram
          </a>
        </p>
      </div>
    </div>
  )

  const savings = product.oldPrice ? product.oldPrice - product.price : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl relative flex flex-col max-h-[95vh]">

        {/* Шапка */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold">Корзина <span className="text-gray-400 font-normal">• 1 товар</span></h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Таймер */}
        <div className="bg-[#1a2235] text-white text-center text-sm font-semibold py-2.5 px-4">
          Заказ зарезервирован на <Countdown />
        </div>

        {/* Скроллируемый контент */}
        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4">

          {/* Карточка товара */}
          <div className="flex gap-3 items-start py-3 border-b border-gray-100">
            {/* Превью */}
            <div className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br ${product.color}`}>
              {product.coverUrl ? (
                <Image src={product.coverUrl} alt={product.name} fill className="object-cover" sizes="64px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                </div>
              )}
            </div>

            {/* Инфо */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-snug">{product.name}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-bold text-base">{product.price.toLocaleString('ru-RU')} ₸</span>
                {product.oldPrice && (
                  <span className="text-gray-400 text-xs line-through">{product.oldPrice.toLocaleString('ru-RU')} ₸</span>
                )}
              </div>
              {savings && (
                <p className="text-emerald-600 text-xs font-medium mt-0.5">
                  Экономия {savings.toLocaleString('ru-RU')} ₸
                </p>
              )}
            </div>
          </div>

          {/* Upsell */}
          {product.id !== 'bundle-all' && (
            <button
              type="button"
              onClick={() => setProduct(bundleProduct)}
              className="w-full bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 text-left hover:bg-amber-100 transition-colors"
            >
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-0.5">🔥 Выгоднее всего</p>
              <p className="text-sm font-semibold text-gray-900">
                Все 5 таблиц за 6 000 ₸{' '}
                <span className="text-gray-400 line-through font-normal text-xs">12 500 ₸</span>
              </p>
              <p className="text-xs text-amber-700 mt-0.5">Экономия 6 500 ₸ — нажми чтобы выбрать</p>
            </button>
          )}

          {/* Форма */}
          <form onSubmit={handleCheckout} className="flex flex-col gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Email <span className="text-amber-600 font-normal">— сюда придёт доступ</span>
              </label>
              <input
                type="email"
                placeholder="ivan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                inputMode="email"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">Ссылка на таблицу придёт автоматически после оплаты</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Номер телефона</label>
              <input
                type="tel"
                placeholder="+7 700 000 00 00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                autoComplete="tel"
                inputMode="tel"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">
                На этот номер выставим счёт в <span className="font-semibold text-gray-600">Kaspi</span>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 rounded-xl px-4 py-3">
                <p className="text-red-500 text-sm">{error}</p>
                <p className="text-xs text-red-400 mt-1">
                  Нужна помощь?{' '}
                  <a href="https://t.me/myplaner_support" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-600">
                    Напишите в Telegram
                  </a>
                </p>
              </div>
            )}

            {/* Итого */}
            <div className="border-t border-gray-100 pt-3 flex flex-col gap-1">
              {savings && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Скидка</span>
                  <span className="text-emerald-600 font-medium">−{savings.toLocaleString('ru-RU')} ₸</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-bold text-base">Итого</span>
                <span className="font-bold text-base">{product.price.toLocaleString('ru-RU')} ₸</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a2235] text-white font-semibold py-3.5 rounded-xl hover:bg-[#111827] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Переходим к оплате...
                </>
              ) : (
                'Перейти к оплате'
              )}
            </button>

            {/* Иконки оплаты */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://fund2.kz/wp-content/uploads/2022/02/content_%D0%BA%D0%B0%D1%81%D0%BF%D0%B8.png" alt="Kaspi" className="h-5 object-contain" />
              <div className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs text-gray-400">Безопасная оплата</span>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 -mt-1">
              Нажимая «Перейти к оплате», вы соглашаетесь с{' '}
              <a href="/privacy" className="underline hover:text-black">политикой конфиденциальности</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
