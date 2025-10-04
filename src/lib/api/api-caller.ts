import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { toast } from "sonner"
import { AppConstants } from '@/lib/utils/app-constants'

// Log current environment (this will help verify)
console.log('Current NODE_ENV:', process.env.NODE_ENV)

interface ApiResponse {
  success: boolean
  message: string
  data?: any
  error?: {
    code?: string
  }
}

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: AppConstants.api.baseUrl,
  timeout: AppConstants.api.timeout,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

// Add request interceptor to add token to headers
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle API errors
const handleApiError = (error: AxiosError<ApiResponse>) => {
  // Handle network errors
  if (!error.response) {
    const message = !navigator.onLine 
      ? 'No internet connection' 
      : 'Unable to connect to server'
    toast.error(message)
    return Promise.reject(error)
  }

  // Get error message from response
  const message = error.response.data?.message || 'Something went wrong'
  
  // Skip toast for specific routes that handle their own errors
  const skipToastRoutes = [
    '/auth/login',
    '/auth/verify-otp',
    '/auth/forgot-password',
    '/auth/update-password'
  ]
  
  const currentUrl = error.config?.url
  const shouldSkipToast = currentUrl && skipToastRoutes.some(route => currentUrl.endsWith(route))
  
  if (!shouldSkipToast) {
    toast.error(message)
  }

  return Promise.reject(error)
}

// Add response interceptor for error handling and token refresh
axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as any
    const errorCode = error.response?.data?.error?.code
    const isLoginRoute = originalRequest?.url?.endsWith('/auth/login')
    
    // Only attempt token refresh for token-related 401s
    if (
      error.response?.status === 401 && 
      !errorCode && // No specific error code means it's likely a token issue
      !originalRequest._retry &&
      !originalRequest.url?.includes('/refresh-token') && // Prevent refresh token loop
      !isLoginRoute // Don't attempt refresh on login route
    ) {
      originalRequest._retry = true
      
      try {
        // Call refresh token endpoint
        const response = await axiosInstance.post('/auth/refresh-token')
        const newAccessToken = response.data.accessToken
        
        // Store new access token
        localStorage.setItem('access_token', newAccessToken)
        
        // Update original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        
        // Retry original request
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // Clear token and redirect on refresh failure
        localStorage.removeItem('access_token')
        if (!isLoginRoute && typeof window !== 'undefined') {
          window.location.href = AppConstants.routes.login
        }
        return handleApiError(refreshError as AxiosError<ApiResponse>)
      }
    }

    return handleApiError(error)
  }
)

// Request helpers
export const getRequest = async <T>(url: string): Promise<T> => {
  try {
    return await axiosInstance.get(url)
  } catch (error) {
    throw error
  }
}

export const postRequest = async <T>(url: string, body: any): Promise<T> => {
  try {
    return await axiosInstance.post(url, body)
  } catch (error) {
    throw error
  }
}

export const putRequest = async <T>(url: string, body: any): Promise<T> => {
  try {
    return await axiosInstance.put(url, body)
  } catch (error) {
    throw error
  }
}

export const patchRequest = async <T>(url: string, body: any): Promise<T> => {
  try {
    return await axiosInstance.patch(url, body)
  } catch (error) {
    throw error
  }
}

export const deleteRequest = async <T>(url: string): Promise<T> => {
  try {
    return await axiosInstance.delete(url)
  } catch (error) {
    throw error
  }
} 