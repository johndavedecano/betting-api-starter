import { Router } from 'express'

import loginRoutes from './modules/login/login.route'
import userRoutes from './modules/user/user.route'
import resetRoutes from './modules/reset/reset.route'
import otpRoutes from './modules/otp/otp.route'
import signupRoutes from './modules/signup/signup.route'

const router = Router()

router.get('/', (req, res) => res.send('OK'))

router.use('/login', loginRoutes)
router.use('/user', userRoutes)
router.use('/otp', otpRoutes)
router.use('/reset', resetRoutes)
router.use('/signup', signupRoutes)

router.get('/health-check', (req, res) => res.send('OK'))

export default router
