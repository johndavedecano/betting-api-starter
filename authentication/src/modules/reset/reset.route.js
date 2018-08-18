import { Router } from 'express'
import validate from 'express-validation'

import resetCtrl from './reset.controller'
import resetCtrlValidator from './reset.validators'

const router = Router()

router.route('/').get(resetCtrl.index)
router.route('/').post(validate(resetCtrlValidator.post), resetCtrl.create)
router.route('/').put(validate(resetCtrlValidator.put), resetCtrl.update)

export default router
