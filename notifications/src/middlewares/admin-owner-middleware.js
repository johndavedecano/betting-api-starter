import httpStatus from 'http-status'
import ApiError from 'helpers/api-error'

export default async function(req, res, next) {
  try {
    // IF ADMIN
    if (req.user.is_admin) {
      return next()
    }

    // IF CURRENT USER
    if (req.user._id === req.params.user_id) {
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
