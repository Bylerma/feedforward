'use client'

interface PickupMarkerProps {
  lat: number
  lng: number
  quantity: number
  foodType: string
  onClick?: () => void
}

export function PickupMarker({ quantity, foodType }: PickupMarkerProps) {
  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-full shadow-md border border-slate-200 cursor-pointer hover:shadow-lg transition-shadow"
      style={{ transform: 'translate(-50%, -50%)' }}
    >
      <span className="text-sm">🍱</span>
      <span className="text-xs font-medium text-slate-800">{quantity} {foodType}</span>
    </div>
  )
}
