const reviews = [
  {
    name: 'Анастасия К.',
    avatar: 'АК',
    avatarColor: 'bg-violet-500',
    product: 'Трекер привычек',
    rating: 5,
    date: '12 апреля 2025',
    text: 'Наконец-то нашла трекер, который реально работает! Всё структурировано, ничего лишнего. Слежу за привычками уже 2 месяца и не бросаю. Купила ещё и Розовый — подружке в подарок.',
  },
  {
    name: 'Дмитрий В.',
    avatar: 'ДВ',
    avatarColor: 'bg-emerald-500',
    product: 'Финансовый планер',
    rating: 5,
    date: '3 апреля 2025',
    text: 'Пользуюсь уже 3 месяца. Наконец понял, куда уходят деньги. Графики очень наглядные. Единственное — привыкал около недели, но потом уже автоматически заношу всё.',
  },
  {
    name: 'Мария Т.',
    avatar: 'МТ',
    avatarColor: 'bg-blue-500',
    product: 'Трекер задач',
    rating: 5,
    date: '28 марта 2025',
    text: 'Работаю фрилансером и это просто находка. Все задачи, дедлайны и статусы в одном месте. Никакой лишней подписки — просто копируешь и работаешь. Буду рекомендовать коллегам.',
  },
  {
    name: 'Иван С.',
    avatar: 'ИС',
    avatarColor: 'bg-indigo-500',
    product: 'Планер на неделю',
    rating: 4,
    date: '15 марта 2025',
    text: 'Хороший планировщик. Каждое воскресенье выделяю 10 минут — расставляю задачи на неделю и потом просто работаю по списку. Всё чётко и без лишнего.',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className="w-4 h-4" viewBox="0 0 20 20">
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            fill={rating >= star ? '#f59e0b' : '#e5e7eb'}
          />
        </svg>
      ))}
    </div>
  )
}

function RatingBar({ stars, percent }: { stars: number; percent: number }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-500 w-4 text-right">{stars}</span>
      <svg className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div
          className="bg-amber-400 h-2 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-gray-400 w-8 text-right">{percent}%</span>
    </div>
  )
}

export default function Reviews() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold mb-3">Отзывы покупателей</h2>
          <p className="text-gray-500">Более 500 клиентов уже пользуются нашими таблицами</p>
        </div>

        {/* Сводный блок */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 flex flex-col md:flex-row gap-6 items-center">
          <div className="text-center flex-shrink-0">
            <p className="text-6xl font-extrabold text-gray-900">4.8</p>
            <div className="flex justify-center mt-2">
              <StarRating rating={5} />
            </div>
            <p className="text-gray-500 text-sm mt-1">из 5 · 693 отзыва</p>
          </div>

          <div className="flex-1 w-full flex flex-col gap-1.5">
            <RatingBar stars={5} percent={84} />
            <RatingBar stars={4} percent={11} />
            <RatingBar stars={3} percent={3} />
            <RatingBar stars={2} percent={1} />
            <RatingBar stars={1} percent={1} />
          </div>
        </div>

        {/* Карточки отзывов */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review, i) => (
            <div key={i} className="border border-gray-200 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`${review.avatarColor} w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{review.name}</p>
                    <p className="text-gray-400 text-xs">{review.product}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StarRating rating={review.rating} />
                  <span className="text-gray-400 text-xs">{review.date}</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">{review.text}</p>

              {/* Верифицированная покупка */}
              <div className="flex items-center gap-1.5 mt-auto">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs text-emerald-600 font-medium">Подтверждённая покупка</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
