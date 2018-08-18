import { Router } from 'express'

import playerRoutes from './modules/player/player.route'
import categoryRoutes from './modules/category/category.route'
import matchRoutes from './modules/match/match.route'

const router = Router()

router.get('/', (req, res) => res.send('OK'))
router.get('/health-check', (req, res) => res.send('OK'))

router.use('/players', playerRoutes)
router.use('/categories', categoryRoutes)
router.use('/matches', matchRoutes)

export default router
