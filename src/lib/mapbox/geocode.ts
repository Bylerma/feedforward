export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json` +
      `?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=1`
    )
    const data = await res.json()

    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center
      return { lat, lng }
    }
    return null
  } catch {
    return null
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json` +
      `?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=1`
    )
    const data = await res.json()

    if (data.features && data.features.length > 0) {
      return data.features[0].place_name
    }
    return null
  } catch {
    return null
  }
}
