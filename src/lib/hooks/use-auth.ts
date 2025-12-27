"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/services/auth-service"
import type {
  LoginData,
  RegisterData,
  LoginResponse,
  RegisterResponse,
  User,
} from "@/lib/types/auth-types"
import { toast } from "sonner"
import { AppConstants } from "@/lib/utils/app-constants"
import { useAuthStore } from "../store/auth-store"

/**
 * Custom hook for authentication state and operations
 * Provides a centralized way to manage authentication in components
 */
export function useAuth() {
  const router = useRouter()
  const { 
    token, 
    user, 
    role, 
    setToken, 
    setUser, 
    clearAuth, 
    isAuthenticated, 
    _hasHydrated 
  } = useAuthStore();
  const [isApiLoading, setIsApiLoading] = useState(false); // Local loading state for API calls

  // This is the single source of truth for auth loading state.
  // It's true if the store hasn't rehydrated yet, or if an API call is in progress.
  const isAuthLoading = !_hasHydrated || isApiLoading;

  /**
   * Register a new user
   */
  const register = async (data: RegisterData): Promise<RegisterResponse> => {
    try {
      setIsApiLoading(true);
      const response = await AuthService.register(data);
      setIsApiLoading(false);
      if (response.success && response.data?.accessToken) {
        setToken(response.data.accessToken);
        setUser(response.data.user); 
        toast.success("Registration successful!");
        router.replace(AppConstants.routes.home);
      }
      return response;
    } catch (error) {
      setIsApiLoading(false);
      throw error;
    }
  };

  /**
   * Log in a user
   */
  const login = async (data: LoginData): Promise<LoginResponse> => {
    try {
      setIsApiLoading(true);
      const response = await AuthService.login(data);
      setIsApiLoading(false);

      if (response.success && response.data?.accessToken) {
        setToken(response.data.accessToken);
        setUser(response.data.user); 
        toast.success("Login successful!");
        router.replace(AppConstants.routes.home);
      }

      return response;
    } catch (error) {
      setIsApiLoading(false);
      throw error;
    }
  };

  /**
   * Log out the current user
   */
  const logout = async () => {
    try {
      setIsApiLoading(true);
      await AuthService.logout();
      clearAuth(); // Should already be cleared by service, but double check
      toast.info("Logged out successfully!");
      router.replace(AppConstants.routes.login);
    } catch (error) {
       // Force logout on UI even if backend fails
       clearAuth();
       router.replace(AppConstants.routes.login);
    } finally {
      setIsApiLoading(false);
    }
  };

  return {
    token,
    isAuthenticated,
    user,
    role,
    isAuthLoading,
    register,
    login,
    logout,
  };
}