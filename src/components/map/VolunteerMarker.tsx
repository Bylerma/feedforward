'use client'

export function VolunteerMarker() {
  return (
    <div className="relative" style={{ transform: 'translate(-50%, -50%)' }}>
      <div className="w-8 h-8 rounded-full bg-blue-500 border-3 border-white shadow-lg flex items-center justify-center">
        <span className="text-white text-sm">🔵</span>
      </div>
      <div className="absolute -inset-2 rounded-full bg-blue-400/20 animate-ping" />
    </div>
  )
}
