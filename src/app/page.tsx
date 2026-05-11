import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ImpactCounter } from '@/components/ui/ImpactCounter'
import { AdDisplay } from '@/components/ads/AdDisplay'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <nav className="absolute top-0 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🍱</span>
              <span className="font-display text-xl font-bold text-primary-600">FeedForward</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
              Turn Surplus into
              <span className="text-primary-600"> Sustenance</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
              A real-time platform connecting restaurants, hotels, and supermarkets with NGOs and volunteers to rescue surplus food and deliver it to communities in need — all in under 90 minutes.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Rescuing Food
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  I&apos;m a Partner
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { value: 12000, suffix: 'Meals Rescued', icon: '🍱' },
              { value: 5800, suffix: 'kg CO₂ Saved', icon: '🌿' },
              { value: 450, suffix: 'Active Volunteers', icon: '🤝' },
              { value: 180, suffix: 'Partner Outlets', icon: '🏪' },
            ].map((stat) => (
              <div key={stat.suffix} className="text-center p-4 bg-white/80 backdrop-blur rounded-xl border border-slate-200">
                <p className="text-2xl">{stat.icon}</p>
                <p className="mt-1 font-mono text-2xl font-bold text-slate-900">{stat.value.toLocaleString()}+</p>
                <p className="text-sm text-slate-500">{stat.suffix}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-slate-900 text-center">
            How It Works
          </h2>
          <div className="mt-16 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              { step: '01', title: 'Supplier Posts', desc: 'Hotels and restaurants list surplus food with pickup details' },
              { step: '02', title: 'AI Matches', desc: 'Our engine finds the nearest NGO and dispatches a volunteer' },
              { step: '03', title: 'Volunteer Delivers', desc: 'QR-verified pickup and delivery in under 90 minutes' },
              { step: '04', title: 'Impact Logged', desc: 'Meals rescued and carbon saved are automatically recorded' },
              { step: '05', title: 'Brand Promoted', desc: 'Contributors run ads on-platform & on packaging to reach their audience' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="font-display text-lg font-bold text-primary-600">{item.step}</span>
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full mb-4">
              Business Model
            </span>
            <h2 className="font-display text-3xl font-bold text-slate-900">
              Turn Surplus into <span className="text-primary-600">Revenue</span>
            </h2>
            <p className="mt-4 text-slate-600">
              Every food rescue run doubles as a marketing opportunity. Promote your brand across our platform and on every package delivered.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📢',
                title: 'Platform Ads',
                desc: 'Display your brand on the FeedForward website — landing page, dashboards, and partner portals. Reach volunteers, NGOs, and food businesses actively working to reduce waste.',
                metric: '450+ weekly active users',
              },
              {
                icon: '📦',
                title: 'Packaging Ads',
                desc: 'Every food package delivered carries your ad. Volunteers scan QR-coded packages in front of recipients — your brand is seen at the moment of impact.',
                metric: '12,000+ meals delivered',
              },
              {
                icon: '📊',
                title: 'Ad Dashboard',
                desc: 'Manage all your campaigns from a single dashboard. Track impressions, clicks, and budget spend in real-time. Set your target pages and placements.',
                metric: 'Self-serve control panel',
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <p className="text-3xl mb-3">{feature.icon}</p>
                <h3 className="font-semibold text-lg text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{feature.desc}</p>
                <div className="inline-block text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
                  {feature.metric}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/signup">
              <Button size="lg">Start Your Campaign</Button>
            </Link>
            <p className="text-xs text-slate-400 mt-3">Available for all food business partners</p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-slate-900 text-center">
            Built for Everyone
          </h2>
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🏨',
                title: 'Food Businesses',
                items: ['Post surplus in 30 seconds', 'Track donations in real-time', 'CSR impact reports', 'Tax benefit documentation', 'Run ad campaigns & track ROI'],
              },
              {
                icon: '🤝',
                title: 'Volunteers',
                items: ['Find nearby rescue missions', 'Earn points & badges', 'Track your impact', 'Flexible scheduling'],
              },
              {
                icon: '🏠',
                title: 'NGOs & Communities',
                items: ['Receive real-time food alerts', 'QR-verified deliveries', 'Consistent supply tracking', 'Focus on serving, not logistics'],
              },
            ].map((group) => (
              <div key={group.title} className="bg-white rounded-xl p-6 border border-slate-200">
                <p className="text-3xl mb-3">{group.icon}</p>
                <h3 className="font-semibold text-lg text-slate-900 mb-3">{group.title}</h3>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-slate-900 text-center mb-8">
            Supporting Partners
          </h2>
          <AdDisplay placement="website" targetPage="landing" />
        </div>
      </section>

      <footer className="py-12 bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-display text-lg font-bold text-white">FeedForward</p>
          <p className="mt-2 text-sm">&quot;Not a charity, but infrastructure.&quot;</p>
          <p className="mt-6 text-xs">Turning surplus into sustenance, one scan at a time.</p>
        </div>
      </footer>
    </div>
  )
}
