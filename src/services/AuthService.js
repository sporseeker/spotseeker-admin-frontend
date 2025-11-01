import { AuthApi } from "../api/calls"

class AuthService {
  logout() {
    return AuthApi.post("/logout")
  }

  verifyAdminUser(password) {
    return AuthApi.post("/api/admin/verify", { password })
  }

  sendPasswordResetEmail(email) {
    return AuthApi.post("/api/reset-password", { email })
  }
}

export default new AuthService()