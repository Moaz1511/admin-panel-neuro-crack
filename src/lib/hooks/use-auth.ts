"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/services/auth-service"
import type {
  AuthState,
  LoginData,
  RegisterData,
  LoginResponse,
  RegisterResponse,
} from "@/lib/types/auth-types"
import { toast } from "sonner"
import { AppConstants } from "@/lib/utils/app-constants"

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
}

/**
 * Custom hook for authentication state and operations
 * Provides a centralized way to manage authentication in components
 */
export function useAuth() {
  const router = useRouter()
  const [state, setState] = useState<AuthState>(initialState)

  // Initialize auth state
  useEffect(() => {
    try {
      const token = AuthService.getAccessToken()
      setState({
        user: null, // We'll implement user fetching later
        token,
        isAuthenticated: !!token,
        isLoading: false,
      })
    } catch (error) {
      console.error('Error initializing auth state:', error)
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  /**
   * Register a new user
   */
  const register = async (data: RegisterData): Promise<RegisterResponse> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }))
      const response = await AuthService.register(data)
      setState(prev => ({ ...prev, isLoading: false }))
      return response
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  /**
   * Log in a user
   */
  const login = async (data: LoginData): Promise<LoginResponse> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }))
      const response = await AuthService.login(data)

      if (response.success && response.data?.accessToken) {
        setState({
          user: null, // We'll implement user fetching later
          token: response.data.accessToken,
          isAuthenticated: true,
          isLoading: false,
        })
        
        toast.success("Login successful!")
        router.replace(AppConstants.routes.home)
      }

      return response
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  /**
   * Log out the current user
   */
  const logout = () => {
    AuthService.logout()
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    })
    router.replace(AppConstants.routes.login)
  }

  return {
    ...state,
    register,
    login,
    logout,
  }
} 