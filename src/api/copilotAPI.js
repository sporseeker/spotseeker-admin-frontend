import axios from "axios"

const CopilotApi = axios.create({
  baseURL: "http://localhost:8081/",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: 'application/json' 
  }
})

CopilotApi.interceptors.request.use(function (config) {
  config.headers.Authorization = `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI1IiwiZW1haWwiOiJhZG1pbkBjb3BpbG90LmxrIiwidXNlclR5cGUiOiJBRE1JTiIsImlhdCI6MTc2MjAwNjE4NCwiZXhwIjoyNjYyMDA2MTg0fQ.yFQovo85eAs9O1PaKtw2Axhz2sf8Hs-KOuuSVCjhsxkKjchylFUwslXzPaIYeURgnm4fHJSSiRMaFDuaRPbUdQ`
  config.headers.partnerToken = "1696|gMhKppyPd3qtaKhsBe2PVQ7MTwmFJcfY0U8wimv56e38385c"
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