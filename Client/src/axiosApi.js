const axios = require('axios')

const axiosApi = axios.create({
  baseURL:
    process.env.REACT_APP_BASE_URL !== undefined
      ? process.env.REACT_APP_BASE_URL
      : 'http://localhost:4242/'
})

export default axiosApi
