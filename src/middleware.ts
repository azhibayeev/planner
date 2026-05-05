import { NextResponse, NextRequest } from 'next/server'

// Constant-time string compare. Edge runtime doesn't expose crypto.timingSafeEqual,
// so we roll a XOR-loop variant that runs in O(n) regardless of mismatch position.
function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

function unauthorized() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="planer-admin", charset="UTF-8"',
    },
  })
}

export function middleware(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!auth || !auth.startsWith('Basic ')) return unauthorized()

  const expectedUser = process.env.ADMIN_USERNAME ?? 'admin'
  const expectedPass = process.env.ADMIN_PASSWORD
  if (!expectedPass) {
    console.error('[admin] ADMIN_PASSWORD not configured')
    return new NextResponse('Server misconfigured', { status: 500 })
  }

  let decoded: string
  try {
    decoded = atob(auth.slice(6))
  } catch {
    return unauthorized()
  }

  const sepIdx = decoded.indexOf(':')
  if (sepIdx === -1) return unauthorized()
  const user = decoded.slice(0, sepIdx)
  const pass = decoded.slice(sepIdx + 1)

  if (!timingSafeCompare(user, expectedUser) || !timingSafeCompare(pass, expectedPass)) {
    return unauthorized()
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
