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
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Отправляем InitiateCheckout при открытии модалки
  useEffect(() => {
    if (!product) return
    const eventId = uuidv4()
    const { fbp, fbc } = getFbCookies()

    pixelTrack('InitiateCheckout', {
      content_ids: [product.id],
      value: product.price,
      currency: 'RUB',
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
          currency: 'RUB',
        },
      }),
    })
  }, [product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return
    setLoading(true)
    setError('')

    const eventId = uuidv4()
    const { fbp, fbc } = getFbCookies()

    // Pixel — Lead
    pixelTrack('Lead', {
      content_ids: [product.id],
      value: product.price,
      currency: 'RUB',
    }, eventId)

    // CAPI — Lead с хешированными данными пользователя
    await fetch('/api/capi', {
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
          currency: 'RUB',
        },
      }),
    })

    // Здесь можно добавить реальную обработку заказа (API, email и т.д.)
    await new Promise((r) => setTimeout(r, 600))

    setLoading(false)
    setSuccess(true)
  }

  if (!product) return null

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

        {success ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Заказ принят!</h3>
            <p className="text-gray-500 text-sm">
              Ссылка на таблицу придёт на <strong>{email}</strong> в течение нескольких минут.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-1">Оформление заказа</h2>
            <p className="text-gray-500 text-sm mb-5">{product.name}</p>

            <div className="bg-gray-50 rounded-xl p-4 mb-5 flex justify-between items-center">
              <span className="text-sm text-gray-600">Итого к оплате:</span>
              <span className="font-bold text-lg">{product.price.toLocaleString('ru-RU')} ₽</span>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="ivan@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              {error && (
                <p className="text-accent text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Отправляем...' : 'Оформить заказ'}
              </button>

              <p className="text-center text-xs text-gray-400">
                Нажимая «Оформить заказ», вы соглашаетесь с{' '}
                <a href="/privacy" className="underline hover:text-black">политикой конфиденциальности</a>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
