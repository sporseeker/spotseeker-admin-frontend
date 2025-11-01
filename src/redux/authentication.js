// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt'

const config = useJwt.jwtConfig

const initialUser = () => {
  const item = window.localStorage.getItem('userData')
  // ** Parse stored JSON or return empty object
  return item ? JSON.parse(item) : {}
}

export const authSlice = createSlice({
  name: 'authentication',
  initialState: {
    userData: initialUser()
  },
  reducers: {
    handleLogin: (state, action) => {
      const userData = action.payload.data

      // ✅ Store user data in Redux state
      state.userData = userData

      // ✅ Persist user data
      localStorage.setItem('userData', JSON.stringify(userData))

      // ✅ Store both tokens separately
      if (userData.accessToken) {
        // From Base API
        localStorage.setItem(config.storageTokenKeyName, userData.accessToken)
      }

      if (userData.token) {
        // From Login API
        localStorage.setItem('userToken', userData.token)
      }
    },

    handleLogout: state => {
      // Logout API call
      useJwt.logout()

      // Clear state
      state.userData = {}
      state[config.storageTokenKeyName] = null

      // ✅ Remove user data and tokens
      localStorage.removeItem('userData')
      localStorage.removeItem(config.storageTokenKeyName) // accessToken
      localStorage.removeItem('userToken') // user token
    }
  }
})

export const { handleLogin, handleLogout } = authSlice.actions

export default authSlice.reducer