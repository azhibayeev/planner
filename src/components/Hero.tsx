export default function Hero() {
  return (
    <section className="bg-black text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-4">
          Google Таблицы для продуктивности
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
          Контролируйте свою продуктивность,
          <br />
          <span className="text-accent">распределяйте время</span> и анализируйте финансы
        </h1>
        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
          Готовые Google Таблицы — просто скопируй, открой и начни пользоваться.
          Никаких установок, работает на любом устройстве.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#catalog"
            className="bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            Смотреть каталог
          </a>
          <a
            href="#order"
            className="bg-accent text-white font-semibold px-8 py-3 rounded-full hover:bg-red-500 transition-colors"
          >
            Купить сейчас
          </a>
        </div>

        {/* Рейтинг покупателей */}
        <div className="mt-10 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map((s) => (
              <svg key={s} className="w-5 h-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-white font-semibold text-sm">
            4.8 из 5 &mdash; <span className="text-gray-400 font-normal">693 отзыва</span>
          </p>
        </div>

        {/* Статистика */}
        <div className="mt-10 grid grid-cols-3 gap-6 max-w-sm mx-auto text-center border-t border-gray-800 pt-8">
          <div>
            <p className="text-2xl font-bold">500+</p>
            <p className="text-gray-500 text-xs mt-1">покупателей</p>
          </div>
          <div>
            <p className="text-2xl font-bold">6</p>
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
