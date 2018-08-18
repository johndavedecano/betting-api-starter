import { Router } from 'express'
import validate from 'express-validation'
import matchCtrl from './match.controller'
import matchValidator from './match.validator'

import jwtMiddleware from './../../middlewares/jwt-middleware'
import adminMiddleware from './../../middlewares/acl-middleware'

const router = Router()

router.route('/').get(matchCtrl.index)

router
  .route('/')
  .post(
    jwtMiddleware,
    adminMiddleware,
    validate(matchValidator.create),
    matchCtrl.create
  )

router.route('/:id').get(matchCtrl.find)

router
  .route('/:id')
  .put(
    jwtMiddleware,
    adminMiddleware,
    validate(matchValidator.update),
    matchCtrl.update
  )

router.route('/:id').delete(jwtMiddleware, adminMiddleware, matchCtrl.destroy)

router
  .route('/:id/betting-status')
  .put(jwtMiddleware, adminMiddleware, matchCtrl.bettingStatusOpen)

router
  .route('/:id/betting-status')
  .delete(jwtMiddleware, adminMiddleware, matchCtrl.bettingStatusClose)

router
  .route('/:id/match-status')
  .put(
    jwtMiddleware,
    adminMiddleware,
    validate(matchValidator.updateStatus),
    matchCtrl.matchStatus
  )

router
  .route('/:id/players')
  .post(
    jwtMiddleware,
    adminMiddleware,
    validate(matchValidator.addPlayer),
    matchCtrl.addPlayer
  )

router
  .route('/:id/players/:player_id')
  .put(
    jwtMiddleware,
    adminMiddleware,
    validate(matchValidator.updatePlayer),
    matchCtrl.updatePlayer
  )

router
  .route('/:id/players/:player_id')
  .delete(jwtMiddleware, adminMiddleware, matchCtrl.removePlayer)

router
  .route('/:id/odds')
  .post(
    jwtMiddleware,
    adminMiddleware,
    validate(matchValidator.addOdd),
    matchCtrl.addOdd
  )

router
  .route('/:id/odds/:odd_id')
  .put(
    jwtMiddleware,
    adminMiddleware,
    validate(matchValidator.addOdd),
    matchCtrl.updateOdd
  )

router
  .route('/:id/odds/:odd_id')
  .delete(jwtMiddleware, adminMiddleware, matchCtrl.removeOdd)

router
  .route('/:id/winner/:odd_id')
  .post(jwtMiddleware, adminMiddleware, matchCtrl.addWinner)

export default router
