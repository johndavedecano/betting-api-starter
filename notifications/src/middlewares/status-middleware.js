import httpStatus from 'http-status'
import ApiError from 'helpers/api-error'

export default async function(req, res, next) {
  try {
    const user = req.user

    if (!user.is_verified) {
      throw new ApiError(
        'Your account is not verified.',
        httpStatus.UNAUTHORIZED
      )
    }

    if (!user.is_active) {
      throw new ApiError('Your account is not active.', httpStatus.UNAUTHORIZED)
    }

    next()
  } catch (error) {
    next(error)
  }
}
