import axios from "axios"

const CopilotApi = axios.create({
  baseURL: process.env.REACT_COPILOT_API_BASE_URL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: 'application/json' 
  },
  withCredentials: true
})

CopilotApi.interceptors.request.use(function (config) {
  config.headers.Authorization = `Bearer ${localStorage.getItem(
    "accessToken"
  )}`
  config.headers.admintoken = process.env.REACT_ADMIN_TOKEN
  return config
})

// ** Add request/response interceptor
CopilotApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // ** const { config, response: { status } } = error
    const { response } = error
    // ** if (status === 401) {
    if (response && response.status === 401) {
      // localStorage.removeItem("userData")
      // window.location.reload()
    } else if (response && response.status === 403) {
      // localStorage.removeItem("userData")
      // window.location.reload()
    }
    return Promise.reject(error)
  }
)

export { CopilotApi }