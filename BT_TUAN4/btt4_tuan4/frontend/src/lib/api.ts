import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8017/v1',
  withCredentials: true // send cookies for auth
})

export default api
