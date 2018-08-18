import httpStatus from 'http-status'
import ApiError from 'helpers/api-error'
import HttpClient from 'helpers/create-http-client'

async function getUser(token) {
  try {
    const response = await HttpClient.get('/user/profile', {
      headers: { Authorization: 'Bearer ' + token }
    })

    return response
  } catch (error) {
    throw new ApiError(
      'You are not allowed to view this page.',
      httpStatus.UNAUTHORIZED
    )
  }
}

export default { getUser }
