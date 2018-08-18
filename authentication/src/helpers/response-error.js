import ApiError from 'helpers/api-error'
import get from 'lodash/get'

export default function(error) {
  throw new ApiError(
    get(error, 'response.data.message', 'Something went wrong'),
    get(error, 'response.status', 500),
    get(error, 'response.data.errors')
  )
}
