import { TMApi } from "../api/calls"

const url = '/api/venues'

class VenueService {

    getAllVenues() {
        return TMApi.get(url)
    }

    createVenue(venueObj) {
        const formData = new FormData()

        formData.append("name", venueObj.name)
        formData.append("location_url", venueObj.location_url)
        
        return TMApi.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
    }

    getVenue(id) {
        return TMApi.get(`${url}/${id}`)
    }

    updateVenue(venueObj, id) {

        const formData = new FormData()

        formData.append("name", venueObj.name)
        formData.append("location_url", venueObj.location_url)
        
        return TMApi.post(`/api/updateVenue/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
    }

    deleteVenue(id) {
        return TMApi.delete(`/api/venues/${id}`)
    }
}

export default new VenueService()