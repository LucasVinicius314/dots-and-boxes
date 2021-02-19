import axios from 'axios'

const api = axios.create({
  baseURL: `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_API_PORT}/api/`,
})

export default api
