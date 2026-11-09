
import api from './api'

export default {
  getAll() {
    return api.get('/orders')
  },

  getById(id) {
    return api.get(`/orders/${id}`)
  },

  create(data) {
    return api.post('/orders', data)
  },
}
