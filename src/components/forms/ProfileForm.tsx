'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface ProfileFormData {
  name: string
  org_name?: string
  phone?: string
  location_text?: string
}

interface ProfileFormProps {
  defaultValues?: Partial<ProfileFormData>
  onSubmit: (data: ProfileFormData) => Promise<void>
  loading?: boolean
}

export function ProfileForm({ defaultValues, onSubmit, loading }: ProfileFormProps) {
  const { register, handleSubmit } = useForm<ProfileFormData>({
    defaultValues,
  })

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input
            {...register('name', { required: true })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Organization Name (optional)
          </label>
          <input
            {...register('org_name')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input
            {...register('phone')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
          <input
            {...register('location_text')}
            placeholder="City, State"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Save Profile
        </Button>
      </form>
    </Card>
  )
}
