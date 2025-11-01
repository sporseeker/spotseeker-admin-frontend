import { AuthApi, TMApi } from '../../api/calls'
import jwtDefaultConfig from './jwtDefaultConfig'
import axios from 'axios'

export default class JwtService {
  jwtConfig = { ...jwtDefaultConfig }

  csrf() {
    // Sanctum cookie request before login
    return AuthApi.get('/sanctum/csrf-cookie')
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
  }

  login(...args) {
    return AuthApi.post(this.jwtConfig.loginEndpoint, ...args)
  }

  async customLogin(params) {
    const token = process.env.REACT_APP_BASE_API_TOKEN
    const loginUrl = process.env.REACT_APP_BASE_API_LOGIN

    try {
      // Sanctum before login
      await this.csrf()

      const response = await axios.post(`${loginUrl}login`, params, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      })

      return { ...response.data, token }
    } catch (err) {
      console.error('Custom login error:', err)
      throw err
    }
  }
}
