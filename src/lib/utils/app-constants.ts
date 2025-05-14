export const AppConstants = {
  // API related constants
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    timeout: 30000, // 30 seconds
  },

  routes: {
    home: '/',
    login: '/login',
    register: '/register',
    dashboard: '/dashboard',
  },

  subjectIds: {
    class6: '8953fda4-ba5e-46e9-9b09-0bf1558396db',
    class7: 'b0defd53-3bfd-4927-aa94-7af95f9cd22c',
    class8: 'aa9fb43c-f4a5-40e1-b1d3-4cf3a41ea714',
    class9: '90351cbd-d017-4186-a604-070d6deb86b9',
    class10:'f1bf2a03-4485-4c77-83ff-74df55222467',
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