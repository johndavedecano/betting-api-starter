import { Router } from 'express'

import notificationRoutes from './modules/notification/notification.route'

const router = Router()

router.get('/', (req, res) => res.send('OK'))
router.get('/health-check', (req, res) => res.send('OK'))
router.use('/notifications', notificationRoutes)

export default router
