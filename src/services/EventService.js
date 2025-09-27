import { TMApi } from "../api/calls"

const url = "/api/events"

class EventService {
  getAllEvents(status = ["ongoing"], per_page, page, search = null) {
    return TMApi.get(url, {
      params: {
        status,
        per_page,
        page,
        search
      }
    })
  }

  createEvent(data) {
    const formData = new FormData()

    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("organizer", data.organizer)
    formData.append("manager", data.manager)
    formData.append("start_date", data.start_date)
    formData.append("end_date", data.end_date)
    formData.append("type", data.type)
    formData.append("sub_type", data.sub_type)
    formData.append("featured", data.featured)
    formData.append("free_seating", data.free_seating)
    formData.append("venue", data.venue)
    formData.append("invoice", JSON.stringify(data.invoice))
    formData.append("banner_img", data.banner_img)
    formData.append("thumbnail_img", data.thumbnail_img)
    formData.append("sold_out_msg", data.sold_out_msg)
    formData.append("handling_cost", data.handling_cost)
    formData.append("handling_cost_perc", data.handling_cost_perc)
    formData.append("currency", data.currency)
    formData.append("invitation_feature", data.invitation_feature)
    formData.append("invitation_count", data.invitation_count)
    formData.append(
      "invitation_packages",
      JSON.stringify(data.invitation_packages)
    )
    
    formData.append("addons_feature", data.addons_feature)
    const images = [] // To store images

    // Step 1: Remove addonImage and stringify the rest of the data
    const filteredAddons = data.addons.map((addon) => {
      const { addonImage, ...rest } = addon // Destructure to exclude addonImage
      images.push(addonImage)
      return rest // Return only the non-image properties
    })

    // Step 2: Append the filtered data (without images) to FormData
    formData.append("addons", JSON.stringify(filteredAddons))

    // Step 3: Append images separately, maintaining relevance to each object
    data.addons.forEach((addon, index) => {
      if (addon.addonImage) {
        // Store images in formData with a unique key related to the addon
        formData.append(`addonImage[${index}]`, addon.addonImage)
      }
    })

    formData.append("trailer_url", data.trailer_url)

    formData.append(
      "payment_gateways",
      JSON.stringify(data.payment_gateways)
    )

    formData.append('analytics_ids', JSON.stringify(data.analytics_ids))
    
    return TMApi.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  }

  updateEvent(data) {
    const formData = new FormData()
    console.log(data.addons)
    formData.append("name", data.name)
    formData.append("status", data.status)
    formData.append("description", data.description)
    formData.append("organizer", data.organizer)
    formData.append("manager", data.manager)
    formData.append("start_date", data.start_date)
    formData.append("end_date", data.end_date)
    formData.append("type", data.type)
    formData.append("sub_type", data.sub_type)
    formData.append("featured", data.featured)
    formData.append("free_seating", data.free_seating)
    formData.append("venue", data.venue)
    formData.append("invoice", JSON.stringify(data.invoice))
    formData.append("banner_img", data.banner_img)
    formData.append("thumbnail_img", data.thumbnail_img)
    formData.append("message", data.sold_out_msg)
    formData.append("handling_cost", data.handling_cost)
    formData.append("handling_cost_perc", data.handling_cost_perc)
    formData.append("currency", data.currency)
    formData.append("invitation_feature", data.invitation_feature)
    formData.append("invitation_count", data.invitation_count)
    formData.append(
      "invitation_packages",
      JSON.stringify(data.invitation_packages)
    )
    
    formData.append("addons_feature", data.addons_feature)
    const images = [] // To store images

    // Step 1: Remove addonImage and stringify the rest of the data
    const filteredAddons = data.addons.map((addon) => {
      const { addonImage, ...rest } = addon // Destructure to exclude addonImage
      images.push(addonImage)
      return rest // Return only the non-image properties
    })

    // Step 2: Append the filtered data (without images) to FormData
    formData.append("addons", JSON.stringify(filteredAddons))

    // Step 3: Append images separately, maintaining relevance to each object
    data.addons.forEach((addon, index) => {
      if (addon.addonImage) {
        // Store images in formData with a unique key related to the addon
        formData.append(`addonImage[${index}]`, addon.addonImage)
      }
    })

    formData.append("trailer_url", data.trailer_url)

    formData.append(
      "payment_gateways",
      JSON.stringify(data.payment_gateways)
    )

    formData.append('analytics_ids', JSON.stringify(data.analytics_ids))

    return TMApi.post(`/api/updateEvent/${data.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  }

  getEvent(id) {
    return TMApi.get(`${url}/${id}`)
  }

  deleteEvent(id) {
    return TMApi.delete(`${url}/${id}`)
  }

  searchEvents(query) {
    return TMApi.get(`${url}/search`, {
      params: {
        q: query
      }
    })
  }

  sendInvitations(data) {
    return TMApi.post(`${url}/sendInvitations`, data)
  }

  getInvitations(event_id) {
    return TMApi.get(`${url}/getInvitations/${event_id}`)
  }
}

export default new EventService()
