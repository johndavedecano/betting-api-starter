import { Router } from 'express'
import validate from 'express-validation'

import requireAdmin from 'middlewares/admin-middleware'
import requireAuth from 'middlewares/jwt-middleware'
import requireActive from 'middlewares/status-middleware'
import requireAdminOrOwner from 'middlewares/admin-owner-middleware'

import notificationValidator from './notification.validator'
import notificationCtrl from './notification.controller'

const router = Router()

router
  .route('/:user_id')
  .get(requireAuth, requireActive, requireAdminOrOwner, notificationCtrl.index)

router
  .route('/:user_id')
  .post(
    requireAuth,
    requireActive,
    requireAdmin,
    validate(notificationValidator.create),
    notificationCtrl.create
  )

router
  .route('/:user_id/:id')
  .get(requireAuth, requireActive, requireAdminOrOwner, notificationCtrl.find)

router
  .route('/:user_id/:id')
  .put(
    requireAuth,
    requireActive,
    requireAdmin,
    validate(notificationValidator.update),
    notificationCtrl.update
  )

router
  .route('/:user_id/:id/seen')
  .put(requireAuth, requireActive, requireAdmin, notificationCtrl.updateSeen)

router
  .route('/:user_id/:id')
  .delete(
    requireAuth,
    requireActive,
    requireAdminOrOwner,
    notificationCtrl.destroy
  )

export default router
