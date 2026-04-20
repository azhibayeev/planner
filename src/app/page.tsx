import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ProductCatalog from '@/components/ProductCatalog'
import Reviews from '@/components/Reviews'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <ProductCatalog />
      <Reviews />
      <FAQ />
      <Footer />
    </main>
  )
}
