import { TMApi } from '../../api/calls'        // for Spotseeker (Sanctum + user login)
import { CopilotApi } from '../../api/copilotAPI' // for Copilot backend (admin token)
import jwtDefaultConfig from './jwtDefaultConfig'

export default class JwtService {
  jwtConfig = { ...jwtDefaultConfig }

  isAlreadyFetchingAccessToken = false
  subscribers = []

  csrf() {
    return TMApi.get('/sanctum/csrf-cookie')
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter(callback => callback(accessToken))
  }

  addSubscriber(callback) {
    this.subscribers.push(callback)
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName)
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value)
  }

  // ✅ Login user via Spotseeker API
  login(...args) {
    return TMApi.post(this.jwtConfig.loginEndpoint, ...args)
  }

  register(...args) {
    return TMApi.post(this.jwtConfig.registerEndpoint, ...args)
  }

  logout() {
    return TMApi.post(this.jwtConfig.logoutEndpoint)
  }

  refreshToken() {
    return TMApi.post(this.jwtConfig.refreshEndpoint, {
      refreshToken: this.getRefreshToken()
    })
  }

  // ✅ Call Copilot backend with admin token to verify or get data
  async copilotLogin(params) {
    try {
      const res = await CopilotApi.post('/api/login', params)
      return res
    } catch (err) {
      console.error('Copilot login failed:', err)
      throw err
    }
  }
}