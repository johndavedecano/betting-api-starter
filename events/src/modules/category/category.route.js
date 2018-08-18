import { Router } from 'express'
import validate from 'express-validation'
import categoryCtrl from './category.controller'
import categoryValidator from './category.validator'

import jwtMiddleware from './../../middlewares/jwt-middleware'
import adminMiddleware from './../../middlewares/acl-middleware'

const router = Router()

router.route('/').get(categoryCtrl.index)

router
  .route('/')
  .post(
    jwtMiddleware,
    adminMiddleware,
    validate(categoryValidator.create),
    categoryCtrl.create
  )

router.route('/:id').get(categoryCtrl.find)

router
  .route('/:id')
  .put(
    jwtMiddleware,
    adminMiddleware,
    validate(categoryValidator.update),
    categoryCtrl.update
  )

router
  .route('/:id')
  .delete(jwtMiddleware, adminMiddleware, categoryCtrl.destroy)

export default router
