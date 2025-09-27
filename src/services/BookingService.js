import { TMApi } from "../api/calls"

const url = "/api/bookings"

class BookingService {
  verifyBooking(orderId, verified_tickets) {
    return TMApi.post(`/api/booking/verify`, {
      orderId,
      verified_tickets
    })
  }

  sendBookingMail(orderId, ccMail) {
    return TMApi.post("/api/send/orderMail", {
      order_id: orderId,
      ccMail
    })
  }

  getAllBookings(
    event_status = ["ongoing", "soldout", "closed", "postponed"],
    perPage,
    page,
    order_id, customer, event_id, payment_ref, payment_status, date_range
  ) {
    return TMApi.get(url, {
      params: {
        event_status,
        per_page: perPage,
        page,
        order_id,
        customer,
        event_id,
        payment_ref,
        payment_status,
        date_range
      }
    })
  }

  updateBooking(data, id) {
    return TMApi.put(`${url}/${id}`, data)
  }

  deleteBooking(id) {
    return TMApi.delete(`${url}/${id}`)
  }

  getFailedJobs() {
    return TMApi.get("/api/jobs/failed")
  }

  retryFailedJobs(id) {
    return TMApi.post("/api/jobs/failed", { id })
  }

  generateETicket(id) {
    return TMApi.post(`${url}/generateticket/${id}`)
  }
}

export default new BookingService()
