type Tone = 'neutral' | 'accent' | 'success' | 'danger' | 'overlay'

interface Props {
  tone?: Tone
  children: React.ReactNode
  className?: string
}

const tones: Record<Tone, string> = {
  neutral: 'bg-gray-100 text-gray-700',
  accent: 'bg-accent-soft text-accent-hover border border-accent/30',
  success: 'bg-emerald-50 text-emerald-700',
  danger: 'bg-red-500 text-white',
  overlay: 'bg-white/20 backdrop-blur-sm text-white border border-white/30',
}

export default function Badge({ tone = 'neutral', children, className = '' }: Props) {
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${tones[tone]} ${className}`}>
      {children}
    </span>
  )
}
