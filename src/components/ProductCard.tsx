'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
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
          <svg key={star} className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none">
            <defs>
              <linearGradient id={`half-${star}-${rating}`}>
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#d1d5db" />
              </linearGradient>
            </defs>
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              fill={filled ? '#f59e0b' : half ? `url(#half-${star}-${rating})` : '#d1d5db'}
            />
          </svg>
        )
      })}
    </div>
  )
}

const productIcons: Record<string, JSX.Element> = {
  'habit-tracker': (
    <svg className="w-14 h-14 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'task-tracker': (
    <svg className="w-14 h-14 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  'budget': (
    <svg className="w-14 h-14 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  'planer-week': (
    <svg className="w-14 h-14 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  'pink-habit-tracker': (
    <svg className="w-14 h-14 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  'bundle-all': (
    <svg className="w-14 h-14 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
}

export default function ProductCard({ product, onBuy, onViewDetails }: Props) {
  const [viewers, setViewers] = useState(18)

  useEffect(() => {
    setViewers(Math.floor(Math.random() * 17) + 12)
    const id = setInterval(() => {
      setViewers(v => Math.min(28, Math.max(12, v + (Math.random() < 0.5 ? 1 : -1))))
    }, 8000)
    return () => clearInterval(id)
  }, [])

  const handleCardClick = () => {
    const eventId = uuidv4()
    const { fbp, fbc } = getFbCookies()
    pixelTrack('ViewContent', {
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: 'KZT',
    }, eventId)
    fetch('/api/capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'ViewContent', eventId,
        sourceUrl: window.location.href,
        userData: { fbp, fbc },
        customData: { content_ids: [product.id], content_type: 'product', value: product.price, currency: 'KZT' },
      }),
    })
    onViewDetails(product)
  }

  const discountPercent = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null

  return (
    <div
      onClick={handleCardClick}
      className="border border-gray-200 rounded-2xl overflow-hidden flex flex-col bg-white cursor-pointer
                 hover:shadow-xl hover:shadow-gray-200/80 hover:-translate-y-1 hover:border-gray-300
                 active:scale-[0.98] transition-all duration-200 group"
    >
      {/* Превью */}
      <div className={`bg-gradient-to-br ${product.color} h-44 flex items-center justify-center relative overflow-hidden`}>

        {product.coverUrl ? (
          /* Обложка */
          <Image
            src={product.coverUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 320px"
          />
        ) : (
          /* Иконка-заглушка */
          <div className="transition-transform duration-300 group-hover:scale-110">
            {productIcons[product.id] ?? (
              <svg className="w-14 h-14 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            )}
          </div>
        )}

        {/* Overlay при hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 text-black text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Подробнее
          </span>
        </div>

        {/* Viewers */}
        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          {viewers} смотрят
        </div>

        {/* Бейджи — только для карточек без обложки */}
        {!product.coverUrl && (
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
        )}
      </div>

      {/* Контент */}
      <div className="p-4 flex flex-col flex-1 gap-2">

        {/* Бейджи под обложкой */}
        {product.coverUrl && (product.tag || discountPercent) && (
          <div className="flex gap-1.5">
            {product.tag && (
              <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                {product.tag}
              </span>
            )}
            {discountPercent && (
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                −{discountPercent}%
              </span>
            )}
          </div>
        )}

        {/* Название + рейтинг */}
        <h3 className="font-bold text-base leading-snug">{product.name}</h3>
        <div className="flex items-center gap-1.5">
          <StarRating rating={product.rating} />
          <span className="text-sm font-semibold text-gray-800">{product.rating}</span>
          <span className="text-xs text-gray-400">({product.reviewCount.toLocaleString('ru-RU')})</span>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-2">{product.description}</p>

        {/* Цена */}
        <div className="flex items-center gap-2 mt-1">
          <span className="font-extrabold text-xl">{product.price.toLocaleString('ru-RU')} ₸</span>
          {product.oldPrice && (
            <span className="text-gray-400 text-sm line-through">{product.oldPrice.toLocaleString('ru-RU')} ₸</span>
          )}
          {discountPercent && (
            <span className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Экономия {(product.oldPrice! - product.price).toLocaleString('ru-RU')} ₸
            </span>
          )}
        </div>

        {/* Кнопка Купить — stopPropagation чтобы не открывался детал */}
        <button
          onClick={(e) => { e.stopPropagation(); onBuy(product) }}
          className="w-full mt-1 bg-black text-white text-sm font-semibold py-3 rounded-xl
                     hover:bg-gray-800 active:scale-[0.98] transition-all duration-150"
        >
          Купить за {product.price.toLocaleString('ru-RU')} ₸
        </button>
      </div>
    </div>
  )
}
