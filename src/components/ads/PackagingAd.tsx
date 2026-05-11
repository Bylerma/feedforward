'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Ad } from '@/types'

export function PackagingAd() {
  const [ad, setAd] = useState<Ad | null>(null)

  useEffect(() => {
    supabase
      .from('ads')
      .select('*, supplier:supplier_id(name, org_name)')
      .eq('is_active', true)
      .or('placement.eq.packaging,placement.eq.both')
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) setAd(data[0] as unknown as Ad)
      })
  }, [])

  useEffect(() => {
    if (ad) {
      supabase.from('ads').update({ impressions: (ad.impressions || 0) + 1 }).eq('id', ad.id)
    }
  }, [ad])

  if (!ad) return null

  return (
    <div className="rounded-xl border-2 border-dashed border-primary-300 bg-primary-50/50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
          <img
            src={ad.image_url}
            alt={ad.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-primary-600">Packaging Ad</p>
          <p className="text-sm font-semibold text-slate-900 truncate">{ad.title}</p>
          {ad.supplier?.org_name && (
            <p className="text-xs text-slate-500">Sponsored by {ad.supplier.org_name}</p>
          )}
        </div>
        {ad.link_url && (
          <a
            href={ad.link_url}
            target="_blank"
            rel="noopener"
            onClick={() => supabase.from('ads').update({ clicks: (ad.clicks || 0) + 1 }).eq('id', ad.id)}
            className="flex-shrink-0 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700 transition-colors"
          >
            Learn More
          </a>
        )}
      </div>
    </div>
  )
}
