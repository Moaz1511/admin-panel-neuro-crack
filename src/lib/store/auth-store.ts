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
  _hasHydrated: boolean; // <-- Add this
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  setHasHydrated: (state: boolean) => void; // <-- Add this
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      user: null,
      role: null,
      _hasHydrated: false, // <-- Add this
      setToken: (token: string) => {
        const decodedToken: { role: 'admin' | 'user' } = jwtDecode(token);
        set({ token, isAuthenticated: true, role: decodedToken.role });
      },
      setUser: (user: User) => set({ user }),
      clearAuth: () => set({ token: null, isAuthenticated: false, user: null, role: null }),
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }), // <-- Add this
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Add this onRehydrateStorage callback
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);