export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-10 px-4 text-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <p className="text-white font-bold text-base mb-2">
            Planer<span className="text-accent">.</span>Shop
          </p>
          <p className="text-xs leading-relaxed mb-4">
            Готовые Google Таблицы для планирования, учёта финансов и повышения продуктивности.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com/myplaner.asia"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          </div>
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
          <p className="text-xs mb-2">
            По вопросам заказов:{' '}
            <a href="mailto:support@myplaner.asia" className="text-white hover:underline">
              support@myplaner.asia
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
