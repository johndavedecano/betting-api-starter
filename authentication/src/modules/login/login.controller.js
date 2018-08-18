import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import speakeasy from 'speakeasy'

import APIError from 'helpers/api-error'
import config from 'config/config'
import isMobileNumber from 'helpers/is-mobile-number'
import isEmailAddress from 'helpers/is-email-address'
import UserRepo from 'repos/user-repo'
import sendOtpEmail from 'emails/otp/otp-email'

/**
 * Returns jwt token if valid email and password is provided
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function login(req, res, next) {
  try {
    let user

    if (isMobileNumber(req.body.email)) {
      user = await UserRepo.loginUserByMobile(req.body.email, req.body.password)
    } else if (isEmailAddress(req.body.email)) {
      user = await UserRepo.loginUserByEmail(req.body.email, req.body.password)
    } else {
      user = await UserRepo.loginUserByUsername(
        req.body.email,
        req.body.password
      )
    }

    if (!user) {
      const err = new APIError('User not found', httpStatus.NOT_FOUND)
      return next(err)
    }

    if (user.is_otp) {
      // TODO: Send an OTP to mobile number or email address
      const token = speakeasy.totp({
        secret: user.otp_secret,
        encoding: 'base32'
      })

      sendOtpEmail(user.email, {
        name: user.name,
        otp: token
      })

      return res.json({
        message: 'One time password was sent to your email.',
        user: {
          user_id: user._id,
          is_otp: user.is_otp
        }
      })
    }

    const token = jwt.sign(user.getPublicFields(), config.jwtSecret)

    return res.json({
      token,
      user: { _id: user._id, ...user.getPublicFields() }
    })
  } catch (error) {
    const err = new APIError(error.message, httpStatus.UNAUTHORIZED)
    return next(err)
  }
}

/**
 * Verify two factory token.
 * If has temp secret well use it to verify the token
 * Then, save the temp token to the actual token
 * then removes the temp token.
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function otpLogin(req, res, next) {
  try {
    const user = await UserRepo.findById(req.body.user_id)

    if (!user) {
      const err = new APIError('User not found', httpStatus.NOT_FOUND)
      return next(err)
    }

    if (!req.body.token) {
      throw new Error('OTP token was not provided.')
    }

    const verified = speakeasy.totp.verify({
      secret:
        !!user.otp_tmp_secret === true ? user.otp_tmp_secret : user.otp_secret,
      encoding: 'base32',
      token: req.body.token
    })

    if (!verified) {
      throw new Error('Unable to verify token. Please request for a new qrcode')
    }

    user.otp_secret =
      !!user.otp_tmp_secret === true ? user.otp_tmp_secret : user.otp_secret
    user.otp_tmp_secret = ''
    user.is_otp = true
    await user.save()

    const token = jwt.sign(user.getPublicFields(), config.jwtSecret)

    return res.json({
      token,
      user: user.getPublicFields()
    })
  } catch (error) {
    const err = new APIError(error.message, httpStatus.UNAUTHORIZED)
    return next(err)
  }
}

export default { login, otpLogin }
