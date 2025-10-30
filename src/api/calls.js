import axios from "axios"

const TMApi = axios.create({
  baseURL: process.env.REACT_APP_BASE_API || "http://localhost:8081",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json"
  },
  withCredentials: true
})

// ✅ Only attach token if available AND not for login/register endpoints
TMApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")

  // Skip attaching token for login/register/public endpoints
  const isAuthEndpoint =
    config.url.includes("/api/auth/login") ||
    config.url.includes("/api/auth/register") ||
    config.url.includes("/api/auth/refresh")

  if (token && !isAuthEndpoint) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// ✅ Handle common auth errors gracefully
TMApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error
    if (response) {
      if (response.status === 401) {
        console.warn("Unauthorized - possible expired token")
        // Optionally clear localStorage or redirect
        // localStorage.removeItem("userData")
        // window.location.reload()
      } else if (response.status === 403) {
        console.warn("Forbidden - insufficient permissions")
      }
    }
    return Promise.reject(error)
  }
)

export { TMApi }