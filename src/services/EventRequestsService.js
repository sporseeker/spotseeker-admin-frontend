import { TMApi } from "../api/calls"
import { CopilotApi } from "../api/copilotAPI"

const url = '/api'

class EventRequstsService {
  // Get all event organizers with pagination
  getAllEventOrganizers(page = 0, limit = 10) {
    return CopilotApi.get(`${url}/events`, {
      params: {
        page,
        limit
      }
    })
  }
getAllEventOrganizersAdmin(page = 0, limit = 10) {
    return CopilotApi.get(`${url}/admin/events`, {
      params: {
        page,
        limit
      }
    })
  }
}

export default new EventRequstsService()