'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import type { Ad, AdPlacement } from '@/types'

export default function SupplierAdsPage() {
  const { user } = useAuthStore()
  const [ads, setAds] = useState<Ad[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [placement, setPlacement] = useState<AdPlacement>('website')
  const [targetPage, setTargetPage] = useState('all')
  const [budget, setBudget] = useState('')
  const [saving, setSaving] = useState(false)

  const loadAds = async () => {
    if (!user) return
    const { data } = await supabase
      .from('ads')
      .select('*')
      .eq('supplier_id', user.id)
      .order('created_at', { ascending: false })
    if (data) setAds(data as unknown as Ad[])
  }

  useEffect(() => { loadAds() }, [user])

  const resetForm = () => {
    setTitle('')
    setImageUrl('')
    setLinkUrl('')
    setPlacement('website')
    setTargetPage('all')
    setBudget('')
    setEditingId(null)
  }

  const openEdit = (ad: Ad) => {
    setTitle(ad.title)
    setImageUrl(ad.image_url)
    setLinkUrl(ad.link_url || '')
    setPlacement(ad.placement)
    setTargetPage(ad.target_page || 'all')
    setBudget(ad.budget?.toString() || '')
    setEditingId(ad.id)
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      title,
      image_url: imageUrl,
      link_url: linkUrl || null,
      placement,
      target_page: targetPage,
      budget: budget ? parseFloat(budget) : null,
    }

    if (editingId) {
      await supabase.from('ads').update(payload).eq('id', editingId)
    } else {
      await supabase.from('ads').insert({ supplier_id: user!.id, ...payload })
    }

    setSaving(false)
    setShowForm(false)
    resetForm()
    loadAds()
  }

  const toggleActive = async (ad: Ad) => {
    await supabase.from('ads').update({ is_active: !ad.is_active }).eq('id', ad.id)
    loadAds()
  }

  const deleteAd = async (id: string) => {
    await supabase.from('ads').delete().eq('id', id)
    loadAds()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Ad Campaigns</h1>
                <p className="text-sm text-slate-500 mt-1">Promote your business across the FeedForward platform</p>
              </div>
              <Button onClick={() => { resetForm(); setShowForm(true) }}>+ New Ad</Button>
            </div>

            {ads.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <p className="text-4xl mb-3">📢</p>
                  <p className="text-slate-600 font-medium">No ads yet</p>
                  <p className="text-sm text-slate-400 mt-1">Create your first ad to reach volunteers and NGOs</p>
                  <Button className="mt-4" onClick={() => { resetForm(); setShowForm(true) }}>
                    Create Your First Ad
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {ads.map((ad) => (
                  <Card key={ad.id}>
                    <div className="flex items-start gap-4">
                      <div className="w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                        <img src={ad.image_url} alt={ad.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900 truncate">{ad.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            ad.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {ad.is_active ? 'Active' : 'Paused'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                          <span>Placement: {ad.placement}</span>
                          <span>Impressions: {ad.impressions}</span>
                          <span>Clicks: {ad.clicks}</span>
                          {ad.budget && <span>Budget: ₹{ad.budget}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button variant="ghost" size="sm" onClick={() => toggleActive(ad)}>
                          {ad.is_active ? 'Pause' : 'Activate'}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEdit(ad)}>Edit</Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteAd(ad.id)}>Delete</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <MobileNav />

      <Modal open={showForm} onClose={() => { setShowForm(false); resetForm() }}
             title={editingId ? 'Edit Ad' : 'Create New Ad'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ad Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. Fresh Produce Daily" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://example.com/ad-banner.jpg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Link URL (optional)</label>
            <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://your-business.com/offer" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Placement</label>
            <select value={placement} onChange={(e) => setPlacement(e.target.value as AdPlacement)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="website">Website Banner</option>
              <option value="packaging">Packaging Label</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Target Page</label>
            <select value={targetPage} onChange={(e) => setTargetPage(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="all">All Pages</option>
              <option value="dashboard">Dashboards</option>
              <option value="landing">Landing Page</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Budget (₹, optional)</label>
            <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} min="0"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="1000" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={saving} className="flex-1">
              {editingId ? 'Save Changes' : 'Create Ad'}
            </Button>
            <Button type="button" variant="outline" onClick={() => { setShowForm(false); resetForm() }} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
