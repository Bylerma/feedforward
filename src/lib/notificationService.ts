import { supabase } from '@/lib/supabase/client'
import type { Notification } from '@/types'

type NotificationType = 'application_received' | 'status_update' | 'message' | 'match_found' | 'system'

interface CreateNotificationInput {
  user_id: string
  type: NotificationType
  title: string
  body?: string
  data?: Record<string, unknown>
}

export async function createNotification(input: CreateNotificationInput): Promise<Notification | null> {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: input.user_id,
      type: input.type,
      title: input.title,
      body: input.body || null,
      data: input.data || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create notification:', error)
    return null
  }
  return data as Notification
}

export async function sendSystemNotification(
  userIds: string[],
  title: string,
  body?: string,
  data?: Record<string, unknown>
): Promise<void> {
  const notifications = userIds.map((user_id) => ({
    user_id,
    type: 'system' as NotificationType,
    title,
    body: body || null,
    data: data || null,
  }))

  const { error } = await supabase.from('notifications').insert(notifications)
  if (error) console.error('Failed to send system notifications:', error)
}

export async function getUserNotifications(
  userId: string,
  { limit = 20, unreadOnly = false }: { limit?: number; unreadOnly?: boolean } = {}
): Promise<Notification[]> {
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (unreadOnly) {
    query = query.eq('is_read', false)
  }

  const { data, error } = await query
  if (error) {
    console.error('Failed to fetch notifications:', error)
    return []
  }
  return data as Notification[]
}

export async function markAsRead(notificationId: string): Promise<boolean> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)

  if (error) {
    console.error('Failed to mark as read:', error)
    return false
  }
  return true
}

export async function markAllAsRead(userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false)

  if (error) {
    console.error('Failed to mark all as read:', error)
    return false
  }
  return true
}

export async function getUnreadCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false)

  if (error) {
    console.error('Failed to get unread count:', error)
    return 0
  }
  return count || 0
}

export async function getNotificationPreferences(userId: string) {
  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Failed to fetch preferences:', error)
  }
  return data
}

export async function upsertNotificationPreferences(
  userId: string,
  prefs: {
    email_alerts?: boolean
    push_alerts?: boolean
    types?: NotificationType[]
  }
): Promise<boolean> {
  const { error } = await supabase
    .from('notification_preferences')
    .upsert({ user_id: userId, ...prefs })

  if (error) {
    console.error('Failed to update preferences:', error)
    return false
  }
  return true
}
