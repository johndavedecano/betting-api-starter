import { Router } from 'express'
import expressJwt from 'express-jwt'
import validate from 'express-validation'

import config from 'config/config'
import tCtrl from './transaction.controller'
import tValidator from './transaction.validator'
import requireAcl from 'middlewares/acl-middleware'

const requireAuth = expressJwt({ secret: config.jwtSecret })

const router = Router()

router.route('/:user_id').get(requireAuth, requireAcl(true), tCtrl.list)

router
  .route('/:user_id')
  .post(requireAuth, requireAcl(), validate(tValidator.create), tCtrl.create)

router
  .route('/:user_id/:transaction_id')
  .get(requireAuth, requireAcl(true), tCtrl.find)

router
  .route('/:user_id/:transaction_id')
  .put(requireAuth, requireAcl(), validate(tValidator.update), tCtrl.update)

router
  .route('/:user_id/:transaction_id')
  .delete(requireAuth, requireAcl(), tCtrl.destroy)

export default router
