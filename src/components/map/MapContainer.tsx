'use client'

import { useEffect, useRef } from 'react'

let mapboxgl: any = null

async function loadMapbox() {
  if (typeof window === 'undefined') return null
  if (mapboxgl) return mapboxgl
  const mb = await import('mapbox-gl')
  mb.default.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''
  mapboxgl = mb.default
  return mapboxgl
}

interface MapMarker {
  id: string
  lat: number
  lng: number
  type: 'pickup' | 'ngo' | 'volunteer'
  label?: string
}

interface MapContainerProps {
  markers?: MapMarker[]
  center?: [number, number]
  zoom?: number
  className?: string
  interactive?: boolean
  onMarkerClick?: (id: string) => void
}

export function MapContainer({
  markers = [],
  center = [78.9629, 20.5937],
  zoom = 10,
  className = 'w-full h-full',
  interactive = true,
}: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)

  useEffect(() => {
    let cancelled = false

    async function init() {
      const mb = await loadMapbox()
      if (!mb || cancelled || !mapContainer.current || map.current) return

      map.current = new mb.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center,
        zoom,
        interactive,
      })

      map.current.addControl(new mb.NavigationControl(), 'top-right')
    }

    init()

    return () => {
      cancelled = true
      map.current?.remove()
      map.current = null
    }
  }, [])

  useEffect(() => {
    const mb = mapboxgl
    if (!mb || !map.current) return

    const markerInstances: any[] = []

    markers.forEach((marker) => {
      const el = document.createElement('div')
      el.className = 'cursor-pointer'

      const colors = {
        pickup: '#22c55e',
        ngo: '#f97316',
        volunteer: '#3b82f6',
      }

      el.innerHTML = `<div style="
        width: 32px; height: 32px; border-radius: 50%;
        background: ${colors[marker.type]};
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        display: flex; align-items: center; justify-content: center;
        font-size: 14px;
      ">${marker.type === 'pickup' ? '🍱' : marker.type === 'ngo' ? '🏠' : '🔵'}</div>`

      const instance = new mb.Marker({ element: el })
        .setLngLat([marker.lng, marker.lat])
        .setPopup(new mb.Popup({ offset: 25 }).setText(marker.label || ''))
        .addTo(map.current!)
      markerInstances.push(instance)
    })

    return () => {
      markerInstances.forEach((m) => m.remove())
    }
  }, [markers])

  return <div ref={mapContainer} className={className} />
}
