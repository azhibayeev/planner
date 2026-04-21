import SpreadsheetPreview from './SpreadsheetPreview'

export default function Hero() {
  return (
    <section className="bg-black text-white pt-16 pb-12 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Двухколоночный блок */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Левая колонка — текст (на мобилке идёт второй) */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
              Хватит терять время —
              <br />
              <span className="text-accent">возьми жизнь под контроль</span>
            </h1>

            <p className="text-gray-400 text-base md:text-lg mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
              Готовые Google Таблицы для привычек, задач, финансов и планирования.
              Уже используют <span className="text-white font-semibold">500+ казахстанцев</span> — просто скопируй и начни.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
              <a
                href="#catalog"
                className="bg-white text-black font-semibold px-8 py-3.5 rounded-full hover:bg-gray-100 transition-colors text-sm"
              >
                Смотреть каталог
              </a>
            </div>

            {/* Рейтинг */}
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className="w-4 h-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-white font-semibold text-sm">4.8</span>
              <span className="text-gray-500 text-sm">· 693 отзыва</span>
              <span className="text-gray-700">·</span>
              <span className="text-gray-400 text-sm">500+ покупателей</span>
            </div>
          </div>

          {/* Правая колонка — таблица (на мобилке идёт первой) */}
          <div className="relative order-1 lg:order-2">
            {/* Glow эффект */}
            <div className="absolute inset-0 bg-violet-600/20 blur-3xl rounded-full scale-75 pointer-events-none" />
            <div className="relative">
              <SpreadsheetPreview />
            </div>
          </div>
        </div>

        {/* Статистика — полная ширина снизу */}
        <div className="mt-14 grid grid-cols-2 gap-6 max-w-xs mx-auto lg:max-w-none lg:grid-cols-2 text-center border-t border-gray-800 pt-8">
          <div>
            <p className="text-2xl font-bold">5</p>
            <p className="text-gray-500 text-xs mt-1">таблиц в каталоге</p>
          </div>
          <div>
            <p className="text-2xl font-bold">∞</p>
            <p className="text-gray-500 text-xs mt-1">без подписки</p>
          </div>
        </div>

      </div>
    </section>
  )
}
