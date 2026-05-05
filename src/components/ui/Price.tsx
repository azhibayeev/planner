interface Props {
  price: number
  oldPrice?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showSavings?: boolean
  className?: string
}

const sizes = {
  sm: { main: 'text-base', old: 'text-xs' },
  md: { main: 'text-xl', old: 'text-sm' },
  lg: { main: 'text-2xl', old: 'text-base' },
  xl: { main: 'text-3xl', old: 'text-lg' },
}

const fmt = (n: number) => n.toLocaleString('ru-RU')

export default function Price({ price, oldPrice, size = 'md', showSavings = false, className = '' }: Props) {
  const s = sizes[size]
  const savings = oldPrice ? oldPrice - price : 0

  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span className={`font-extrabold ${s.main}`}>{fmt(price)} ₸</span>
      {oldPrice && (
        <span className={`text-ink-soft line-through ${s.old}`}>{fmt(oldPrice)} ₸</span>
      )}
      {showSavings && savings > 0 && (
        <span className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full whitespace-nowrap">
          −{fmt(savings)} ₸
        </span>
      )}
    </div>
  )
}

export function discountPercent(price: number, oldPrice?: number): number | null {
  if (!oldPrice || oldPrice <= price) return null
  return Math.round((1 - price / oldPrice) * 100)
}
