import { Router } from 'express'
import expressJwt from 'express-jwt'
import config from 'config/config'
import walletCtrl from './wallet.controller'
import requireAcl from 'middlewares/acl-middleware'

const requireAuth = expressJwt({ secret: config.jwtSecret })

const router = Router()

router.route('/').get(requireAuth, requireAcl(), walletCtrl.list)
router.route('/:user_id').get(requireAuth, requireAcl(true), walletCtrl.find)
router.route('/:user_id').post(requireAuth, requireAcl(), walletCtrl.create)
router.route('/:user_id').put(requireAuth, requireAcl(), walletCtrl.update)
router.route('/:user_id').delete(requireAuth, requireAcl(), walletCtrl.destroy)

export default router
