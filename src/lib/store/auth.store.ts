import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
  email: string | null
  otp: string | null
  setEmail: (email: string) => void
  setOtp: (otp: string) => void
  clearEmail: () => void
  clearOtp: () => void
  clearAll: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      email: null,
      otp: null,
      setEmail: (email) => set({ email }),
      setOtp: (otp) => set({ otp }),
      clearEmail: () => set({ email: null }),
      clearOtp: () => set({ otp: null }),
      clearAll: () => set({ email: null, otp: null }),
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
) 