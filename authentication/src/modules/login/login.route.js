import { Router } from 'express'
import validate from 'express-validation'

import loginCtrl from './login.controller'
import loginCtrlValidator from './login.validators'

const router = Router() // eslint-disable-line new-cap

router.route('/').post(validate(loginCtrlValidator.login), loginCtrl.login)
router.route('/otp').post(validate(loginCtrlValidator.otp), loginCtrl.otpLogin)

export default router
