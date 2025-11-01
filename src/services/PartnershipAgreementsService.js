import { TMApi } from "../api/calls"

const url = '/api/admin'

class PartnershipAgreementsService {
  // Get all event organizers with pagination
  getAllEventOrganizers(page = 0, limit = 10) {
    return TMApi.get(`${url}/partners`, {
      params: {
        page,
        limit
      }
    })
  }

  // Get a single event organizer by ID
  getEventOrganizer(id) {
    return TMApi.get(`${url}/partners/${id}`)
  }
  
    // Get all event organizers with pagination
    getAllEventOrganizersRequests(page = 0, limit = 10) {
      return TMApi.get(`${url}/partner-requests`, {
        params: {
          page,
          limit
        }
      })
    
  }
  
  // Update event organizer status
  updateEventOrganizerStatus(id, status) {
    return TMApi.put(`${url}/partners/${id}/status`, {
      status
    })
  }

  // Delete an event organizer
  deleteEventOrganizer(id) {
    return TMApi.delete(`${url}/partners/${id}`)
  }
}

export default new PartnershipAgreementsService()