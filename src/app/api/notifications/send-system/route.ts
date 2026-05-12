import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('auth_id', user.id)
    .single()

  if (!profile || profile.role !== 'corporate') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { user_ids, title, body: messageBody, data } = body

  if (!user_ids?.length || !title) {
    return NextResponse.json({ error: 'user_ids and title are required' }, { status: 400 })
  }

  const notifications = user_ids.map((uid: string) => ({
    user_id: uid,
    type: 'system',
    title,
    body: messageBody || null,
    data: data || null,
  }))

  const { error } = await supabase.from('notifications').insert(notifications)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, count: user_ids.length })
}
