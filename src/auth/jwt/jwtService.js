import { TMApi } from '../../api/calls'
import jwtDefaultConfig from './jwtDefaultConfig'

export default class JwtService {
  jwtConfig = { ...jwtDefaultConfig }
  isAlreadyFetchingAccessToken = false
  subscribers = []

  // ** No CSRF cookie needed for JWT
  // csrf() { return TMApi.get('/sanctum/csrf-cookie') }

  onAccessTokenFetched(accessToken) {
    this.subscribers.forEach(callback => callback(accessToken))
    this.subscribers = []
  }

  addSubscriber(callback) {
    this.subscribers.push(callback)
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName)
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value)
  }

  login(credentials) {
    return TMApi.post(this.jwtConfig.loginEndpoint, credentials)
      .then(response => {
        const { accessToken, refreshToken } = response.data
        this.setToken(accessToken)
        this.setRefreshToken(refreshToken)
        return response
      })
  }

  register(data) {
    return TMApi.post(this.jwtConfig.registerEndpoint, data)
  }

  logout() {
    return TMApi.post(this.jwtConfig.logoutEndpoint, {}, {
      headers: {
        Authorization: `${this.jwtConfig.tokenType} ${this.getToken()}`
      }
    }).finally(() => {
      localStorage.removeItem(this.jwtConfig.storageTokenKeyName)
      localStorage.removeItem(this.jwtConfig.storageRefreshTokenKeyName)
    })
  }

  refreshToken() {
    if (this.isAlreadyFetchingAccessToken) {
      return new Promise(resolve => this.addSubscriber(resolve))
    }

    this.isAlreadyFetchingAccessToken = true

    return TMApi.post(this.jwtConfig.refreshEndpoint, {
      refreshToken: this.getRefreshToken()
    }).then(response => {
      const { accessToken } = response.data
      this.setToken(accessToken)
      this.isAlreadyFetchingAccessToken = false
      this.onAccessTokenFetched(accessToken)
      return accessToken
    }).catch(error => {
      this.isAlreadyFetchingAccessToken = false
      throw error
    })
  }
}
