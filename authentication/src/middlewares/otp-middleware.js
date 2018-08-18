import httpStatus from 'http-status'
import speakeasy from 'speakeasy'
import UserRepo from 'repos/user-repo'

export default async function(req, res, next) {
  const user = await UserRepo.findById(req.user._id)

  if (!user) {
    return res.status(httpStatus.NOT_FOUND).send({
      status_code: httpStatus.NOT_FOUND,
      message: 'User not found.'
    })
  }

  if (user.is_otp) {
    try {
      if (!req.body.token) {
        return res.status(httpStatus.UNAUTHORIZED).send({
          status_code: httpStatus.UNAUTHORIZED,
          message: 'One time password is required'
        })
      }

      const verified = speakeasy.totp.verify({
        secret: user.otp_secret,
        encoding: 'base32',
        token: req.body.token
      })

      if (!verified) {
        return res.status(httpStatus.UNAUTHORIZED).send({
          status_code: httpStatus.UNAUTHORIZED,
          message: 'Invalid one time password'
        })
      }

      return next()
    } catch (err) {
      next(err)
    }
  } else {
    next()
  }
}
