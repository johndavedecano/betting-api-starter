import httpStatus from 'http-status'
import speakeasy from 'speakeasy'
import QrFactory from 'qrcode'
import APIError from 'helpers/api-error'
import UserRepo from 'repos/user-repo'

function createQrCode(url) {
  return new Promise((resolve, reject) => {
    QrFactory.toDataURL(url, (err, dataUrl) => {
      if (err) {
        return reject(err)
      }
      resolve(dataUrl)
    })
  })
}

/**
 * Generate temporary secret key.
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function create(req, res, next) {
  try {
    const user = await UserRepo.findById(req.user._id)

    if (!user) {
      const err = new APIError('User not found', httpStatus.NOT_FOUND)
      return next(err)
    }

    const secret = speakeasy.generateSecret()

    user.otp_tmp_secret = secret.base32
    user.is_otp = false
    await user.save()

    const qrcode = await createQrCode(secret.otpauth_url)

    return res.json({
      user: user.getPublicFields(),
      otp: {
        qrcode: qrcode,
        secret: user.otp_tmp_secret
      }
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
async function update(req, res, next) {
  try {
    const user = await UserRepo.findById(req.user._id)

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

    return res.json({
      user: user.getPublicFields()
    })
  } catch (error) {
    const err = new APIError(error.message, httpStatus.UNAUTHORIZED)
    return next(err)
  }
}

/**
 * Disable otp on user account.
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function destroy(req, res, next) {
  try {
    const user = await UserRepo.findById(req.user._id)

    if (!user) {
      const err = new APIError('User not found', httpStatus.NOT_FOUND)
      return next(err)
    }

    if (!req.body.token) {
      throw new Error('OTP token was not provided.')
    }

    const verified = speakeasy.totp.verify({
      secret: user.otp_secret,
      encoding: 'base32',
      token: req.body.token
    })

    if (!verified) {
      throw new Error('Unable to verify token. Please request for a new qrcode')
    }

    user.otp_tmp_secret = ''
    user.otp_secret = ''
    user.is_otp = false

    await user.save()

    return res.json({
      user: user.getPublicFields()
    })
  } catch (error) {
    const err = new APIError(error.message, httpStatus.UNAUTHORIZED)
    return next(err)
  }
}

export default { create, update, destroy }
