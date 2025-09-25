import { TMApi } from "../api/calls"

const url = '/api/jobs'

class QueueService {

    getAllQueuedJobs() {
        return TMApi.get(`${url}`)
    }

    retryFailedJobs(id) {
        return TMApi.post(`${url}/failed`, { id })
    }

    restartQueue() {
        return TMApi.post(`${url}`)
    }
}

export default new QueueService()