import { TMApi } from "../api/calls"
import { getUserData } from "../utility/Utils"

const url = '/api/sales'

class SalesService {

    getManagerSales(results_per_page = null) {
        return TMApi.get(`${url}/manager/${getUserData().id}`, {
            params: {
                results_per_page
            }
        })
    }

    getAllSales(results_per_page = null) {
        return TMApi.get(url, {
            params: {
                results_per_page
            }
        })
    }
}

export default new SalesService()