'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const listingSchema = z.object({
  food_type: z.string().min(2, 'Food type is required'),
  food_category: z.enum(['cooked', 'raw', 'packaged', 'bakery', 'dairy', 'produce']),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  quantity_unit: z.enum(['servings', 'kg']),
  description: z.string().optional(),
  pickup_window_start: z.string().min(1, 'Pickup start time is required'),
  pickup_window_end: z.string().min(1, 'Pickup end time is required'),
  pickup_address: z.string().min(5, 'Address must be at least 5 characters'),
})

type ListingFormData = z.infer<typeof listingSchema>

interface ListingFormProps {
  onSubmit: (data: ListingFormData) => Promise<void>
  loading?: boolean
}

export function ListingForm({ onSubmit, loading }: ListingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
  })

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Food Type
          </label>
          <input
            {...register('food_type')}
            placeholder="e.g., Biryani, Dal Makhani"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {errors.food_type && (
            <p className="text-xs text-error mt-1">{errors.food_type.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Food Category
          </label>
          <select
            {...register('food_category')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="cooked">Cooked</option>
            <option value="raw">Raw</option>
            <option value="packaged">Packaged</option>
            <option value="bakery">Bakery</option>
            <option value="dairy">Dairy</option>
            <option value="produce">Produce</option>
          </select>
          {errors.food_category && (
            <p className="text-xs text-error mt-1">{errors.food_category.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              {...register('quantity')}
              min={1}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.quantity && (
              <p className="text-xs text-error mt-1">{errors.quantity.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Unit
            </label>
            <select
              {...register('quantity_unit')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="servings">Servings</option>
              <option value="kg">Kg</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description (optional)
          </label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Any details about the food..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Pickup Window Start
            </label>
            <input
              type="datetime-local"
              {...register('pickup_window_start')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.pickup_window_start && (
              <p className="text-xs text-error mt-1">{errors.pickup_window_start.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Pickup Window End
            </label>
            <input
              type="datetime-local"
              {...register('pickup_window_end')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.pickup_window_end && (
              <p className="text-xs text-error mt-1">{errors.pickup_window_end.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Pickup Address
          </label>
          <input
            {...register('pickup_address')}
            placeholder="Full address for pickup"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {errors.pickup_address && (
            <p className="text-xs text-error mt-1">{errors.pickup_address.message}</p>
          )}
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Post Surplus Food
        </Button>
      </form>
    </Card>
  )
}
