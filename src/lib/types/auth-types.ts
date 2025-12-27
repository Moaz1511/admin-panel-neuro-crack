/**
 * User interface
 * Represents the structure of a user in the application
 */
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user' | 'QAC'
  // Add other user fields as needed
}

/**
 * Registration data interface
 * Data required to register a new user
 */
export interface RegisterData {
  email: string
  password: string
  name: string
  role: 'admin' | 'user' | 'QAC'
  // Add other registration fields as needed
}

/**
 * Login data interface
 * Data required to log in a user
 */
export interface LoginData {
  email: string
  password: string
}

/**
 * Generic API response interface
 */
export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
}

/**
 * Auth token response interface
 */
export interface AuthTokenResponse {
  accessToken: string;
  user: User;
}

/**
 * Auth state interface
 * Represents the authentication state in the application
 */
export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isAuthLoading: boolean
}

export type LoginResponse = ApiResponse<AuthTokenResponse>
export type RegisterResponse = ApiResponse<AuthTokenResponse>