'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import type { Notification } from '@/types'

const ICONS: Record<string, string> = {
  application_received: '📋',
  status_update: '🔄',
  message: '💬',
  match_found: '✅',
  system: '🔔',
}

interface Toast extends Notification {
  visible: boolean
}

export function NotificationToast() {
  const { user } = useAuthStore()
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('notifications-toast')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const notification = payload.new as Notification
          const toast: Toast = { ...notification, visible: true }
          setToasts((prev) => [...prev, toast])

          setTimeout(() => {
            setToasts((prev) =>
              prev.map((t) =>
                t.id === notification.id ? { ...t, visible: false } : t
              )
            )
            setTimeout(() => {
              setToasts((prev) => prev.filter((t) => t.id !== notification.id))
            }, 300)
          }, 5000)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
    )
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 300)
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`bg-white rounded-lg shadow-lg border border-slate-200 p-4 max-w-sm transition-all duration-300 ${
            toast.visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
          }`}
        >
          <div className="flex gap-3">
            <span className="text-lg mt-0.5">{ICONS[toast.type] || '🔔'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
              {toast.body && (
                <p className="text-xs text-slate-500 mt-0.5">{toast.body}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
