import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import type { UserProfile } from '@/types';

interface AuthState {
  session: Session | null;
  profile: UserProfile | null;
  setSession: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  profile: null,
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
}));

interface FiltersState {
  category: string | null;
  size: string | null;
  maxPrice: number | null;
  maxDistanceKm: number | null;
  setCategory: (category: string | null) => void;
  setSize: (size: string | null) => void;
  setMaxPrice: (price: number | null) => void;
  setMaxDistanceKm: (distance: number | null) => void;
}

export const useFiltersStore = create<FiltersState>((set) => ({
  category: null,
  size: null,
  maxPrice: null,
  maxDistanceKm: null,
  setCategory: (category) => set({ category }),
  setSize: (size) => set({ size }),
  setMaxPrice: (maxPrice) => set({ maxPrice }),
  setMaxDistanceKm: (maxDistanceKm) => set({ maxDistanceKm }),
}));
