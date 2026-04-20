export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <a href="/" className="font-bold text-xl tracking-tight">
          Planer<span className="text-accent">.</span>Shop
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <a href="#catalog" className="hover:text-black transition-colors">Каталог</a>
          <a href="#faq" className="hover:text-black transition-colors">FAQ</a>
          <a href="#order" className="hover:text-black transition-colors">Заказать</a>
        </nav>
      </div>
    </header>
  )
}
