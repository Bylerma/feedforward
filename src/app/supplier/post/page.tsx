'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { ListingForm } from '@/components/forms/ListingForm'

export default function PostListingPage() {
  const router = useRouter()

  const handleSubmit = async (data: any) => {
    const { error } = await supabase.from('listings').insert({
      food_type: data.food_type,
      food_category: data.food_category,
      quantity: data.quantity,
      quantity_unit: data.quantity_unit,
      description: data.description,
      pickup_window: `[${data.pickup_window_start}, ${data.pickup_window_end}]`,
      pickup_address: data.pickup_address,
      status: 'available',
    })

    if (!error) {
      router.push('/supplier/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Post Surplus Food</h1>
            <p className="text-sm text-slate-500 mb-8">List surplus food for pickup by volunteers</p>
            <ListingForm onSubmit={handleSubmit} />
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
