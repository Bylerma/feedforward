import { create } from 'zustand'
import type { Listing } from '@/types'

interface ListingState {
  listings: Listing[]
  activeListing: Listing | null
  setListings: (listings: Listing[]) => void
  addListing: (listing: Listing) => void
  updateListing: (id: string, updates: Partial<Listing>) => void
  removeListing: (id: string) => void
  setActiveListing: (listing: Listing | null) => void
}

export const useListingStore = create<ListingState>((set, get) => ({
  listings: [],
  activeListing: null,
  setListings: (listings) => set({ listings }),
  addListing: (listing) => set((state) => ({ listings: [...state.listings, listing] })),
  updateListing: (id, updates) =>
    set((state) => ({
      listings: state.listings.map((l) => (l.id === id ? { ...l, ...updates } : l)),
      activeListing:
        state.activeListing?.id === id
          ? { ...state.activeListing, ...updates }
          : state.activeListing,
    })),
  removeListing: (id) =>
    set((state) => ({
      listings: state.listings.filter((l) => l.id !== id),
    })),
  setActiveListing: (listing) => set({ activeListing: listing }),
}))
