import { TMApi } from "../api/calls"

const url = '/api'

class NotificationService {

    scheduleNotification(notification) {
        return TMApi.post(`${url}/notifications/schedule`, notification)
    }

    getAllNotifications() {
        return TMApi.get(`${url}/notifications`)
    }

    getNotification(id) {
        return TMApi.get(`${url}/notification/${id}`)
    }

    deleteNotification(id) {
        return TMApi.delete(`${url}/notification/${id}`)
    }

    updateNotification(notification, id) {
        return TMApi.put(`${url}/notification/${id}`, notification)
    }
}

export default new NotificationService()