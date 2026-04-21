'use client'

import { useState } from 'react'
import { products, Product } from '@/lib/products'
import ProductCard from './ProductCard'
import OrderModal from './OrderModal'
import ProductDetailModal from './ProductDetailModal'

export default function ProductCatalog() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [detailProduct, setDetailProduct] = useState<Product | null>(null)

  const bundle = products.find(p => p.id === 'bundle-all')!
  const rest = products.filter(p => p.id !== 'bundle-all')
  const bundleDiscount = Math.round((1 - bundle.price / bundle.oldPrice!) * 100)

  return (
    <section id="catalog" className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold mb-3">Каталог таблиц</h2>
          <p className="text-gray-500">Выбери подходящий инструмент и начни пользоваться сегодня</p>
        </div>

        {/* Bundle — featured full-width card */}
        <div
          onClick={() => setDetailProduct(bundle)}
          className="mb-8 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-px cursor-pointer group"
        >
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2 flex items-center gap-2">
              <span className="text-white text-xs font-bold uppercase tracking-widest">Лучший выбор</span>
              <span className="ml-auto bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">−{bundleDiscount}%</span>
            </div>
            <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="flex-1">
                <h3 className="font-extrabold text-xl mb-1">{bundle.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{bundle.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Трекер привычек', 'Трекер задач', 'Финансовый планер', 'Планер на неделю', 'Розовый трекер'].map(name => (
                    <span key={name} className="bg-amber-50 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full border border-amber-200">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 flex-shrink-0">
                <div className="text-right">
                  <p className="font-extrabold text-2xl">{bundle.price.toLocaleString('ru-RU')} ₸</p>
                  <p className="text-gray-400 text-sm line-through">{bundle.oldPrice!.toLocaleString('ru-RU')} ₸</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedProduct(bundle) }}
                  className="bg-black text-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all text-sm whitespace-nowrap"
                >
                  Купить за {bundle.price.toLocaleString('ru-RU')} ₸
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onBuy={(p) => setSelectedProduct(p)}
              onViewDetails={(p) => setDetailProduct(p)}
            />
          ))}
        </div>
      </div>

      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onBuy={(p) => { setDetailProduct(null); setSelectedProduct(p) }}
        />
      )}

      {selectedProduct && (
        <OrderModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  )
}
