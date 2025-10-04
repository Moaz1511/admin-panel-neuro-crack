import { getRequest, postRequest } from "@/lib/api/api-caller"
import { ApiEndpoints } from "@/lib/api/api-endpoints"
import type {
  LoginData,
  LoginResponse,
  RegisterData,
  RegisterResponse,
  User,
} from "@/lib/types/auth-types"
import { redirect } from "next/navigation"

const isServer = typeof window === 'undefined'

/**
 * Authentication Service
 * Handles all authentication-related operations
 */
export class AuthService {
  private static readonly ACCESS_TOKEN_KEY = "access_token"
  private static readonly USER_KEY = "auth_user"

  /**
   * Register a new user
   */
  static async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await postRequest<RegisterResponse>(ApiEndpoints.auth.register, data)
      
      if (response?.success && response?.data?.accessToken) {
        this.setAccessToken(response.data.accessToken)
        // After registration, fetch user data
        // const user = await this.getProfile()
        // this.setUser(user)
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
      const response = await postRequest<LoginResponse>(ApiEndpoints.auth.login, data)

      if (response?.success && response?.data?.accessToken) {
        // Store token consistently
        this.setAccessToken(response.data.accessToken)
        // After login, fetch user data
        // const user = await this.getProfile()
        // this.setUser(user)
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
    this.removeAccessToken()
    this.removeUser()
    // The refresh token cookie will be cleared by the backend
  }

  /**
   * Verify email address
   */
  static async verifyEmail(token: string): Promise<void> {
    try {
      await postRequest<void>(ApiEndpoints.auth.verifyEmail, { token })
    } catch (error) {
      throw error
    }
  }

  /**
   * Send forgot password email
   */
  static async forgotPassword(email: string): Promise<void> {
    try {
      await postRequest<void>(ApiEndpoints.auth.forgotPassword, { email })
    } catch (error) {
      throw error
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
    try {
      await postRequest<void>(ApiEndpoints.auth.resetPassword, { email, otp, newPassword })
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
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    if (isServer) return false
    const token = this.getAccessToken()
    return !!token
  }

  /**
   * Get the current user
   */
  static getUser(): User | null {
    if (isServer) return null
    const user = localStorage.getItem(this.USER_KEY)
    return user ? JSON.parse(user) : null
  }

  /**
   * Get the access token
   */
  static getAccessToken(): string | null {
    if (isServer) return null
    return localStorage.getItem(this.ACCESS_TOKEN_KEY)
  }

  /**
   * Set the access token
   */
  private static setAccessToken(token: string): void {
    if (isServer) return
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token)
  }

  /**
   * Set the current user
   */
  private static setUser(user: User): void {
    if (isServer) return
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))
  }

  /**
   * Remove the access token
   */
  private static removeAccessToken(): void {
    if (isServer) return
    localStorage.removeItem(this.ACCESS_TOKEN_KEY)
  }

  /**
   * Remove the current user
   */
  private static removeUser(): void {
    if (isServer) return
    localStorage.removeItem(this.USER_KEY)
  }

  /**
   * Verify OTP code
   */
  static async verifyOtp(email: string, otp: string): Promise<void> {
    try {
      await postRequest<void>(ApiEndpoints.auth.verifyOtp, { email, otp })
    } catch (error) {
      throw error
    }
  }
} 