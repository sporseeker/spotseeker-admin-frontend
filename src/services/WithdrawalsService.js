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

  // Create a new withdrawal request for an event
  createWithdrawal(eventId, withdrawalData) {
    return TMApi.post(`${url}/${eventId}/withdrawal`, withdrawalData)
  }

  // Update withdrawal status (for admin)
  updateWithdrawalStatus(eventId, withdrawalId, status) {
    return TMApi.put(`${url}/${eventId}/withdrawal/${withdrawalId}/status`, {
      status
    })
  }

  // Get withdrawal by ID
  getWithdrawal(eventId, withdrawalId) {
    return TMApi.get(`${url}/${eventId}/withdrawal/${withdrawalId}`)
  }
}

export default new WithdrawalService()