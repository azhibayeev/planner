'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Product, products } from '@/lib/products'
import { trackEvent } from '@/lib/tracking'
import Button from './ui/Button'
import Price from './ui/Price'
import TrustBadges, { GuaranteeBadge } from './ui/TrustBadges'

const bundleProduct = products.find(p => p.id === 'bundle-all')!

interface Props {
  product: Product | null
  onClose: () => void
}

export default function OrderModal({ product: initialProduct, onClose }: Props) {
  const [product, setProduct] = useState<Product | null>(initialProduct)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const submittingRef = useRef(false)
  // Защита от двойного fire в React Strict Mode (dev). На проде useEffect
  // и так вызывается один раз, ref здесь не мешает.
  const initiateFiredFor = useRef<string | null>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    if (!initialProduct) return
    if (initiateFiredFor.current === initialProduct.id) return
    initiateFiredFor.current = initialProduct.id
    trackEvent({
      eventName: 'InitiateCheckout',
      contentIds: [initialProduct.id],
      value: initialProduct.price,
      currency: 'KZT',
    })
  }, [initialProduct])

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product || submittingRef.current) return
    submittingRef.current = true
    setLoading(true)
    setError('')

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
        // Сохраняем orderId — PurchaseTracker на /success использует его как event_id
        // для дедупликации с серверным Purchase из webhook.
        localStorage.setItem('last_order', JSON.stringify({
          value: product.price,
          currency: 'KZT',
          content_ids: [product.id],
          order_id: data.orderId,
        }))
        // CAPI события отправляем только после подтверждённого создания заказа
        // чтобы избежать дублей при повторных попытках после ошибки
        trackEvent({
          eventName: 'AddPaymentInfo',
          contentIds: [product.id],
          value: product.price,
          currency: 'KZT',
          email,
        })
        trackEvent({
          eventName: 'Lead',
          contentIds: [product.id],
          value: product.price,
          currency: 'KZT',
          email,
        })
        setSent(true)
      } else {
        setError(data.error || 'Ошибка при создании заказа. Попробуйте ещё раз.')
      }
    } catch {
      setError('Произошла ошибка. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
      submittingRef.current = false
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
        <p className="text-ink-muted text-sm mb-4">
          Откройте приложение <strong>Kaspi</strong> на вашем телефоне и подтвердите оплату во вкладке «Платежи».
        </p>
        <div className="bg-accent-soft border border-accent/30 rounded-xl px-4 py-3 mb-6 text-left">
          <p className="text-accent-hover text-sm font-semibold mb-0.5">📧 Доступ придёт на почту</p>
          <p className="text-amber-700 text-xs">
            Сразу после оплаты мы автоматически отправим ссылку на <strong>{email}</strong>. Проверьте папку «Спам», если письмо не пришло в течение 5 минут.
          </p>
        </div>
        <Button variant="primary" onClick={onClose} className="w-full mb-3">
          Понятно
        </Button>
        <p className="text-xs text-ink-soft">
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
          <h2 className="text-xl font-bold">Оформление <span className="text-ink-soft font-normal">· 1 товар</span></h2>
          <button onClick={onClose} aria-label="Закрыть" className="text-ink-soft hover:text-ink transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Скроллируемый контент */}
        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4">

          {/* Карточка товара */}
          <div className="flex gap-3 items-start py-3 border-b border-gray-100">
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

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-snug">{product.name}</p>
              <Price price={product.price} oldPrice={product.oldPrice} size="sm" className="mt-1" />
            </div>
          </div>

          {/* Upsell на bundle */}
          {product.id !== 'bundle-all' && (
            <button
              type="button"
              onClick={() => setProduct(bundleProduct)}
              className="w-full bg-accent-soft border border-accent/40 rounded-xl px-3.5 py-2.5 flex items-center justify-between hover:bg-accent-soft/80 transition-colors"
            >
              <span className="text-sm font-semibold text-ink">
                🔥 Все 5 таблиц — 6 990 ₸{' '}
                <span className="text-ink-soft line-through font-normal text-xs">14 990 ₸</span>
              </span>
              <svg className="w-4 h-4 text-accent-hover flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Форма */}
          <form onSubmit={handleCheckout} className="flex flex-col gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Email <span className="text-accent-hover font-normal text-xs">— сюда придёт доступ</span>
              </label>
              <input
                type="email"
                placeholder="ivan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                inputMode="email"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Телефон <span className="text-ink-soft font-normal text-xs">— счёт придёт в Kaspi</span>
              </label>
              <input
                type="tel"
                placeholder="+7 700 000 00 00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                autoComplete="tel"
                inputMode="tel"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 rounded-xl px-4 py-3">
                <p className="text-red-500 text-sm">{error}</p>
                <a
                  href="http://wa.me/77079297008"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#1ebe5d] transition-colors w-full justify-center"
                >
                  <Image src="/icons/whatsapp.png" alt="WhatsApp" width={16} height={16} />
                  Оплатить через WhatsApp
                </a>
              </div>
            )}

            {/* Итого */}
            <div className="border-t border-gray-100 pt-3 flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="font-bold text-base">Итого</span>
                <span className="font-bold text-base">{product.price.toLocaleString('ru-RU')} ₸</span>
              </div>
            </div>

            {/* Гарантия */}
            <GuaranteeBadge />

            <Button type="submit" loading={loading} size="lg" className="w-full">
              {loading ? 'Создаём счёт...' : `Оплатить через Kaspi · ${product.price.toLocaleString('ru-RU')} ₸`}
            </Button>

            {/* Альтернативный путь — для тех, у кого нет Kaspi */}
            <div className="flex items-center gap-3 text-xs text-ink-soft my-1">
              <span className="flex-1 h-px bg-gray-200" />
              <span>нет Kaspi?</span>
              <span className="flex-1 h-px bg-gray-200" />
            </div>
            <a
              href={`http://wa.me/77079297008?text=${encodeURIComponent(`Здравствуйте! Хочу оформить «${product.name}» за ${product.price.toLocaleString('ru-RU')} ₸. Подскажите, как оплатить.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] active:scale-[0.98] text-white font-semibold py-3 rounded-xl transition-all"
            >
              <Image src="/icons/whatsapp.png" alt="" width={18} height={18} aria-hidden="true" />
              Связаться через WhatsApp
            </a>

            <TrustBadges />
          </form>
        </div>
      </div>
    </div>
  )
}
