'use client'

import { Product } from '@/lib/products'
import { pixelTrack, getFbCookies } from '@/lib/pixel'
import { v4 as uuidv4 } from 'uuid'

interface Props {
  product: Product
  onBuy: (product: Product) => void
  onViewDetails: (product: Product) => void
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star
        const half = !filled && rating >= star - 0.5
        return (
          <svg
            key={star}
            className="w-3.5 h-3.5"
            viewBox="0 0 20 20"
            fill="none"
          >
            <defs>
              <linearGradient id={`half-${star}`}>
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#d1d5db" />
              </linearGradient>
            </defs>
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              fill={filled ? '#f59e0b' : half ? `url(#half-${star})` : '#d1d5db'}
            />
          </svg>
        )
      })}
    </div>
  )
}

const productIcons: Record<string, JSX.Element> = {
  'habit-tracker': (
    <svg className="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'task-tracker': (
    <svg className="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  'budget': (
    <svg className="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  'planer-week': (
    <svg className="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  'pink-habit-tracker': (
    <svg className="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  'bundle-all': (
    <svg className="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
}

export default function ProductCard({ product, onBuy, onViewDetails }: Props) {
  const handleViewContent = async () => {
    const eventId = uuidv4()
    const { fbp, fbc } = getFbCookies()

    pixelTrack('ViewContent', {
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: 'KZT',
    }, eventId)

    await fetch('/api/capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'ViewContent',
        eventId,
        sourceUrl: window.location.href,
        userData: { fbp, fbc },
        customData: {
          content_ids: [product.id],
          content_type: 'product',
          value: product.price,
          currency: 'KZT',
        },
      }),
    })
  }

  const discountPercent = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 bg-white group">
      {/* Превью */}
      <div className={`bg-gradient-to-br ${product.color} h-48 flex items-center justify-center relative`}>
        {productIcons[product.id] ?? (
          <svg className="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
        )}

        {/* Бейджи */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {product.tag && (
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/30">
              {product.tag}
            </span>
          )}
          {discountPercent && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              −{discountPercent}%
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2.5">
        <h3 className="font-semibold text-base leading-snug line-clamp-2">{product.name}</h3>

        {/* Рейтинг */}
        <div className="flex items-center gap-1.5">
          <StarRating rating={product.rating} />
          <span className="text-sm font-semibold text-gray-800">{product.rating}</span>
          <span className="text-xs text-gray-400">({product.reviewCount.toLocaleString('ru-RU')} отзывов)</span>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed flex-1">{product.description}</p>

        {/* Цена */}
        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-xl">{product.price.toLocaleString('ru-RU')} ₸</span>
          {product.oldPrice && (
            <span className="text-gray-400 text-sm line-through">
              {product.oldPrice.toLocaleString('ru-RU')} ₸
            </span>
          )}
        </div>

        {/* Кнопки */}
        <div className="flex flex-col gap-2 mt-auto">
          <button
            onClick={() => onBuy(product)}
            className="w-full bg-black text-white text-sm font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Купить
          </button>
          <button
            onClick={() => { handleViewContent(); onViewDetails(product) }}
            className="w-full border border-gray-200 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-gray-600"
          >
            Подробнее
          </button>
        </div>
      </div>
    </div>
  )
}
