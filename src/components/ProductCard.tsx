'use client'

import { Product } from '@/lib/products'
import { pixelTrack, getFbCookies } from '@/lib/pixel'
import { v4 as uuidv4 } from 'uuid'

interface Props {
  product: Product
  onBuy: (product: Product) => void
}

export default function ProductCard({ product, onBuy }: Props) {
  const handleViewContent = async () => {
    const eventId = uuidv4()
    const { fbp, fbc } = getFbCookies()

    // Pixel (клиент)
    pixelTrack('ViewContent', {
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: 'RUB',
    }, eventId)

    // CAPI (сервер) — дедупликация по тому же eventId
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
          currency: 'RUB',
        },
      }),
    })
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden flex flex-col hover:shadow-md transition-shadow bg-white">
      {/* Изображение / превью */}
      <div className="bg-gray-100 h-48 flex items-center justify-center relative">
        <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
        {product.tag && (
          <span className="absolute top-3 left-3 bg-accent text-white text-xs font-semibold px-2 py-1 rounded-full">
            {product.tag}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <h3 className="font-semibold text-base leading-snug line-clamp-2">{product.name}</h3>
        <p className="text-gray-500 text-sm leading-relaxed flex-1">{product.description}</p>

        {/* Цена */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">{product.price.toLocaleString('ru-RU')} ₽</span>
          {product.oldPrice && (
            <span className="text-gray-400 text-sm line-through">
              {product.oldPrice.toLocaleString('ru-RU')} ₽
            </span>
          )}
        </div>

        {/* Кнопки */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onBuy(product)}
            className="flex-1 bg-black text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Купить
          </button>
          <button
            onClick={handleViewContent}
            className="flex-1 border border-gray-200 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Подробнее
          </button>
        </div>
      </div>
    </div>
  )
}
