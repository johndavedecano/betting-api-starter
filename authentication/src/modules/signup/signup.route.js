import { Router } from 'express'
import validate from 'express-validation'

import signupCtrl from './signup.controller'
import signupCtrlValidator from './signup.validators'

const router = Router()

router.route('/').get(signupCtrl.index)
router.route('/verify').get(signupCtrl.verify)
router.route('/').post(validate(signupCtrlValidator.post), signupCtrl.create)

export default router
