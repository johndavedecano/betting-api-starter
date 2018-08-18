import httpStatus from 'http-status'
import APIError from 'helpers/api-error'
import createRandomToken from 'helpers/create-random-token'
import UserRepo from 'repos/user-repo'
import config from 'config/config'
import sendResetEmail from 'emails/reset/reset-email'

/**
 * Renders reset password page.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function index(req, res, next) {
  try {
    const user = await UserRepo.findByResetToken(req.query.token)

    if (!user) {
      return res.status(404).send('404 Page Not Found')
    }

    res.render('reset', { token: req.query.token, title: 'Reset Password' })
  } catch (error) {
    const err = new APIError(error.message, httpStatus.BAD_REQUEST)
    return next(err)
  }
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
    const user = await UserRepo.findByEmail(req.body.email)

    if (!user) {
      const err = new APIError('User not found', httpStatus.NOT_FOUND)
      return next(err)
    }

    const token = await createRandomToken()

    user.password_reset_token = token
    user.password_reset_expiration = Date.now() + 3600000

    await user.save()

    const response = await sendResetEmail(user.email, {
      name: user.name,
      email: user.email,
      reset_token: token,
      password_reset_url: `${config.app_url}/api/reset?token=${token}`
    })

    return res.json({
      user: user.getPublicFields(),
      email: response
    })
  } catch (error) {
    const err = new APIError(error.message, httpStatus.BAD_REQUEST)
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
    const user = await UserRepo.findByResetToken(req.body.token)

    if (!user) {
      const err = new APIError('User not found', httpStatus.NOT_FOUND)
      return next(err)
    }

    user.password = req.body.password
    user.password_reset_expiration = undefined
    user.password_reset_token = undefined

    await user.save()

    return res.json({
      user: user.getPublicFields(),
      updated: true
    })
  } catch (error) {
    const err = new APIError(error.message, httpStatus.BAD_REQUEST)
    return next(err)
  }
}

export default { index, create, update }
