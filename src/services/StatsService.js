import { TMApi } from "../api/calls"

const url = '/api/stats'

class StatsService {

    getBasicStats() {
        return TMApi.get(url)
    }

    getEventStats(event_id) {
        return TMApi.get(`/api/event/stats/${event_id}`)
    }
}

export default new StatsService()