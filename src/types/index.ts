export type UserRole = 'supplier' | 'ngo' | 'volunteer' | 'corporate'

export type FoodCategory = 'cooked' | 'raw' | 'packaged' | 'bakery' | 'dairy' | 'produce'

export type ListingStatus =
  | 'available'
  | 'matched'
  | 'claimed'
  | 'picked_up'
  | 'delivered'
  | 'cancelled'
  | 'expired'

export type MatchStatus =
  | 'pending'
  | 'volunteer_assigned'
  | 'supplier_verified'
  | 'ngo_verified'
  | 'completed'
  | 'failed'

export interface User {
  id: string
  auth_id: string
  role: UserRole
  name: string
  org_name?: string
  email: string
  phone?: string
  avatar_url?: string
  location_text?: string
  location: { lat: number; lng: number }
  address?: {
    street?: string
    city?: string
    state?: string
    pincode?: string
  }
  points: number
  badges: string[]
  rank?: number
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Listing {
  id: string
  supplier_id: string
  food_type: string
  food_category: FoodCategory
  quantity: number
  quantity_unit: 'servings' | 'kg'
  description?: string
  pickup_window: { start: string; end: string }
  pickup_location: { lat: number; lng: number }
  pickup_address: string
  image_url?: string
  status: ListingStatus
  qr_token?: string
  created_at: string
  updated_at: string
}

export interface Match {
  id: string
  listing_id: string
  ngo_id: string
  volunteer_id?: string
  status: MatchStatus
  claimed_at?: string
  supplier_scanned_at?: string
  ngo_scanned_at?: string
  completed_at?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface ImpactLog {
  id: string
  match_id: string
  supplier_id: string
  ngo_id: string
  volunteer_id?: string
  meals_rescued: number
  food_weight_kg: number
  carbon_saved_kg: number
  water_saved_l?: number
  points_awarded: number
  timestamp: string
}

export interface CorporateSponsor {
  id: string
  corporate_id: string
  sponsored_runs: string[]
  budget_inr?: number
  spent_inr: number
  csr_goal_meals?: number
  csr_goal_carbon?: number
  report_emails: string[]
  created_at: string
}

export type AdPlacement = 'website' | 'packaging' | 'both'

export interface Ad {
  id: string
  supplier_id: string
  title: string
  image_url: string
  link_url?: string
  placement: AdPlacement
  target_page?: string
  impressions: number
  clicks: number
  budget?: number
  is_active: boolean
  starts_at: string
  ends_at?: string
  created_at: string
  updated_at: string
  supplier?: { name: string; org_name?: string }
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  body?: string
  data?: Record<string, unknown>
  is_read: boolean
  created_at: string
}

export interface QRPayload {
  listing_id: string
  supplier_id: string
  type: 'supplier' | 'ngo'
  expires_at: string
  iat: number
  exp: number
}

export interface CreateListingInput {
  food_type: string
  food_category: FoodCategory
  quantity: number
  quantity_unit: 'servings' | 'kg'
  description?: string
  pickup_window_start: string
  pickup_window_end: string
  pickup_address: string
  image_url?: string
}

export interface VerifyInput {
  qr_token: string
  stage: 'pickup' | 'delivery'
  volunteer_id: string
  match_id: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface ImpactMetrics {
  meals_rescued: number
  food_weight_kg: number
  carbon_saved_kg: number
  points_awarded: number
}

export interface ImpactSummary {
  total_meals: number
  total_carbon_kg: number
  total_food_kg: number
  total_runs: number
  total_points: number
}

export interface LeaderboardEntry {
  id: string
  name: string
  avatar_url?: string
  points: number
  badges: string[]
  total_runs: number
  total_meals: number
  rank: number
}
