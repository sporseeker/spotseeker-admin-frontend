// ========================================
// FILE: src/services/WithdrawalService.js
// ========================================

import { TMApi } from "../api/calls"

const url = '/api/events'

class WithdrawalService {
  // Get all withdrawals for a specific event
  getEventWithdrawals(eventId) {
    return TMApi.get(`${url}/${eventId}/withdrawals`)
  }

  // Update withdrawal status (for admin)
  updateWithdrawalStatus(eventId, withdrawalId, status) {
    return TMApi.put(`${url}/${eventId}/withdrawal/${withdrawalId}`, {
      status
    })
  }

  // Get withdrawal by ID
  getWithdrawal(eventId, withdrawalId) {
    return TMApi.get(`${url}/${eventId}/withdrawals/${withdrawalId}`)
  }
}

export default new WithdrawalService()