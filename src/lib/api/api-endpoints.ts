/**
 * Centralized API endpoints configuration
 * This file contains all the API endpoints used in the application
 * Making it easier to manage and update API routes
 */

// Remove trailing slash from base URL
export const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000").replace(/\/$/, '')
export const ApiEndpoints = {
  auth: {
    register: `${baseUrl}/auth/register`,
    login: `${baseUrl}/auth/login`,
    verifyEmail: `${baseUrl}/auth/verify-email`,
    forgotPassword: `${baseUrl}/auth/forgot-password`,
    resetPassword: `${baseUrl}/auth/update-password`,
    profile: `${baseUrl}/auth/profile`,
    verifyOtp: `${baseUrl}/auth/verify-otp`
  },

  classes: {
    getAll: `${baseUrl}/api/classes`,
    getById: `${baseUrl}/api/classes/`,
  },
  subjects: {
    getAll: `${baseUrl}/api/subjects`,
    getById: `${baseUrl}/api/subjects/`,
    getByCourseId: `${baseUrl}/api/subjects/course/`,
  },
  chapters: {
    getAll: `${baseUrl}/api/chapters`,
    getById: `${baseUrl}/api/chapters/`,
  },
  topics: {
    getByChapterId: `${baseUrl}/api/topics/chapter/`,
  },
  courses: {
    getAll: `${baseUrl}/api/courses`,
    getById: `${baseUrl}/api/courses/`,
  },
  quizzes: {
    base: `${baseUrl}/api/quizzes`,
    getByChapterId: `${baseUrl}/api/quizzes/chapter/`,
    getById: `${baseUrl}/api/quizzes/`,
    create: `${baseUrl}/api/quizzes`,
    update: `${baseUrl}/api/quizzes/`,
  },
  questions: {
    create: `${baseUrl}/api/quizzes/`,
    update: `${baseUrl}/api/questions/`,
    delete: `${baseUrl}/api/questions/`,
  },
  cqs: {
    update: `${baseUrl}/api/cqs/`,
    delete: `${baseUrl}/api/cqs/`,
  },

  // Add other feature endpoints here as the application grows
  // Example:
  users: {
    getAll: `${baseUrl}/api/user`,
    getById: `${baseUrl}/api/user/`,
  },
  ai: {
    uploadDocx: `${baseUrl}/api/ai/upload-docx`,
  }
} 