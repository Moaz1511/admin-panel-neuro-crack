/**
 * Custom error class for application-specific errors
 * Extends the built-in Error class with additional properties
 */
export class AppError extends Error {
  errors?: Record<string, string[]>

  constructor(
    message: string,
    public code: string,
    public status: number
  ) {
    super(message)
    this.name = 'AppError'
  }
}

/**
 * Error codes enum
 * Centralized place for all error codes used in the application
 */
export enum ErrorCode {
  API_ERROR = 'API_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Error handler utility
 * Provides methods for consistent error handling across the application
 */
export const errorHandler = {
  /**
   * Handle any type of error and convert it to AppError
   */
  handle: (error: unknown): AppError => {
    if (error instanceof AppError) {
      return error
    }

    if (error instanceof Error) {
      return new AppError(
        error.message,
        ErrorCode.UNKNOWN_ERROR,
        500
      )
    }

    return new AppError(
      'An unexpected error occurred',
      ErrorCode.UNKNOWN_ERROR,
      500
    )
  },

  /**
   * Create a validation error
   */
  validation: (message: string, errors?: Record<string, string[]>): AppError => {
    const error = new AppError(
      message,
      ErrorCode.VALIDATION_ERROR,
      400
    )
    error.errors = errors
    return error
  },

  /**
   * Create an authentication error
   */
  authentication: (message: string): AppError => {
    return new AppError(
      message,
      ErrorCode.AUTHENTICATION_ERROR,
      401
    )
  }
} 