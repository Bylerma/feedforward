<<<<<<< HEAD
# feedforward
=======
# FeedForward

> Turn Surplus into Sustenance — and Revenue.

A real-time digital platform connecting restaurants, hotels, supermarkets, and corporate partners with NGOs and volunteers to rescue surplus food and deliver it to communities in need — all in under 90 minutes. FeedForward includes a built-in advertising marketplace that turns every food rescue run into a brand marketing opportunity.

---

## Table of Contents

- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [How It Works](#how-it-works)
- [Business Model](#business-model)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Roadmap](#roadmap)

---

## The Problem

Every day, tons of perfectly edible surplus food from restaurants, hotels, supermarkets, and corporate cafeterias goes to waste. Simultaneously, millions of people face food insecurity. The gap isn't supply — it's logistics.

**Key challenges:**
- Food businesses lack a real-time channel to list surplus food
- NGOs and community kitchens can't easily discover available donations
- Volunteers have no structured way to find and execute rescue missions
- Verification of pickups and deliveries is manual and unreliable
- Contributors have no incentive beyond CSR to participate

---

## The Solution

FeedForward is an end-to-end food rescue platform that:

1. Lets food contributors list surplus food in under 30 seconds
2. Uses an AI-powered matching engine to pair donations with nearby NGOs
3. Dispatches verified volunteers for pickup and delivery within 90 minutes
4. Uses QR code scanning to verify every handoff (supplier → volunteer → NGO)
5. Logs impact automatically (meals rescued, CO₂ saved, water conserved)
6. **Monetizes via a built-in ad marketplace** — contributors can run ad campaigns across the platform and on physical food packaging, turning food rescue into a marketing channel

---

## How It Works

```
01 ────────── 02 ────────── 03 ────────── 04 ────────── 05
Supplier     AI            Volunteer    Impact       Brand
Posts        Matches       Delivers     Logged       Promoted
```

| Step | Name | Description |
|------|------|-------------|
| 01 | **Supplier Posts** | Hotels, restaurants, and supermarkets list surplus food with pickup details, quantity, and pickup window |
| 02 | **AI Matches** | The matching engine finds the nearest NGO based on location and dispatches an available volunteer |
| 03 | **Volunteer Delivers** | Volunteer picks up the food (QR-verified), delivers to the NGO, and gets QR confirmation at both ends |
| 04 | **Impact Logged** | Meals rescued, carbon emissions saved, and water conserved are automatically calculated and recorded |
| 05 | **Brand Promoted** | Contributors run targeted ad campaigns on the platform and on packaging, visible during every delivery |

---

## Business Model

FeedForward operates on an **advertising marketplace** model layered on top of the core food rescue infrastructure. The food rescue platform itself is free for all participants.

### Platform Ads

Contributors (restaurants, hotels, supermarkets, corporate partners) can purchase ad placements on the FeedForward website.

| Placement | Location | Reach |
|-----------|----------|-------|
| **Landing Page** | Hero section & supporting partners area | All website visitors |
| **Dashboards** | Supplier, volunteer, NGO, and corporate dashboards | Logged-in users across all roles |
| **Partner Portals** | In-context placements throughout the platform | Active food rescue participants |

**Pricing model:** CPM (cost per thousand impressions) or CPC (cost per click). Contributors set a budget and campaign duration. Impressions and clicks are tracked in real-time.

### Packaging Ads

Every food package delivered through FeedForward carries sponsor branding. This is a **physical advertising channel**:

- When a volunteer picks up food, the QR-code label includes sponsor branding
- Recipients (NGOs, communities) see the sponsor message during delivery verification
- Each package becomes a billboard in the hands of a community

**Value proposition:** "Not just a donation — a moment of brand visibility in front of the people you're helping."

### Ad Dashboard

Contributors manage their entire ad program from a self-serve dashboard at `/supplier/ads`:

- Create and manage ad campaigns
- Upload ad creative (image, link, placement preference)
- Choose between platform ads, packaging ads, or both
- Set budget and campaign duration
- View real-time impressions, clicks, and spend
- Pause or activate campaigns instantly

### Why This Works

1. **Aligned incentives** — Contributors already have a logistics need (disposing of surplus). Ads turn a cost center into a marketing channel.
2. **Captive audience** — Volunteers, NGOs, and recipients are all actively engaged with the platform during food rescue operations.
3. **Measurable impact** — Every impression and click is tracked. Contributors know exactly what they're paying for.
4. **Physical + digital** — Packaging ads reach recipients at the moment of impact; platform ads reach the broader community.

---

## Features

### Core Platform

- **Real-time listing** — Post surplus food in under 30 seconds
- **AI matching engine** — Automatically matches donations with nearby NGOs
- **Volunteer dispatch** — Assigns available volunteers for pickup and delivery
- **QR code verification** — Scanned at both pickup and delivery to prevent fraud
- **Impact tracking** — Automatic calculation of meals rescued, CO₂ saved, water conserved
- **Points & gamification** — Volunteers earn points and badges for completed runs
- **Role-based dashboards** — Separate views for suppliers, volunteers, NGOs, and corporate partners
- **Real-time notifications** — Push notifications for match alerts, status updates, and more
- **Map integration** — Interactive map showing available pickups and volunteer locations (Mapbox)
- **Impact leaderboards** — Track top volunteers and contributors

### Advertising Platform

- **Ad campaign management** — Create, edit, pause, and delete campaigns
- **Multi-placement** — Choose website banners, packaging labels, or both
- **Target pages** — Select which pages display your ad
- **Budget controls** — Set campaign budget with real-time spend tracking
- **Performance metrics** — Impressions and clicks tracked per campaign
- **Rotation** — Multiple active ads rotate automatically every 8 seconds

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **State Management** | Zustand |
| **Forms** | React Hook Form + Zod |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (SSR) |
| **Maps** | Mapbox GL JS |
| **Charts** | Recharts |
| **QR Codes** | qrcode.react, html5-qrcode |
| **Animations** | Framer Motion |
| **Fonts** | Inter, Sora, JetBrains Mono |
| **Hosting** | Vercel |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Login, signup, onboarding
│   │   ├── login/
│   │   ├── signup/
│   │   └── onboard/
│   ├── api/
│   │   ├── ads/             # Ad campaign CRUD
│   │   ├── auth/            # Auth callbacks & signout
│   │   ├── dispatch/        # Volunteer dispatch engine
│   │   ├── impact/          # Impact logs & global stats
│   │   ├── listings/        # Food listing CRUD
│   │   ├── match/           # AI matching engine
│   │   ├── verify/          # QR verification
│   │   └── volunteer/       # Claim & complete runs
│   ├── corporate/           # Corporate partner dashboards
│   ├── ngo/                 # NGO dashboards
│   ├── supplier/            # Supplier dashboards
│   │   ├── ads/             # Ad campaign management
│   │   ├── dashboard/       # Main supplier dashboard
│   │   ├── history/         # Past listings & impact
│   │   └── post/            # Post new surplus
│   ├── volunteer/           # Volunteer dashboards & runs
│   ├── layout.tsx           # Root layout with AuthProvider
│   └── page.tsx             # Landing page
├── components/
│   ├── ads/                 # AdDisplay & PackagingAd components
│   ├── dashboard/           # ActiveListings, ImpactWidget, CarbonChart, RunTimeline
│   ├── forms/               # ListingForm, ProfileForm
│   ├── layout/              # Navbar, Sidebar, MobileNav, AuthProvider
│   ├── map/                 # MapContainer, PickupMarker, RouteLayer, VolunteerMarker
│   ├── qr/                  # QRDisplay, QRScanner
│   └── ui/                  # Button, Card, Badge, Modal, StatusPill, ImpactCounter
├── hooks/                   # useGeolocation, useImpact, useRealtime
├── lib/
│   ├── impact/              # Impact calculation utilities
│   ├── mapbox/              # Mapbox directions & geocoding
│   ├── qr/                  # QR token generation
│   ├── realtime/            # Supabase realtime channel setup
│   └── supabase/            # Client, server, and middleware clients
├── store/                   # Zustand stores (auth, listing, run)
├── types/                   # TypeScript interfaces
└── middleware.ts            # Next.js middleware for auth & role routing
```

---

## Database Schema

### Tables

**users** — All platform users (suppliers, volunteers, NGOs, corporate)
- `id` UUID PK, `auth_id` UUID FK → auth.users, `role` TEXT (supplier/ngo/volunteer/corporate), `name`, `org_name`, `email`, `phone`, `location` GEOGRAPHY, `points`, `badges`, `is_verified`, timestamps

**listings** — Surplus food listings
- `id` UUID PK, `supplier_id` UUID FK → users, `food_type`, `food_category`, `quantity`, `pickup_window` TSTZRANGE, `pickup_location` GEOGRAPHY, `pickup_address`, `status`, `qr_token`, timestamps

**matches** — Food rescue matches between listings, NGOs, and volunteers
- `id` UUID PK, `listing_id` UUID FK → listings, `ngo_id` UUID FK → users, `volunteer_id` UUID FK → users, `status`, scan timestamps, timestamps

**impact_logs** — Environmental & social impact records
- `id` UUID PK, `match_id` UUID FK → matches, `supplier_id`, `ngo_id`, `volunteer_id`, `meals_rescued`, `food_weight_kg`, `carbon_saved_kg`, `water_saved_l`, `points_awarded`, timestamp

**ads** — Ad campaigns run by contributors
- `id` UUID PK, `supplier_id` UUID FK → users, `title`, `image_url`, `link_url`, `placement` (website/packaging/both), `target_page`, `impressions`, `clicks`, `budget`, `is_active`, start/end timestamps

**notifications** — Push notifications
- `id` UUID PK, `user_id` UUID FK → users, `type`, `title`, `body`, `data` JSONB, `is_read`, timestamp

**corporate_sponsors** — Corporate partnership records
- `id` UUID PK, `corporate_id` UUID FK → users, `sponsored_runs` UUID[], `budget_inr`, `spent_inr`, CSR goals

### Row Level Security

RLS is enabled on: listings, matches, impact_logs, notifications, ads
- Suppliers can only access their own listings and ads
- Volunteers can read available listings
- NGOs can read their matched listings
- Impact logs are visible to participants
- Notifications are user-scoped

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm / yarn / pnpm / bun
- Supabase project (free tier works)
- Mapbox account (for map features)

### Installation

```bash
git clone <repo-url>
cd feedforward
npm install
```

### Environment Setup

Copy `.env.local.example` to `.env.local` and fill in your values:

```env
# Supabase (get these from your project dashboard → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Mapbox (get from mapbox.com)
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_mapbox_token

# QR Code Security (generate a random 32-char string)
QR_SECRET=your_super_secret_32char_string

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Firebase (for push notifications, optional)
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key
FIREBASE_SERVICE_ACCOUNT={}
```

### Database Setup

Run the migration files in your Supabase SQL editor in order:

1. `supabase/migrations/001_initial_schema.sql` — Core tables
2. `supabase/migrations/002_rls_policies.sql` — RLS policies & auth trigger
3. `supabase/migrations/003_ads_schema.sql` — Ads table & policies

Also ensure in your Supabase dashboard → Authentication → URL Configuration:
- **Site URL**: `https://your-domain.vercel.app` (or `http://localhost:3000` for dev)
- **Redirect URLs**: Add `https://your-domain.vercel.app/api/auth/callback`

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Yes | Mapbox public token for map rendering |
| `QR_SECRET` | Yes | Secret for signing QR tokens (32+ chars) |
| `NEXT_PUBLIC_APP_URL` | Yes | Public URL of the app |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | No | Firebase VAPID for push notifications |
| `FIREBASE_SERVICE_ACCOUNT` | No | Firebase service account JSON |
| `SENTRY_DSN` | No | Sentry error tracking DSN |
| `RESEND_API_KEY` | No | Resend API key for transactional emails |

---

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel login
vercel
```

For production:

```bash
vercel --prod
```

Add all environment variables from the table above to your Vercel project settings.

### Supabase

Ensure all migrations are applied in your Supabase SQL editor. Configure Authentication settings:
- Enable email confirmations or disable as needed
- Set Site URL to your production domain
- Add redirect URLs for auth callbacks

---

## Roadmap

### Phase 1 — Core Infrastructure ✓
- [x] User authentication & role-based routing
- [x] Food listing creation with QR tokens
- [x] Volunteer dispatch & run management
- [x] QR-based pickup/delivery verification
- [x] Impact tracking & leaderboards
- [x] Real-time notifications
- [x] Map integration for listing discovery

### Phase 2 — Advertising Platform ✓
- [x] Ad campaign CRUD (supplier dashboard)
- [x] Website ad placements (landing page, dashboards)
- [x] Packaging ad placements (delivery flow)
- [x] Impression & click tracking
- [x] Campaign budget & targeting
- [x] Ad rotation across placements

### Phase 3 — Growth & Optimization
- [ ] Automated email/SMS notifications for match alerts
- [ ] Advanced AI matching with ETA predictions
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Payment gateway integration for ad spend
- [ ] Automated ad billing & invoicing
- [ ] Analytics dashboard (ad ROI, conversion tracking)
- [ ] Partner API for third-party integrations
- [ ] Gamification leaderboard with rewards
- [ ] Admin dashboard for platform-wide moderation

---

## License

MIT

---

*Built with Next.js, Supabase, and a mission to turn surplus into sustenance.*
>>>>>>> b4f4c84 (Initial commit: FeedForward - Surplus food rescue platform with ad marketplace)
