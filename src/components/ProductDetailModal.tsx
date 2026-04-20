'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Product } from '@/lib/products'

interface Props {
  product: Product
  onClose: () => void
  onBuy: (product: Product) => void
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className="w-4 h-4" viewBox="0 0 20 20">
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            fill={rating >= star ? '#f59e0b' : '#e5e7eb'}
          />
        </svg>
      ))}
    </div>
  )
}

export default function ProductDetailModal({ product, onClose, onBuy }: Props) {
  const [slide, setSlide] = useState(0)
  const screenshots = product.screenshots ?? []

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setSlide(s => (s + 1) % screenshots.length)
      if (e.key === 'ArrowLeft') setSlide(s => (s - 1 + screenshots.length) % screenshots.length)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, screenshots.length])

  const discountPercent = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null

  const prev = () => setSlide(s => (s - 1 + screenshots.length) % screenshots.length)
  const next = () => setSlide(s => (s + 1) % screenshots.length)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-5xl max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

        {/* Шапка */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            {product.tag && (
              <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                {product.tag}
              </span>
            )}
            <h2 className="font-bold text-base sm:text-lg leading-tight">{product.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black transition-colors p-1 flex-shrink-0 ml-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Основной контент */}
        <div className="flex flex-col lg:flex-row flex-1 min-h-0">

          {/* Слайдер */}
          <div className={`flex-1 relative min-h-[260px] sm:min-h-[360px] lg:min-h-0 overflow-hidden bg-gradient-to-br ${product.color}`}>
            {screenshots.length > 0 ? (
              <>
                {/* Картинка */}
                <div className="relative w-full h-full min-h-[260px] sm:min-h-[360px] lg:min-h-0">
                  <Image
                    key={slide}
                    src={screenshots[slide]}
                    alt={`${product.name} — скриншот ${slide + 1}`}
                    fill
                    priority={slide === 0}
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 65vw"
                  />
                </div>

                {/* Стрелки (только если > 1 скриншота) */}
                {screenshots.length > 1 && (
                  <>
                    <button
                      onClick={prev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={next}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Точки */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {screenshots.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setSlide(i)}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${i === slide ? 'bg-white w-4' : 'bg-white/40'}`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Счётчик */}
                {screenshots.length > 1 && (
                  <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    {slide + 1} / {screenshots.length}
                  </div>
                )}
              </>
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${product.color} flex items-center justify-center`}>
                <p className="text-white/60 text-sm">Предпросмотр скоро появится</p>
              </div>
            )}
          </div>

          {/* Правая панель */}
          <div className="lg:w-72 xl:w-80 flex flex-col gap-4 p-5 border-t lg:border-t-0 lg:border-l border-gray-100 flex-shrink-0 overflow-y-auto">

            {/* Рейтинг */}
            <div className="flex items-center gap-2">
              <StarRating rating={product.rating} />
              <span className="font-semibold text-sm">{product.rating}</span>
              <span className="text-gray-400 text-xs">({product.reviewCount.toLocaleString('ru-RU')} отзывов)</span>
            </div>

            {/* Описание */}
            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>

            {/* Что внутри */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Что внутри</p>
              <ul className="flex flex-col gap-1.5">
                {getFeatures(product.id).map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Цена и кнопка */}
            <div className="mt-auto flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-2xl">{product.price.toLocaleString('ru-RU')} ₸</span>
                {product.oldPrice && (
                  <span className="text-gray-400 text-base line-through">{product.oldPrice.toLocaleString('ru-RU')} ₸</span>
                )}
                {discountPercent && (
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">−{discountPercent}%</span>
                )}
              </div>

              <button
                onClick={() => { onClose(); onBuy(product) }}
                className="w-full bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors"
              >
                Купить сейчас
              </button>

              <p className="text-center text-xs text-gray-400">
                Доступ навсегда · Без подписки
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getFeatures(id: string): string[] {
  const map: Record<string, string[]> = {
    'habit-tracker': [
      'Ежедневный чекбокс-трекер',
      'Полоса серий (streak)',
      'Анализ прогресса по каждому месяцу',
      'Мотивационная система',
    ],
    'task-tracker': [
      'Задачи с приоритетами и статусами',
      'Обзор всех задач и дедлайнов',
      'Фильтрация по категориям',
      'Еженедельный вид задач',
    ],
    'budget': [
      'Учёт доходов и расходов',
      'Категории трат с графиками',
      'Анализ за месяц и год',
      'Автоматические итоги',
    ],
    'planer-week': [
      'Планирование задач на 7 дней',
      'Цели и приоритеты на неделю',
      'Автоматическая сводка',
      'Простой и понятный интерфейс',
    ],
    'pink-habit-tracker': [
      'Стильный дизайн в розовых тонах',
      'Ежедневный трекер привычек',
      'Полоса серий и прогресс',
      'Мотивационные цитаты',
    ],
  }
  return map[id] ?? []
}
