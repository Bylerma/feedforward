'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'

interface QRScannerProps {
  onScan: (token: string) => void
  stage: 'pickup' | 'delivery'
}

export function QRScanner({ onScan, stage }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!scanning) return

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch {
        setError('Camera access denied. Please allow camera permissions.')
      }
    }

    startCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((t) => t.stop())
      }
    }
  }, [scanning])

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm font-medium text-slate-700">
          Scan the {stage === 'pickup' ? "supplier's" : "NGO's"} QR code
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {!scanning ? (
        <div className="flex justify-center">
          <Button onClick={() => setScanning(true)}>
            Open Camera
          </Button>
        </div>
      ) : (
        <div className="relative aspect-square max-w-xs mx-auto bg-black rounded-xl overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 border-2 border-primary-500 rounded-xl m-8 opacity-50" />
        </div>
      )}
    </div>
  )
}
