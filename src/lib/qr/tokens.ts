import jwt from 'jsonwebtoken'

const QR_SECRET = process.env.QR_SECRET || 'fallback-secret-do-not-use-in-production'

export function generateQRToken(payload: {
  listing_id: string
  supplier_id: string
  type: 'supplier' | 'ngo'
  expires_at: string
}): string {
  return jwt.sign(payload, QR_SECRET, { expiresIn: '4h' })
}

export function verifyQRToken(token: string) {
  return jwt.verify(token, QR_SECRET) as {
    listing_id: string
    supplier_id: string
    type: 'supplier' | 'ngo'
    expires_at: string
    iat: number
    exp: number
  }
}
