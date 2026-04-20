export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-10 px-4 text-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="text-white font-bold text-base mb-2">
            Planer<span className="text-accent">.</span>Shop
          </p>
          <p className="text-xs leading-relaxed">
            Готовые Google Таблицы для планирования, учёта финансов и повышения продуктивности.
          </p>
        </div>
        <div>
          <p className="text-white font-semibold mb-3">Документы</p>
          <ul className="flex flex-col gap-1.5 text-xs">
            <li><a href="/privacy" className="hover:text-white transition-colors">Политика конфиденциальности</a></li>
            <li><a href="/offer" className="hover:text-white transition-colors">Публичная оферта</a></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-3">Поддержка</p>
          <p className="text-xs">
            По вопросам заказов:{' '}
            <a href="mailto:support@planer.shop" className="text-white hover:underline">
              support@planer.shop
            </a>
          </p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-800 text-xs text-gray-600">
        © {new Date().getFullYear()} Planer.Shop — Все права защищены
      </div>
    </footer>
  )
}
