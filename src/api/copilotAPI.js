import axios from "axios"

const CopilotApi = axios.create({
  baseURL: process.env.REACT_APP_COPILOT_API_BASE_URL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json"
  },
  withCredentials: true
})

CopilotApi.interceptors.request.use(config => {
  const token = localStorage.getItem("accessToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // ✅ admin token for Copilot backend
  config.headers.admintoken = process.env.REACT_APP_ADMIN_TOKEN
  return config
})

CopilotApi.interceptors.response.use(
  response => response,
  error => {
    const { response } = error
    if (response && (response.status === 401 || response.status === 403)) {
      // handle unauthorized access
    }
    return Promise.reject(error)
  }
)

export { CopilotApi }