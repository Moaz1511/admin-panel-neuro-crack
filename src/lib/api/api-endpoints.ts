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
    verifyOtp: `${baseUrl}/auth/verify-otp`,
    logout: `${baseUrl}/auth/logout`
  },

  classes: {
    getAll: `${baseUrl}/api/classes`,
    getById: `${baseUrl}/api/classes/`,
  },
  programs: {
    getAll: `${baseUrl}/api/programs`,
    getById: `${baseUrl}/api/programs/`,
  },
  groups: {
    getAll: `${baseUrl}/api/groups`,
    getById: `${baseUrl}/api/groups/`,
    getByClassId: `${baseUrl}/api/groups/class/`,
  },
  subjects: {
    getAll: `${baseUrl}/api/subjects`,
    getById: `${baseUrl}/api/subjects/`,
    getByGroupId: `${baseUrl}/api/subjects/group/`,
  },
  chapters: {
    getAll: `${baseUrl}/api/chapters`,
    getById: `${baseUrl}/api/chapters/`,
  },
  topics: {
    getByChapterId: `${baseUrl}/api/topics/chapter/`,
  },
  quizzes: {
    base: `${baseUrl}/api/quizzes`,
    getByChapterId: `${baseUrl}/api/quizzes/chapter/`,
    getById: `${baseUrl}/api/quizzes/`,
    create: `${baseUrl}/api/quizzes`,
    update: `${baseUrl}/api/quizzes/`,
  },
  questions: {
    create: `${baseUrl}/api/questions`,
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
  },
  mediaManager: {
    files: `${baseUrl}/api/media-manager/files`,
    folder: `${baseUrl}/api/media-manager/folder`,
    file: `${baseUrl}/api/media-manager/file`,
    fileRename: `${baseUrl}/api/media-manager/file/rename`,
    signedUrlUpload: `${baseUrl}/api/media-manager/signed-url/upload`,
    signedUrlReplace: `${baseUrl}/api/media-manager/signed-url/replace`,
    exportCsv: `${baseUrl}/api/media-manager/export-csv`,
  },
  banners: {
    base: `${baseUrl}/api/banners`,
    upload: `${baseUrl}/api/upload`, // Generic upload
  },
  notifications: {
    base: `${baseUrl}/api/notifications`,
    update: `${baseUrl}/api/notifications/`, // + id
  }
} 