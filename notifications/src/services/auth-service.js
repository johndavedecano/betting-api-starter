import handleErrorResponse from 'helpers/response-error'
import HttpClient from 'helpers/create-http-client'
import config from 'config/config'

async function getUser(token) {
  try {
    const request = HttpClient(
      { baseURL: config.auth_url },
      { Authorization: 'Bearer ' + token }
    )
    return await request.get('/user/profile')
  } catch (error) {
    return handleErrorResponse(error)
  }
}

export default { getUser }
