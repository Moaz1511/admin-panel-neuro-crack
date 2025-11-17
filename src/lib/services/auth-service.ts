import { getRequest, postRequest } from "@/lib/api/api-caller"
import { ApiEndpoints } from "@/lib/api/api-endpoints"
import type {
  LoginData,
  LoginResponse,
  RegisterData,
  RegisterResponse,
  User,
} from "@/lib/types/auth-types"
import { useAuthStore } from "../store/auth-store"

const isServer = typeof window === 'undefined'

/**
 * Authentication Service
 * Handles all authentication-related operations
 */
export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await postRequest<RegisterResponse, RegisterData>(ApiEndpoints.auth.register, data)
      if (response.data?.accessToken) {
        useAuthStore.getState().setToken(response.data.accessToken)
        useAuthStore.getState().setUser(response.data.user)
      }

      return response
    } catch (error) {
      throw error
    }
  }

  /**
   * Login user
   */
  static async login(data: LoginData): Promise<LoginResponse> {
    try {
      const response = await postRequest<LoginResponse, LoginData>(ApiEndpoints.auth.login, data)
      console.log("API Response (Login):", response);

      if (response.data?.accessToken) {
        useAuthStore.getState().setToken(response.data.accessToken)
        useAuthStore.getState().setUser(response.data.user)
      }

      return response
    } catch (error) {
      throw error
    }
  }

  /**
   * Logout user
   */
  static logout(): void {
    useAuthStore.getState().clearAuth()
    // The refresh token cookie will be cleared by the backend
  }

  /**
   * Verify email address
   */
  static async verifyEmail(token: string): Promise<void> {
    try {
      await postRequest<void, { token: string }>(ApiEndpoints.auth.verifyEmail, { token })
    } catch (error) {
      throw error
    }
  }

  /**
   * Send forgot password email
   */
  static async forgotPassword(email: string): Promise<void> {
    try {
      await postRequest<void, { email: string }>(ApiEndpoints.auth.forgotPassword, { email })
    } catch (error) {
      throw error
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
    try {
      await postRequest<void, { email: string, otp: string, newPassword: string }>(ApiEndpoints.auth.resetPassword, { email, otp, newPassword })
    } catch (error) {
      throw error
    }
  }

  /**
   * Get user profile
   */
  static async getProfile(): Promise<User> {
    try {
      const token = this.getAccessToken()
      if (!token) throw new Error('Not authenticated')
      
      const response = await getRequest<{ success: boolean, data: User }>(ApiEndpoints.auth.profile)
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch user profile')
      }
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Get the access token
   */
  static getAccessToken(): string | null {
    if (isServer) return null
    return useAuthStore.getState().token
  }

  /**
   * Verify OTP code
   */
  static async verifyOtp(email: string, otp: string): Promise<void> {
    try {
      await postRequest<void, { email: string, otp: string }>(ApiEndpoints.auth.verifyOtp, { email, otp })
    } catch (error) {
      throw error
    }
  }
}