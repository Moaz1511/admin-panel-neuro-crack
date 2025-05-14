/**
 * Centralized API endpoints configuration
 * This file contains all the API endpoints used in the application
 * Making it easier to manage and update API routes
 */

// Remove trailing slash from base URL
export const baseUrl = process.env.NEXT_PUBLIC_API_URL
export const acsQuizBaseUrl = process.env.NEXT_PUBLIC_ACS_QUIZ_URL
export const aiBaseUrl = process.env.NEXT_PUBLIC_AI_URL

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


  acsQuiz: {
    getCourses: `${acsQuizBaseUrl}/getCoursesByClass/`,
    getSubjects: `${acsQuizBaseUrl}/getSubjectsByCourse/`,
    getChapters: `${acsQuizBaseUrl}/getChaptersBySubject/`,
    getQuizModules: `${acsQuizBaseUrl}/getModules/`,
  },

  ai: {
    uploadDocx: `${aiBaseUrl}/upload-docx`,
  },

  // Add other feature endpoints here as the application grows
  // Example:
  // users: {
  //   profile: '/users/profile',
  //   settings: '/users/settings',
  // }
} 