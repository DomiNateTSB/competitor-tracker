import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, '10 s'),
  prefix: 'ct',
})

const authRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  prefix: 'ct:auth',
})

const AUTH_PATHS = ['/auth/sign-in', '/auth/sign-up', '/auth/forgot-password']

export async function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
  const { pathname } = request.nextUrl

  // Skip rate limiting if Upstash env vars not set (local dev)
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    return await updateSession(request)
  }

  try {
    const isAuthPath = AUTH_PATHS.some(p => pathname.startsWith(p))
    const limiter = isAuthPath ? authRatelimit : ratelimit
    const key = isAuthPath ? `auth:${ip}` : `global:${ip}`

    const { success, limit, remaining, reset } = await limiter.limit(key)

    if (!success) {
      if (request.headers.get('accept')?.includes('text/html')) {
        return new NextResponse(
          `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Too many requests</title>
          <style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f7f8fa;}
          .box{background:white;border:1px solid #e4e4e7;border-radius:12px;padding:40px;text-align:center;max-width:360px;}
          h1{font-size:18px;color:#18181b;margin:0 0 8px;}p{font-size:13px;color:#71717a;margin:0;}</style></head>
          <body><div class="box"><h1>Too many requests</h1><p>Please wait a moment before trying again.</p></div></body></html>`,
          { status: 429, headers: { 'Content-Type': 'text/html', 'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)) } }
        )
      }
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'X-RateLimit-Limit': String(limit), 'X-RateLimit-Remaining': String(remaining), 'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)) } }
      )
    }
  } catch {
    // If Upstash is unreachable, fail open (don't block users)
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
