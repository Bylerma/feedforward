import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return [] },
        setAll() {},
      },
    }
  )

  await supabase.auth.signOut()

  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL))
}
