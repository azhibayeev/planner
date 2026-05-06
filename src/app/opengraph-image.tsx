import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Planer.Shop — 5 готовых Google Таблиц для продуктивности'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const Star = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#fbbf24">
    <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.401 8.169L12 18.896l-7.335 3.871 1.401-8.169L.132 9.211l8.2-1.193z" />
  </svg>
)

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0a0a0a',
          display: 'flex',
          flexDirection: 'column',
          padding: 80,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            background: 'radial-gradient(circle, #f59e0b55, transparent 70%)',
            borderRadius: '50%',
            display: 'flex',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            color: 'white',
            fontSize: 32,
            fontWeight: 700,
          }}
        >
          Planer
          <span style={{ color: '#f59e0b' }}>.</span>
          Shop
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div
            style={{
              color: 'white',
              fontSize: 80,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span>5 готовых Google Таблиц</span>
            <span style={{ color: '#f59e0b', marginTop: 12 }}>для привычек, задач и финансов</span>
          </div>

          <div
            style={{
              marginTop: 40,
              display: 'flex',
              alignItems: 'center',
              color: '#9ca3af',
              fontSize: 26,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginRight: 12 }}>
              <Star size={28} />
              <Star size={28} />
              <Star size={28} />
              <Star size={28} />
              <Star size={28} />
            </div>
            <span style={{ color: 'white', fontWeight: 700, marginRight: 24 }}>4.8</span>
            <span style={{ marginRight: 12 }}>·</span>
            <span>800+ покупателей в Казахстане</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            color: 'white',
          }}
        >
          <span style={{ fontSize: 24, color: '#9ca3af', marginRight: 16 }}>Все 5 таблиц от</span>
          <span style={{ fontSize: 56, fontWeight: 800, color: '#f59e0b', marginRight: 16 }}>6 990 тг</span>
          <span style={{ fontSize: 28, color: '#6b7280', textDecoration: 'line-through', marginRight: 24 }}>14 990 тг</span>
          <span
            style={{
              background: '#ef4444',
              color: 'white',
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            −53%
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
