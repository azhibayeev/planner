/** @type {import('next').NextConfig} */
const securityHeaders = [
  // Принудительный HTTPS на 1 год + preload
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  // Запрет встраивания в <iframe> (clickjacking)
  { key: 'X-Frame-Options', value: 'DENY' },
  // Браузер не должен угадывать MIME-тип
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Реферер только при переходах внутри домена (приватность)
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Запрет доступа к камере/микрофону/гео — мы их не используем
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
]

const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}
module.exports = nextConfig
