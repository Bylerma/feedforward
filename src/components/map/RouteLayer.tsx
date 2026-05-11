'use client'

interface RouteLayerProps {
  coordinates: [number, number][]
  color?: string
}

export function RouteLayer({ coordinates }: RouteLayerProps) {
  if (coordinates.length < 2) return null

  const points = coordinates.map(([lng, lat]) => `${lng},${lat}`).join(';')

  return (
    <img
      src={`https://api.mapbox.com/styles/v1/mapbox/light-v11/static/path-5+f97316/${points}/auto/400x200?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`}
      alt="Route"
      className="hidden"
    />
  )
}
