import Header from '@/components/Header'
import Hero from '@/components/Hero'
import CountdownTimer from '@/components/CountdownTimer'
import ProductCatalog from '@/components/ProductCatalog'
import ForWhom from '@/components/ForWhom'
import Reviews from '@/components/Reviews'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import RecentPurchaseToast from '@/components/RecentPurchaseToast'
import StickyBuyButton from '@/components/StickyBuyButton'

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <Hero />
      <CountdownTimer />
      <ProductCatalog />
      <ForWhom />
      <Reviews />
      <FAQ />
      <Footer />
      <RecentPurchaseToast />
      <StickyBuyButton />
    </main>
  )
}
