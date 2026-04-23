export interface Product {
  id: string
  name: string
  description: string
  price: number
  oldPrice?: number
  imageUrl: string
  coverUrl?: string
  tag?: string
  rating: number
  reviewCount: number
  color: string
  screenshots: string[]
  previewSheetId?: string
  previewGid?: string
}

export const products: Product[] = [
  {
    id: 'bundle-all',
    name: 'Все вместе',
    description: 'Полный пакет из 5 таблиц по специальной цене: трекер привычек, трекер задач, финансовый планер, планер на неделю и розовый трекер привычек',
    price: 6990,
    oldPrice: 14990,
    imageUrl: '',
    tag: 'Лучшая цена',
    rating: 5.0,
    reviewCount: 312,
    color: 'from-amber-500 to-orange-600',
    screenshots: [
      '/previews/tracker-privichek-1.webp',
      '/previews/tracker-zadach-1.jpg',
      '/previews/finance-plan-1.webp',
      '/previews/week-1.webp',
      '/previews/pink-1.webp',
    ],
  },
  {
    id: 'habit-tracker',
    name: 'Трекер привычек',
    description: 'Ежедневный трекер с полосой серий, анализом прогресса по месяцам и мотивационной системой',
    price: 2490,
    oldPrice: 3990,
    imageUrl: '/products/habits.svg',
    tag: 'Хит',
    rating: 4.9,
    reviewCount: 234,
    color: 'from-violet-500 to-violet-700',
    coverUrl: '/previews/habit-tracker-cover.jpg',
    screenshots: ['/previews/tracker-privichek-1.webp', '/previews/tracker-privichek-2.webp'],
    previewSheetId: '1_CGkd5MjE654wLTzYjXfjVaoDsVGvSw3HzxqlvpszXI',
    previewGid: '904802037',
  },
  {
    id: 'task-tracker',
    name: 'Трекер задач',
    description: 'Управляй задачами с приоритетами, статусами и дедлайнами. Полный обзор на неделю и по проектам',
    price: 2990,
    oldPrice: 4990,
    imageUrl: '/products/planer-week.svg',
    tag: 'Популярное',
    rating: 4.8,
    reviewCount: 187,
    color: 'from-blue-500 to-blue-700',
    coverUrl: '/previews/tracker-zadach-cover.webp',
    screenshots: ['/previews/tracker-zadach-1.jpg', '/previews/tracker-zadach-2.jpg'],
    previewSheetId: '1T3oXdlk-A5Ku2Gsm5Ix80fnUMla8UZgLy9tkfLpJMTY',
    previewGid: '1498786081',
  },
  {
    id: 'budget',
    name: 'Финансовый планер',
    description: 'Учёт доходов и расходов, категории трат, визуальные графики за месяц и год — всё в одном месте',
    price: 3990,
    oldPrice: 5990,
    imageUrl: '/products/budget.svg',
    tag: 'Популярное',
    rating: 4.8,
    reviewCount: 143,
    color: 'from-emerald-500 to-emerald-700',
    coverUrl: '/previews/finance-plan-cover.webp',
    screenshots: ['/previews/finance-plan-1.webp', '/previews/finance-plan-2.webp'],
    previewSheetId: '1dMrQHluKWOXG1LShT2prdXBzYlBNcpybSBH2zJuisfY',
    previewGid: '1409432328',
  },
  {
    id: 'planer-week',
    name: 'Планер на неделю',
    description: 'Еженедельный планировщик: цели, задачи и приоритеты на 7 дней с автоматической сводкой',
    price: 2990,
    oldPrice: 4990,
    imageUrl: '/products/year.svg',
    tag: 'Хит',
    rating: 4.7,
    reviewCount: 112,
    color: 'from-indigo-500 to-indigo-700',
    coverUrl: '/previews/week-cover.webp',
    screenshots: ['/previews/week-1.webp', '/previews/week-2.webp'],
    previewSheetId: '1km2Qi_578NjdkdTRcKrNKBiJEi0BLvpWKVvNV0kyhow',
    previewGid: '1409432328',
  },
  {
    id: 'pink-habit-tracker',
    name: 'Розовый трекер привычек',
    description: 'Стильный трекер в нежных розовых тонах — отслеживай привычки красиво каждый день',
    price: 2490,
    oldPrice: 3990,
    imageUrl: '/products/habits.svg',
    coverUrl: '/previews/tracker-privichek-cover.webp',
    tag: 'Новинка',
    rating: 4.9,
    reviewCount: 76,
    color: 'from-pink-400 to-rose-500',
    screenshots: ['/previews/pink-1.webp', '/previews/pink-2.webp'],
    previewSheetId: '16V-BmFDy04NmwkZ1AR0-IRnFzEiuO-77Us3zyp_gz3Q',
  },
]
