'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Ad } from '@/types'

interface AdDisplayProps {
  placement?: 'website' | 'packaging'
  targetPage?: string
  className?: string
}

export function AdDisplay({ placement = 'website', targetPage, className = '' }: AdDisplayProps) {
  const [ads, setAds] = useState<Ad[]>([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    let query = supabase
      .from('ads')
      .select('*, supplier:supplier_id(name, org_name)')
      .eq('is_active', true)
      .or(`placement.eq.${placement},placement.eq.both`)

    if (targetPage) {
      query = query.or(`target_page.eq.${targetPage},target_page.eq.all`)
    }

    query.order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setAds(data as unknown as Ad[])
    })
  }, [placement, targetPage])

  const ad = ads.length > 0 ? ads[current % ads.length] : null

  useEffect(() => {
    if (!ad) return
    supabase.from('ads').update({ impressions: (ad.impressions || 0) + 1 }).eq('id', ad.id)
  }, [current, ad])

  useEffect(() => {
    if (ads.length <= 1) return
    const interval = setInterval(() => setCurrent((c) => (c + 1) % ads.length), 8000)
    return () => clearInterval(interval)
  }, [ads.length])

  const handleClick = useCallback(() => {
    if (!ad) return
    supabase.from('ads').update({ clicks: (ad.clicks || 0) + 1 }).eq('id', ad.id)
    if (ad.link_url) window.open(ad.link_url, '_blank', 'noopener')
  }, [ad])

  if (!ad) return null

  return (
    <button
      onClick={handleClick}
      className={`block w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md ${className}`}
    >
      <div className="relative aspect-[3/1] sm:aspect-[4/1] bg-slate-100">
        <img
          src={ad.image_url}
          alt={ad.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-3">
          <p className="text-xs font-medium text-white">{ad.title}</p>
          {ad.supplier?.org_name && (
            <p className="text-[10px] text-white/70">Sponsored by {ad.supplier.org_name}</p>
          )}
        </div>
      </div>
    </button>
  )
}
