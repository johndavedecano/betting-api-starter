import { Router } from 'express'
import validate from 'express-validation'

import requireAdmin from 'middlewares/admin-middleware'
import requireAuth from 'middlewares/jwt-middleware'
import requireActive from 'middlewares/status-middleware'
import requireOwnership from 'middlewares/owns-middleware'
import requireWalletCheck from 'middlewares/wallet-middleware'
import requireMatch from 'middlewares/match-middleware'

import bettingValidator from './betting.validator'
import bettingCtrl from './betting.controller'

const router = Router()

router
  .route('/return/:transaction_id')
  .post(
    requireAuth,
    requireActive,
    requireAdmin,
    validate(bettingValidator.updateResults),
    bettingCtrl.returnBet
  )

router
  .route('/returns/:match_id')
  .post(
    requireAuth,
    requireActive,
    requireAdmin,
    validate(bettingValidator.updateResults),
    bettingCtrl.updateReturns
  )

router
  .route('/winners/:match_id')
  .post(
    requireAuth,
    requireActive,
    requireAdmin,
    validate(bettingValidator.updateResults),
    bettingCtrl.updateWinners
  )

router
  .route('/losers/:match_id')
  .post(
    requireAuth,
    requireActive,
    requireAdmin,
    validate(bettingValidator.updateResults),
    bettingCtrl.updateLosers
  )

// LIST ALL BETS
router
  .route('/')
  .get(requireAuth, requireActive, requireAdmin, bettingCtrl.index)

// LIST USER BETS
router
  .route('/:user_id')
  .get(requireAuth, requireActive, requireOwnership, bettingCtrl.user)

// USER PLACE BET
router
  .route('/:user_id')
  .post(
    validate(bettingValidator.create),
    requireAuth,
    requireActive,
    requireOwnership,
    requireWalletCheck,
    requireMatch,
    bettingCtrl.create
  )

// SHOW USER BET
router
  .route('/:user_id/:id')
  .get(requireAuth, requireActive, requireOwnership, bettingCtrl.find)

// ADMIN UPDATE USER BET
router
  .route('/:id')
  .post(
    validate(bettingValidator.update),
    requireAuth,
    requireActive,
    requireAdmin,
    bettingCtrl.update
  )

// ADMIN DELETE USER BET
router
  .route('/:id')
  .post(requireAuth, requireActive, requireAdmin, bettingCtrl.destroy)

export default router
