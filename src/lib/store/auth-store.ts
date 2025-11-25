/**
 * WARNING: Storing JWTs in localStorage is vulnerable to XSS attacks.
 * An attacker who can inject JavaScript into the page can steal the token.
 * For production applications, it is strongly recommended to store the JWT in an HttpOnly cookie
 * to mitigate this risk. This requires backend cooperation to set the cookie upon login
 * and to read it from the request headers on subsequent requests.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { User } from '../types/auth-types';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  role: 'admin' | 'user' | null;
  email: string | null; // <-- Merged
  otp: string | null; // <-- Merged
  _hasHydrated: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  setEmail: (email: string) => void; // <-- Merged
  setOtp: (otp: string) => void; // <-- Merged
  clearAuth: () => void;
  clearEmail: () => void; // <-- Merged
  clearOtp: () => void; // <-- Merged
  clearAll: () => void; // <-- Merged
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      user: null,
      role: null,
      email: null, // <-- Merged
      otp: null, // <-- Merged
      _hasHydrated: false,
      setToken: (token: string) => {
        const decodedToken: { role: 'admin' | 'user' } = jwtDecode(token);
        set({ token, isAuthenticated: true, role: decodedToken.role });
      },
      setUser: (user: User) => set({ user }),
      setEmail: (email) => set({ email }), // <-- Merged
      setOtp: (otp) => set({ otp }), // <-- Merged
      clearAuth: () => set({ token: null, isAuthenticated: false, user: null, role: null }),
      clearEmail: () => set({ email: null }), // <-- Merged
      clearOtp: () => set({ otp: null }), // <-- Merged
      clearAll: () => set({ email: null, otp: null }), // <-- Merged
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);