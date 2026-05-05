'use client'

import { createContext, useCallback, useContext, useState, ReactNode } from 'react'
import { Product, products } from '@/lib/products'
import OrderModal from './OrderModal'
import ProductDetailModal from './ProductDetailModal'

interface CheckoutContextType {
  openCheckout: (product: Product) => void
  openCheckoutById: (id: string) => void
  openDetail: (product: Product) => void
}

const CheckoutContext = createContext<CheckoutContextType | null>(null)

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null)
  const [detailProduct, setDetailProduct] = useState<Product | null>(null)

  const openCheckout = useCallback((product: Product) => {
    setDetailProduct(null)
    setCheckoutProduct(product)
  }, [])

  const openCheckoutById = useCallback((id: string) => {
    const p = products.find(x => x.id === id)
    if (p) {
      setDetailProduct(null)
      setCheckoutProduct(p)
    }
  }, [])

  const openDetail = useCallback((product: Product) => {
    setDetailProduct(product)
  }, [])

  return (
    <CheckoutContext.Provider value={{ openCheckout, openCheckoutById, openDetail }}>
      {children}
      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onBuy={openCheckout}
        />
      )}
      {checkoutProduct && (
        <OrderModal
          product={checkoutProduct}
          onClose={() => setCheckoutProduct(null)}
        />
      )}
    </CheckoutContext.Provider>
  )
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext)
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider')
  return ctx
}
