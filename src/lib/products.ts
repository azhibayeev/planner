export interface Product {
  id: string
  name: string
  description: string
  price: number
  oldPrice?: number
  imageUrl: string
  tag?: string
}

export const products: Product[] = [
  {
    id: 'planer-week',
    name: 'Планировщик недели',
    description: 'Google Таблица для планирования задач на неделю с приоритетами и статусами выполнения',
    price: 490,
    oldPrice: 790,
    imageUrl: '/products/planer-week.svg',
    tag: 'Хит',
  },
  {
    id: 'budget-personal',
    name: 'Личный бюджет',
    description: 'Учёт доходов и расходов, категории трат, визуальные графики за месяц и год',
    price: 690,
    oldPrice: 990,
    imageUrl: '/products/budget.svg',
    tag: 'Популярное',
  },
  {
    id: 'habit-tracker',
    name: 'Трекер привычек',
    description: 'Ежедневный трекер с полосой серий, анализом прогресса и мотивационной системой',
    price: 390,
    imageUrl: '/products/habits.svg',
  },
  {
    id: 'project-manager',
    name: 'Менеджер проектов',
    description: 'Канбан-доска, дедлайны, распределение задач по исполнителям и отслеживание статусов',
    price: 890,
    oldPrice: 1290,
    imageUrl: '/products/project.svg',
    tag: 'Новинка',
  },
  {
    id: 'fitness-tracker',
    name: 'Фитнес-трекер',
    description: 'Журнал тренировок, питание, вес, прогресс по упражнениям и визуализация результатов',
    price: 490,
    imageUrl: '/products/fitness.svg',
  },
  {
    id: 'planer-year',
    name: 'Годовой планировщик',
    description: 'Цели на год, декомпозиция по кварталам и месяцам, итоги и ретроспектива',
    price: 790,
    oldPrice: 1190,
    imageUrl: '/products/year.svg',
  },
]
