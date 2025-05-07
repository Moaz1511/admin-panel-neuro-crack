export const AppConstants = {
  // API related constants
  api: {
    baseUrl: (process.env.NEXT_PUBLIC_API_URL || 'http://192.168.0.104:5000').replace(/\/$/, ''),
    timeout: 30000, // 30 seconds
  },

  routes: {
    home: '/',
    login: '/login',
    register: '/register',
    dashboard: '/dashboard',
  },

  // Application Information related constants
  app: {
    name: "Neuro Crack Admin Panel",
    description: "Your learning platform for success",
    version: "1.0.0",
  },

  // Feature Flags related constants
  features: {
    emailVerification: true,
    googleAuth: false,
    passwordReset: true,
  },
}