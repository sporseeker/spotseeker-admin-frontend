import { TMApi } from "../api/calls"

const url = '/api/payments/gateways'

class PaymentService {

    getAllPGs() {
        return TMApi.get(`${url}`)
    }

    getPGById(id) {
        return TMApi.get(`${url}/${id}`)
    }

    updatePG(data, id) {
        return TMApi.post(`${url}/${id}`, data)
    }
}

export default new PaymentService()