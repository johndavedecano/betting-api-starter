import { Router } from 'express'
import expressJwt from 'express-jwt'

import otpCtrl from './otp.controller'
import config from 'config/config'

const router = Router()
const jwtConfig = expressJwt({ secret: config.jwtSecret })

router.route('/').post(jwtConfig, otpCtrl.create)
router.route('/').put(jwtConfig, otpCtrl.update)
router.route('/').delete(jwtConfig, otpCtrl.destroy)

export default router
