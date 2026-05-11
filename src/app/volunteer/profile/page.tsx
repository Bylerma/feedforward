'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { Card } from '@/components/ui/Card'
import { ImpactCounter } from '@/components/ui/ImpactCounter'
import { Badge } from '@/components/ui/Badge'
import type { LeaderboardEntry } from '@/types'

export default function VolunteerProfilePage() {
  const { user } = useAuthStore()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [myStats, setMyStats] = useState({ meals: 0, runs: 0 })

  useEffect(() => {
    loadLeaderboard()
    loadStats()
  }, [user])

  const loadLeaderboard = async () => {
    const { data } = await supabase
      .from('users')
      .select('id, name, avatar_url, points, badges')
      .eq('role', 'volunteer')
      .order('points', { ascending: false })
      .limit(50)

    if (data) {
      const ranked = data.map((u, i) => ({
        ...u,
        rank: i + 1,
        total_runs: 0,
        total_meals: 0,
      })) as LeaderboardEntry[]
      setLeaderboard(ranked)
    }
  }

  const loadStats = async () => {
    if (!user) return
    const { data } = await supabase
      .from('impact_logs')
      .select('meals_rescued')
      .eq('volunteer_id', user.id)

    if (data) {
      setMyStats({
        meals: data.reduce((a, b) => a + b.meals_rescued, 0),
        runs: data.length,
      })
    }
  }

  const myRank = leaderboard.findIndex((e) => e.id === user?.id) + 1
  const badges = (user?.badges || []).length > 0 ? user?.badges : ['first_rescue']

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto text-2xl font-bold text-primary-700">
                {user?.name?.[0] || '?'}
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mt-4">{user?.name}</h1>
              <p className="text-slate-500">
                #{myRank || '-'} on Leaderboard &middot; {user?.points || 0} FF Points
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <ImpactCounter value={myStats.meals} suffix="Meals" icon="🍱" />
              <ImpactCounter value={myStats.runs} suffix="Runs" icon="♻️" />
            </div>

            <Card className="mb-8">
              <h3 className="font-semibold text-slate-900 mb-3">Badges</h3>
              <div className="flex flex-wrap gap-2">
                {(badges || []).map((badge: string) => (
                  <Badge key={badge} variant="success">
                    {badge.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-slate-900 mb-4">Leaderboard</h3>
              <div className="space-y-2">
                {leaderboard.slice(0, 10).map((entry) => (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      entry.id === user?.id ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 text-sm font-mono font-bold ${
                        entry.rank <= 3 ? 'text-accent-500' : 'text-slate-400'
                      }`}>
                        #{entry.rank}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium">
                        {entry.name?.[0] || '?'}
                      </div>
                      <span className="text-sm font-medium text-slate-900">{entry.name}</span>
                    </div>
                    <span className="text-sm font-mono font-bold text-primary-600">
                      {entry.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
