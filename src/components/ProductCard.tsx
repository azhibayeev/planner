'use client'

import { Product } from '@/lib/products'
import { trackEvent } from '@/lib/tracking'
import Button from './ui/Button'
import Badge from './ui/Badge'
import Price, { discountPercent } from './ui/Price'
import ImageWithSkeleton from './ui/ImageSkeleton'

interface Props {
  product: Product
  onBuy: (product: Product) => void
  onViewDetails: (product: Product) => void
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Оценка ${rating} из 5`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star
        const half = !filled && rating >= star - 0.5
        return (
          <svg key={star} className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
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
  const off = discountPercent(product.price, product.oldPrice)

  const trackView = () => {
    trackEvent({
      eventName: 'ViewContent',
      contentIds: [product.id],
      contentType: 'product',
      value: product.price,
      currency: 'KZT',
    })
  }

  const handleCoverClick = () => {
    trackView()
    onViewDetails(product)
  }

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    trackView()
    onBuy(product)
  }

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden flex flex-col bg-white hover:shadow-xl hover:shadow-gray-200/80 hover:-translate-y-1 hover:border-gray-300 transition-all duration-200 group">

      {/* Превью — кликабельно для деталей */}
      <button
        type="button"
        onClick={handleCoverClick}
        className={`bg-gradient-to-br ${product.color} h-44 flex items-center justify-center relative overflow-hidden cursor-pointer w-full`}
        aria-label={`Подробнее о товаре ${product.name}`}
      >
        {product.coverUrl ? (
          <ImageWithSkeleton
            src={product.coverUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 320px"
          />
        ) : (
          <div className="transition-transform duration-300 group-hover:scale-110">
            {productIcons[product.id] ?? (
              <svg className="w-14 h-14 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            )}
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 text-black text-xs font-semibold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Подробнее
          </span>
        </div>

        {/* Бейджи на обложках без cover */}
        {!product.coverUrl && (
          <div className="absolute top-3 left-3 flex gap-1.5">
            {product.tag && <Badge tone="overlay">{product.tag}</Badge>}
            {off && <Badge tone="danger">−{off}%</Badge>}
          </div>
        )}
      </button>

      {/* Контент */}
      <div className="p-4 flex flex-col flex-1 gap-2">

        {product.coverUrl && (product.tag || off) && (
          <div className="flex gap-1.5">
            {product.tag && <Badge>{product.tag}</Badge>}
            {off && <Badge tone="danger">−{off}%</Badge>}
          </div>
        )}

        <h3 className="font-bold text-base leading-snug">{product.name}</h3>
        <div className="flex items-center gap-1.5">
          <StarRating rating={product.rating} />
          <span className="text-sm font-semibold text-ink">{product.rating}</span>
          <span className="text-xs text-ink-soft">({product.reviewCount.toLocaleString('ru-RU')})</span>
        </div>

        <p className="text-ink-muted text-sm leading-relaxed flex-1 line-clamp-2">{product.description}</p>

        <Price price={product.price} oldPrice={product.oldPrice} size="md" showSavings className="mt-1" />

        <Button onClick={handleBuyClick} className="mt-2">
          Купить за {product.price.toLocaleString('ru-RU')} ₸
        </Button>
        <button
          type="button"
          onClick={handleCoverClick}
          className="text-xs text-ink-muted hover:text-ink transition-colors py-1"
        >
          Подробнее →
        </button>
      </div>
    </div>
  )
}
