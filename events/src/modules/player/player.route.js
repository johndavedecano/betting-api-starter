import { Router } from 'express'
import validate from 'express-validation'
import playerCtrl from './player.controller'
import playerValidator from './player.validator'

import jwtMiddleware from './../../middlewares/jwt-middleware'
import adminMiddleware from './../../middlewares/acl-middleware'

const router = Router()

router.route('/').get(playerCtrl.index)

router
  .route('/')
  .post(
    jwtMiddleware,
    adminMiddleware,
    validate(playerValidator.create),
    playerCtrl.create
  )

router.route('/:id').get(playerCtrl.find)

router
  .route('/:id')
  .put(
    jwtMiddleware,
    adminMiddleware,
    validate(playerValidator.update),
    playerCtrl.update
  )

router.route('/:id').delete(jwtMiddleware, adminMiddleware, playerCtrl.destroy)

export default router
