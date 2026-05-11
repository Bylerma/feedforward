export async function getRoute(
  origin: [number, number],
  waypoints: [number, number][],
  destination: [number, number]
) {
  const coords = [origin, ...waypoints, destination]
    .map(c => c.join(','))
    .join(';')

  const res = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}` +
    `?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}` +
    `&geometries=geojson&steps=true&overview=full`
  )

  return res.json()
}

export async function getETA(
  origin: [number, number],
  destination: [number, number]
): Promise<{ duration_minutes: number; distance_km: number } | null> {
  try {
    const res = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.join(',')};${destination.join(',')}` +
      `?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&geometries=geojson`
    )
    const data = await res.json()

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0]
      return {
        duration_minutes: Math.round(route.duration / 60),
        distance_km: Math.round(route.distance / 10) / 100,
      }
    }
    return null
  } catch {
    return null
  }
}
