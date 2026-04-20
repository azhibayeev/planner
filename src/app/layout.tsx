import type { Metadata } from 'next'
import './globals.css'
import PixelScript from '@/components/PixelScript'

export const metadata: Metadata = {
  title: 'Planer.Shop — Google Таблицы для продуктивности',
  description:
    'Купи готовую Google Таблицу для планирования, учёта бюджета или трекинга привычек. Доступ навсегда, без установок.',
}

const PIXEL_ID = process.env.NEXT_PUBLIC_PIXEL_ID || ''

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        {PIXEL_ID && <PixelScript pixelId={PIXEL_ID} />}
        {children}
      </body>
    </html>
  )
}
