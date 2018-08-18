import { Router } from 'express'

import bettingRoutes from './modules/betting/betting.route'

const router = Router()

router.get('/', (req, res) => res.send('OK'))
router.get('/health-check', (req, res) => res.send('OK'))

router.use('/betting', bettingRoutes)

export default router
