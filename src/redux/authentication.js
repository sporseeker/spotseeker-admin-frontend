// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt'

const config = useJwt.jwtConfig

// Get initial user from localStorage
const initialUser = () => {
  try {
    const item = window.localStorage.getItem('userData')
    return item && item !== "undefined" ? JSON.parse(item) : {}
  } catch (error) {
    console.error('Error parsing userData from localStorage:', error)
    return {}
  }
}

export const authSlice = createSlice({
  name: 'authentication',
  initialState: {
    userData: initialUser()
  },
  reducers: {
    handleLogin: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload

      // Update Redux state
      state.userData = user

      // Save user and tokens in localStorage
      localStorage.setItem('userData', JSON.stringify(user))
      localStorage.setItem(config.storageTokenKeyName, accessToken)
      localStorage.setItem(config.storageRefreshTokenKeyName, refreshToken)
    },
    handleLogout: (state) => {
      useJwt.logout()
      state.userData = {}

      // Clear localStorage
      localStorage.removeItem('userData')
      localStorage.removeItem(config.storageTokenKeyName)
      localStorage.removeItem(config.storageRefreshTokenKeyName)
    }
  }
})

export const { handleLogin, handleLogout } = authSlice.actions

export default authSlice.reducer