import { TMApi } from "../api/calls"

class AuthService {

    logout() {
        return TMApi.post('/logout')
    }

    verifyAdminUser(password) {
        return TMApi.post('/api/admin/verify', {
            password
        })
    }

    sendPasswordResetEmail(email) {
        return TMApi.post('/api/reset-password', {
            email
        })
    }
}

export default new AuthService()