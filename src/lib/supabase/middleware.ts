import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/', '/login', '/signup', '/onboard', '/api/auth/callback']

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const path = request.nextUrl.pathname

  if (PUBLIC_ROUTES.some(route => path.startsWith(route)) ||
      path.startsWith('/_next') ||
      path.startsWith('/api') ||
      path.includes('.')) {
    return supabaseResponse
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('auth_id', user.id)
      .single()

    if (profile?.role) {
      const ROLE_ROUTES: Record<string, string[]> = {
        supplier: ['/supplier'],
        volunteer: ['/volunteer'],
        ngo: ['/ngo'],
        corporate: ['/corporate'],
      }
      const allowedRoutes = ROLE_ROUTES[profile.role] || []
      const isOnRoleRoute = allowedRoutes.some(route => path.startsWith(route))

      if (!isOnRoleRoute) {
        const url = request.nextUrl.clone()
        url.pathname = allowedRoutes[0] || '/'
        return NextResponse.redirect(url)
      }
    }
  } catch {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
