export const AppConstants = {
  api: {
    baseUrl: (process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000").replace(/\/$/, ''),
    timeout: 10000, // 10 seconds
  },
  routes: {
    home: "/dashboard",
    login: "/login",
  }
  // Add other app constants here
}