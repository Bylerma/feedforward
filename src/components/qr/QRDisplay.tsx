'use client'

import { QRCodeSVG } from 'qrcode.react'
import { Card } from '@/components/ui/Card'

interface QRDisplayProps {
  token: string
  role: 'supplier' | 'ngo'
  orgName?: string
}

export function QRDisplay({ token, role, orgName }: QRDisplayProps) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}&role=${role}`

  return (
    <Card className="text-center">
      <div className="mb-3">
        <p className="text-sm font-medium text-slate-700">
          {role === 'supplier' ? 'Supplier QR Code' : 'NGO QR Code'}
        </p>
        {orgName && <p className="text-xs text-slate-500">{orgName}</p>}
      </div>

      <div className="inline-flex p-3 bg-white rounded-xl border border-slate-200">
        <QRCodeSVG
          value={verifyUrl}
          size={200}
          level="H"
          fgColor="#166534"
        />
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Show this to your volunteer to scan
      </p>
    </Card>
  )
}
