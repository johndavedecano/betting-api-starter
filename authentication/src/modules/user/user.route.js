import { Router } from 'express'
import expressJwt from 'express-jwt'
import validate from 'express-validation'
import userCtrl from './user.controller'
import userCtrlValidator from './user.validators'
import config from 'config/config'
import requireOtp from 'middlewares/otp-middleware'

const router = Router()
const requireAuth = expressJwt({ secret: config.jwtSecret })

router.route('/').get(requireAuth, userCtrl.user)

router
  .route('/email')
  .post(
    requireAuth,
    validate(userCtrlValidator.email),
    requireOtp,
    userCtrl.email
  )

router.route('/email').get(userCtrl.emailVerify)

router
  .route('/password')
  .post(
    requireAuth,
    validate(userCtrlValidator.password),
    requireOtp,
    userCtrl.password
  )

router
  .route('/profile')
  .post(
    requireAuth,
    validate(userCtrlValidator.email),
    requireOtp,
    userCtrl.profile
  )

export default router
