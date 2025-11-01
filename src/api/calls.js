import axios from "axios"
import { Redirect } from "react"

const TMApi = axios.create({
  baseURL: process.env.REACT_APP_BASE_API,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: 'application/json' 
  },
  withCredentials: true
})

TMApi.interceptors.request.use(function (config) {
  config.headers.Authorization = `Bearer ${localStorage.getItem(
    "accessToken"
  )}`
  return config
})

// ** Add request/response interceptor
TMApi.interceptors.response.use(
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

export { TMApi }
