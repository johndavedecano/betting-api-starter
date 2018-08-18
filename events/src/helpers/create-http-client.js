import axios from 'axios'
import config from 'config/config'

const instance = axios.create({
  baseURL: `${config.auth_url}/api`
})

export default instance
