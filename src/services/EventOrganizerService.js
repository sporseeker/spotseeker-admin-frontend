import { TMApi } from "../api/calls"
import { CopilotApi } from "../api/copilotAPI"

const url = '/api/admin'

class EventOrganizerService {
  // Get all event organizers with pagination
  getAllEventOrganizers(page = 0, limit = 10) {
    return CopilotApi.get(`${url}/partners`, {
      params: {
        page,
        limit
      }
    })
  }

  // Get a single event organizer by ID
  getEventOrganizer(id) {
    return CopilotApi.get(`${url}/partners/${id}`)
  }

  // Update event organizer status
  updateEventOrganizerStatus(id, status) {
    return CopilotApi.put(`${url}/partners/${id}/status`, {
      status
    })
  }

  // Delete an event organizer
  deleteEventOrganizer(id) {
    return CopilotApi.delete(`${url}/partners/${id}`)
  }
}

export default new EventOrganizerService()