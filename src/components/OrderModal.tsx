'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/lib/products'
import { pixelTrack, getFbCookies } from '@/lib/pixel'
import { v4 as uuidv4 } from 'uuid'

interface Props {
  product: Product | null
  onClose: () => void
}

export default function OrderModal({ product, onClose }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  // InitiateCheckout при открытии
  useEffect(() => {
    if (!product) return
    const eventId = uuidv4()
    const { fbp, fbc } = getFbCookies()

    pixelTrack('InitiateCheckout', {
      content_ids: [product.id],
      value: product.price,
      currency: 'KZT',
    }, eventId)

    fetch('/api/capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'InitiateCheckout',
        eventId,
        sourceUrl: window.location.href,
        userData: { fbp, fbc },
        customData: {
          content_ids: [product.id],
          value: product.price,
          currency: 'KZT',
        },
      }),
    })
  }, [product])

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    setLoading(true)
    setError('')

    // Pixel + CAPI Lead
    const eventId = uuidv4()
    const { fbp, fbc } = getFbCookies()

    pixelTrack('Lead', {
      content_ids: [product.id],
      value: product.price,
      currency: 'KZT',
    }, eventId)

    fetch('/api/capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'Lead',
        eventId,
        sourceUrl: window.location.href,
        userData: { email, name, fbp, fbc },
        customData: {
          content_ids: [product.id],
          value: product.price,
          currency: 'KZT',
        },
      }),
    })

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone,
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
    } catch (err) {
      console.error('Checkout error:', err)
      setError('Произошла ошибка. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  if (!product) return null

  if (sent) return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl text-center">
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
          <a
            href="https://t.me/myplanner_support"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Напишите нам в Telegram
          </a>
        </p>
      </div>
    </div>
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-bold mb-1">Оформление заказа</h2>
        <p className="text-gray-500 text-sm mb-5">{product.name}</p>

        <div className="bg-gray-50 rounded-xl p-4 mb-5 flex justify-between items-center">
          <span className="text-sm text-gray-600">Итого к оплате:</span>
          <span className="font-bold text-lg">{product.price.toLocaleString('ru-RU')} ₸</span>
        </div>

        <form onSubmit={handleCheckout} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Ваше имя</label>
            <input
              type="text"
              placeholder="Иван Иванов"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Email{' '}
              <span className="text-amber-600 font-normal">— сюда придёт доступ</span>
            </label>
            <input
              type="email"
              placeholder="ivan@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Ссылка на таблицу придёт автоматически сразу после оплаты
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Номер телефона</label>
            <input
              type="tel"
              placeholder="+7 700 000 00 00"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {error && (
            <div className="bg-red-50 rounded-xl px-4 py-3">
              <p className="text-red-500 text-sm">{error}</p>
              <p className="text-xs text-red-400 mt-1">
                Нужна помощь?{' '}
                <a
                  href="https://t.me/myplanner_support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-red-600"
                >
                  Напишите в Telegram
                </a>
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              'Оплатить'
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            Нажимая «Оплатить», вы соглашаетесь с{' '}
            <a href="/privacy" className="underline hover:text-black">политикой конфиденциальности</a>
          </p>
        </form>
      </div>
    </div>
  )
}
