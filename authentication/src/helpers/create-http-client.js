import axios from 'axios'

export default function(options = {}, headers = {}) {
  return axios.create({
    ...options,
    headers: headers
  })
}
