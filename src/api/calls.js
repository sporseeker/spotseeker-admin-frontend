import axios from "axios"

// Main API instance
const TMApi = axios.create({
  baseURL: process.env.REACT_APP_BASE_API,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json"
  },
  withCredentials: true
})

// Auth API instance
const AuthApi = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_LOGIN,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json"
  },
  withCredentials: true
})

// Add token automatically to main API only (not auth API)
TMApi.interceptors.request.use(config => {
  const token = localStorage.getItem("accessToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle unauthorized or forbidden responses
TMApi.interceptors.response.use(
  response => response,
  error => {
    const { response } = error
    if (response) {
      if (response.status === 401 || response.status === 403) {
        // Example action: redirect or clear session
        // localStorage.removeItem("userData")
        // window.location.reload()
      }
    }
    return Promise.reject(error)
  }
)

export { TMApi, AuthApi }