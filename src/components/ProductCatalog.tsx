'use client'

import { products } from '@/lib/products'
import ProductCard from './ProductCard'
import Button from './ui/Button'
import Badge from './ui/Badge'
import { discountPercent } from './ui/Price'
import { useCheckout } from './CheckoutContext'

export default function ProductCatalog() {
  const { openCheckout, openDetail } = useCheckout()

  const bundle = products.find(p => p.id === 'bundle-all')!
  const rest = products.filter(p => p.id !== 'bundle-all')
  const off = discountPercent(bundle.price, bundle.oldPrice)

  return (
    <section id="catalog" className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold mb-3">Каталог таблиц</h2>
          <p className="text-ink-muted">Выбери подходящий инструмент и начни пользоваться сегодня</p>
        </div>

        {/* Bundle — featured full-width card */}
        <div
          onClick={() => openDetail(bundle)}
          className="mb-8 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-px cursor-pointer group"
        >
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2 flex items-center gap-2">
              <span className="text-white text-xs font-bold uppercase tracking-widest">Лучший выбор</span>
              {off && (
                <span className="ml-auto bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">−{off}%</span>
              )}
            </div>
            <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="flex-1">
                <h3 className="font-extrabold text-xl mb-1">{bundle.name}</h3>
                <p className="text-ink-muted text-sm mb-3">{bundle.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Трекер привычек', 'Трекер задач', 'Финансовый планер', 'Планер на неделю', 'Розовый трекер'].map(name => (
                    <Badge key={name} tone="accent">{name}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 flex-shrink-0">
                <div className="text-right">
                  <p className="font-extrabold text-2xl">{bundle.price.toLocaleString('ru-RU')} ₸</p>
                  <p className="text-ink-soft text-sm line-through">{bundle.oldPrice!.toLocaleString('ru-RU')} ₸</p>
                </div>
                <Button
                  size="md"
                  onClick={(e) => { e.stopPropagation(); openCheckout(bundle) }}
                  className="whitespace-nowrap"
                >
                  Купить за {bundle.price.toLocaleString('ru-RU')} ₸
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onBuy={openCheckout}
              onViewDetails={openDetail}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
