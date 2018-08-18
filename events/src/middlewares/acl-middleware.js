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

    if (user.is_admin) {
      return next()
    }

    throw new ApiError(
      'Your do not have permission to perform this action.',
      httpStatus.UNAUTHORIZED
    )
  } catch (error) {
    next(error)
  }
}
