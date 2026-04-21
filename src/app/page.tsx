import Header from '@/components/Header'
import Hero from '@/components/Hero'
import CountdownTimer from '@/components/CountdownTimer'
import HowItWorks from '@/components/HowItWorks'
import ProductCatalog from '@/components/ProductCatalog'
import ForWhom from '@/components/ForWhom'
import Reviews from '@/components/Reviews'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import RecentPurchaseToast from '@/components/RecentPurchaseToast'
import StickyBuyButton from '@/components/StickyBuyButton'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Как долго у меня будет доступ к таблице?', acceptedAnswer: { '@type': 'Answer', text: 'Навсегда. После покупки вы получаете ссылку на копирование таблицы в свой Google Диск. Таблица полностью ваша — без подписок и ограничений по времени.' } },
    { '@type': 'Question', name: 'Как происходит оплата?', acceptedAnswer: { '@type': 'Answer', text: 'Вводите номер телефона — мы выставляем счёт через Kaspi Pay. Открываете приложение Kaspi на телефоне, подтверждаете оплату во вкладке «Платежи».' } },
    { '@type': 'Question', name: 'Нужно что-то устанавливать?', acceptedAnswer: { '@type': 'Answer', text: 'Нет. Всё работает через браузер в Google Таблицах (sheets.google.com). Достаточно бесплатного аккаунта Google.' } },
    { '@type': 'Question', name: 'Работает ли на телефоне?', acceptedAnswer: { '@type': 'Answer', text: 'Да, Google Таблицы работают на iOS и Android через официальное приложение.' } },
    { '@type': 'Question', name: 'Можно ли редактировать таблицу под себя?', acceptedAnswer: { '@type': 'Answer', text: 'Да, абсолютно всё. Вы получаете полную копию — меняйте формулы, добавляйте листы, адаптируйте под свои задачи как угодно.' } },
  ],
}

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Google Таблицы для продуктивности',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Трекер привычек', url: 'https://myplaner.asia/#catalog', description: 'Ежедневный трекер привычек в Google Таблицах с полосой серий и анализом прогресса' },
    { '@type': 'ListItem', position: 2, name: 'Трекер задач', url: 'https://myplaner.asia/#catalog', description: 'Управление задачами с приоритетами, статусами и дедлайнами в Google Таблицах' },
    { '@type': 'ListItem', position: 3, name: 'Финансовый планер', url: 'https://myplaner.asia/#catalog', description: 'Учёт доходов и расходов, категории трат и визуальные графики в Google Таблицах' },
    { '@type': 'ListItem', position: 4, name: 'Планер на неделю', url: 'https://myplaner.asia/#catalog', description: 'Еженедельный планировщик с целями и задачами на 7 дней в Google Таблицах' },
    { '@type': 'ListItem', position: 5, name: 'Розовый трекер привычек', url: 'https://myplaner.asia/#catalog', description: 'Стильный трекер привычек в розовых тонах для Google Таблиц' },
  ],
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Planer.Shop',
  url: 'https://myplaner.asia',
  contactPoint: { '@type': 'ContactPoint', email: 'support@myplaner.asia', contactType: 'customer support' },
}

export default function Home() {
  return (
    <main className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <Header />
      <Hero />
      <CountdownTimer />
      <HowItWorks />
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
