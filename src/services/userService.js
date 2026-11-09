import api from './api'

export default {
  getAll() {
    return api.get('/users')
  },

  getById(id) {
    return api.get(`/users/${id}`)
  },

  create(data) {
    return api.post(`/users`, data)
  },

  register(data) {
    return api.post('/register', data)
  },

  update(id, data) {
    return api.put(`/users/${id}`, data)
  },

  delete(id) {
    return api.delete(`/users/${id}`)
  },
}
