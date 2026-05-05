import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#f59e0b',
          hover: '#d97706',
          soft: '#fef3c7',
          ring: '#fcd34d',
        },
        primary: {
          DEFAULT: '#0a0a0a',
          hover: '#1f1f1f',
        },
        ink: {
          DEFAULT: '#0a0a0a',
          muted: '#6b7280',
          soft: '#9ca3af',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f9fafb',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
}
export default config
