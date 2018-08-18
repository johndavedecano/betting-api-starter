import { Router } from 'express'

import walletRoutes from './modules/wallet/wallet.route'
import transactionRoutes from './modules/transaction/transaction.route'

const router = Router()

router.get('/', (req, res) => res.send('OK'))
router.use('/wallet', walletRoutes)
router.use('/transactions', transactionRoutes)
router.get('/health-check', (req, res) => res.send('OK'))

export default router
