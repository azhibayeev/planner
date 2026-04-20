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
        <div className="mt-12 grid grid-cols-3 gap-6 max-w-sm mx-auto text-center">
          <div>
            <p className="text-2xl font-bold">500+</p>
            <p className="text-gray-500 text-xs mt-1">покупателей</p>
          </div>
          <div>
            <p className="text-2xl font-bold">6</p>
            <p className="text-gray-500 text-xs mt-1">таблиц в каталоге</p>
          </div>
          <div>
            <p className="text-2xl font-bold">5★</p>
            <p className="text-gray-500 text-xs mt-1">средняя оценка</p>
          </div>
        </div>
      </div>
    </section>
  )
}
