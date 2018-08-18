import httpStatus from 'http-status'
import APIError from 'helpers/api-error'
import UserRepo from 'repos/user-repo'
import createRandomToken from 'helpers/create-random-token'
import sendVerificationEmail from 'emails/user-email/user-email'
import config from 'config/config'
import each from 'lodash/each'

import {
  GLOBAL_EXPIRATION,
  MSG_EMAIL_EXISTS,
  MSG_USER_NOT_FOUND,
  MSG_UNABLE_TOKEN,
  MSG_VERIFY_CHANGE,
  MSG_CHANGE_SUCCESS,
  MSG_USERNAME_EXISTS,
  MSG_MOBILE_EXISTS
} from '../../constants'

/**
 * Gets current user from token.
 *
 * @param req
 * @param res
 * @param next
 *
 * @returns {*}
 */
async function user(req, res, next) {
  try {
    const user = await UserRepo.findByEmail(req.user.email)

    if (!user) {
      throw new APIError(MSG_USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    return res.json({
      user: user.getPublicFields()
    })
  } catch (error) {
    return next(error)
  }
}

/**
 * @param req
 * @param res
 * @param next
 *
 * @returns {*}
 */
async function email(req, res, next) {
  try {
    const user = await UserRepo.findById(req.user._id)

    if (!user) {
      throw new APIError(MSG_USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    if (user.email !== req.body.email) {
      const existingAccount = await UserRepo.findByEmail(req.body.email)

      if (existingAccount !== null && typeof existingAccount === 'object') {
        throw new APIError(MSG_EMAIL_EXISTS, httpStatus.UNPROCESSABLE_ENTITY)
      } else {
        const token = await createRandomToken()

        user.email_update = req.body.email
        user.email_update_token = token
        user.email_update_expiration = GLOBAL_EXPIRATION

        await user.save()

        await sendVerificationEmail(req.body.email, {
          name: user.name,
          next_email: req.body.email,
          prev_email: user.email,
          email_verification_url: `${
            config.app_url
          }/api/user/email?token=${token}`
        })
      }
    }

    return res.json({
      user: user.getPublicFields()
    })
  } catch (error) {
    return next(error)
  }
}

/**
 * @param req
 * @param res
 * @param next
 *
 * @returns {*}
 */
async function emailVerify(req, res, next) {
  try {
    const user = await UserRepo.findByEmailUpdateToken(req.query.token)

    if (user) {
      user.email = user.email_update
      user.email_update = undefined
      user.email_update_token = undefined
      user.email_update_expiration = undefined

      await user.save()

      return res.status(200).render('signup/verify', {
        title: MSG_VERIFY_CHANGE,
        message: MSG_CHANGE_SUCCESS
      })
    }

    return res.status(404).render('signup/verify', {
      title: MSG_VERIFY_CHANGE,
      message: MSG_UNABLE_TOKEN
    })
  } catch (error) {
    return next(error)
  }
}

/**
 * @param req
 * @param res
 * @param next
 *
 * @returns {*}
 */
async function password(req, res, next) {
  try {
    const user = await UserRepo.findById(req.user._id)

    if (!user) {
      throw new APIError(MSG_USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    user.password = req.body.password

    await user.save()

    return res.json({
      user: user.getPublicFields(),
      updated: true
    })
  } catch (error) {
    return next(error)
  }
}

/**
 * @param req
 * @param res
 * @param next
 *
 * @returns {*}
 */
async function profile(req, res, next) {
  try {
    const user = await UserRepo.findById(req.user._id)

    if (!user) {
      throw new APIError(MSG_USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    each(Object.keys(req.body), async key => {
      if (key === 'username' && user.username !== req.body.username) {
        const usernameExists = UserRepo.existsByKeyExcept(
          'username',
          req.body.username,
          user._id
        )

        if (usernameExists) {
          throw new APIError(
            MSG_USERNAME_EXISTS,
            httpStatus.UNPROCESSABLE_ENTITY,
            { username: MSG_USERNAME_EXISTS }
          )
        }
      }

      if (key === 'mobile' && user.mobile !== req.body.mobile) {
        const mobileExists = UserRepo.existsByKeyExcept(
          'mobile',
          req.body.mobile,
          user._id
        )

        if (mobileExists) {
          throw new APIError(
            MSG_MOBILE_EXISTS,
            httpStatus.UNPROCESSABLE_ENTITY,
            { mobile: MSG_MOBILE_EXISTS }
          )
        }
      }

      if (key === 'name' && user.name !== req.body.name) {
        user.name = req.body.name
      }

      await user.save()
    })
  } catch (error) {
    return next(error)
  }
}

export default {
  user,
  email,
  emailVerify,
  password,
  profile
}
