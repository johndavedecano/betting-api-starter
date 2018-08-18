import httpStatus from 'http-status'
import APIError from 'helpers/api-error'
import createRandomToken from 'helpers/create-random-token'
import UserRepo from 'repos/user-repo'
import queue from './../../helpers/queue'

import {
  MSG_EMAIL_EXISTS,
  MSG_USERNAME_EXISTS,
  GLOBAL_EXPIRATION,
  MSG_SIGNUP,
  MSG_UNABLE_VERIFY,
  MSG_VERIFY_OK
} from '../../constants'

/**
 * Renders sign up page.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function index(req, res, next) {
  return res.render('signup', { title: MSG_SIGNUP })
}

/**
 * Renders sign up page.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function verify(req, res, next) {
  const user = await UserRepo.findByVerificationToken(req.query.token)

  if (!user) {
    return res.status(404).render('signup/verify', {
      title: MSG_SIGNUP,
      message: MSG_UNABLE_VERIFY
    })
  }

  user.is_verified = true
  user.is_active = true
  user.account_verification_token = undefined
  user.account_verification_expiration = undefined

  await user.save()

  return res.render('signup/verify', {
    title: MSG_SIGNUP,
    message: MSG_VERIFY_OK
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
    const { name, username, email, password } = req.body
    const emailExists = await UserRepo.existsByKey('email', email)

    if (emailExists) {
      throw new Error(MSG_EMAIL_EXISTS)
    }

    const usernameExists = await UserRepo.existsByKey('username', username)

    if (usernameExists) {
      throw new Error(MSG_USERNAME_EXISTS)
    }

    const token = await createRandomToken()

    const user = await UserRepo.create({
      name,
      username,
      email,
      password,
      is_verified: false,
      is_active: false,
      account_verification_token: token,
      account_verification_expiration: GLOBAL_EXPIRATION
    })

    queue('USER_WALLET', 'USER_WALLET_CREATED', { user_id: user._id })
    queue('USER_AUTH', 'USER_SIGNUP_EMAIL', { user, token })

    return res.json({
      user: user.getPublicFields()
    })
  } catch (error) {
    const err = new APIError(error.message, httpStatus.BAD_REQUEST)
    return next(err)
  }
}

export default { index, create, verify }
