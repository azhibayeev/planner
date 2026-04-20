'use client'

import { useState } from 'react'
import { products, Product } from '@/lib/products'
import ProductCard from './ProductCard'
import OrderModal from './OrderModal'
import ProductDetailModal from './ProductDetailModal'

export default function ProductCatalog() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [detailProduct, setDetailProduct] = useState<Product | null>(null)

  return (
    <section id="catalog" className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold mb-3">Каталог таблиц</h2>
          <p className="text-gray-500">Выбери подходящий инструмент и начни пользоваться сегодня</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
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
