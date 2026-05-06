import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import PixelScript from '@/components/PixelScript'
import YandexMetrika from '@/components/YandexMetrika'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

const SITE_URL = 'https://myplaner.asia'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Planer.Shop — Google Таблицы для продуктивности',
  description: 'Готовые Google Таблицы для трекинга привычек, задач, финансов и планирования. Купи один раз — доступ навсегда. Уже используют 500+ казахстанцев.',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Planer.Shop — Google Таблицы для продуктивности',
    description: 'Готовые Google Таблицы для трекинга привычек, задач, финансов и планирования. Купи один раз — доступ навсегда.',
    url: SITE_URL,
    siteName: 'Planer.Shop',
    locale: 'ru_RU',
    type: 'website',
    // OG image берётся из app/opengraph-image.tsx (динамическая генерация)
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Planer.Shop — Google Таблицы для продуктивности',
    description: 'Готовые Google Таблицы для трекинга привычек, задач, финансов и планирования.',
    // Twitter card image тоже подхватится из opengraph-image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    other: {
      'facebook-domain-verification': 'eirghz9r0wmm919jrnmphy4oahe40r',
    },
  },
}

const PIXEL_ID = process.env.NEXT_PUBLIC_PIXEL_ID || ''
const YM_ID = process.env.NEXT_PUBLIC_YM_ID || ''

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        {PIXEL_ID && <PixelScript pixelId={PIXEL_ID} />}
        {YM_ID && <YandexMetrika counterId={YM_ID} />}
        {children}
      </body>
    </html>
  )
}
