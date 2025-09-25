import { TMApi } from "../api/calls"

const url = "/api/users"

class UserService {
  getAllUserByRole(role, perPage, page, search, all = false, sortBy = null) {
    return TMApi.get(url, {
      params: {
        type: role, // or 'staff', 'user' based on your requirement
        per_page: perPage,
        page,
        search,
        all,
        sortBy
      }
    })
  }

  createUser(data) {
    return TMApi.post("/api/user/create", data)
  }

  updateUser(data, id) {
    return TMApi.put(`${url}/${id}`, data)
  }

  deleteUser(id) {
    return TMApi.delete(`${url}/${id}`)
  }

  deactivateUser(id) {
    return TMApi.post(`${url}/ban/${id}`)
  }

  activateUser(id) {
    return TMApi.post(`${url}/activate/${id}`)
  }
}

export default new UserService()
