import axios from 'axios'

export default {
  get () {
    const cb = new Date().getTime()
    return axios.get(`/bk/movies?${cb}`)
  },
  add (payload) {
    return axios.post('/bk/movies', payload)
  },
  update (payload) {
    return axios.put(`/bk/movies/${payload.id}`, payload)
  },
  remove (payload) {
    return axios.delete(`/bk/movies/${payload.id}`)
  }
}
