import httpStatus from 'http-status'
import get from 'lodash/get'
import BetRepo from 'repos/bet-repo'
import APIError from 'helpers/api-error'
import TransactionService from 'services/transaction-service'
import createReferenceNumber from 'helpers/create-random-id'
import calculateProfit from 'helpers/calculate-profit'

import {
  MSG_MATCH_CLOSE,
  MSG_INSUFFICIENT_BALANCE,
  MSG_ODD_NOTFOUND,
  PENDING,
  COMPLETED,
  CREDIT,
  WIN,
  LOSE,
  BET,
  RETURNED
} from './../../constants'

/**
 * Update all winners
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function returnBet(req, res, next) {
  try {
    const bets = await BetRepo.returnBet(req.params.transaction_id)
    return res.json({ bets })
  } catch (error) {
    return next(error)
  }
}

/**
 * Update all returns
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function updateReturns(req, res, next) {
  try {
    const bets = await BetRepo.updateBetsStatus(
      req.params.match_id,
      req.body.match_odd_id,
      RETURNED
    )
    return res.json({ bets })
  } catch (error) {
    return next(error)
  }
}

/**
 * Update all winners
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function updateWinners(req, res, next) {
  try {
    const bets = await BetRepo.updateBetsStatus(
      req.params.match_id,
      req.body.match_odd_id,
      WIN
    )
    return res.json({ bets })
  } catch (error) {
    return next(error)
  }
}

/**
 * Update all losers
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function updateLosers(req, res, next) {
  try {
    const bets = await BetRepo.updateBetsStatus(
      req.params.match_id,
      req.body.match_odd_id,
      LOSE
    )
    return res.json({ bets })
  } catch (error) {
    return next(error)
  }
}

/**
 * List and paginate resources
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function index(req, res, next) {
  try {
    const bets = await BetRepo.list(req.query)
    return res.json({ bets })
  } catch (error) {
    return next(error)
  }
}

/**
 * List and paginate resources
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function user(req, res, next) {
  try {
    const bets = await BetRepo.listByUser(req.params.user_id, req.query)
    return res.json({ bets })
  } catch (error) {
    return next(error)
  }
}

/**
 * Show a resource
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function find(req, res, next) {
  try {
    const bet = await BetRepo.find(req.params.id)
    return res.json({ bet })
  } catch (error) {
    return next(error)
  }
}

/**
 * Create a bet
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function create(req, res, next) {
  try {
    const user = get(req, 'user', {})
    const match = get(req, 'match', { odds: [] })
    const wallet = get(req, 'user.wallet', {})
    const amount = get(req, 'body.betting_amount', 0)

    const odd = match.odds.filter(p => p._id === req.body.match_odd_id).pop()

    if (!odd) {
      throw new APIError(MSG_ODD_NOTFOUND, httpStatus.NOT_FOUND)
    }

    if (amount > wallet.balance) {
      throw new APIError(MSG_INSUFFICIENT_BALANCE, httpStatus.BAD_REQUEST)
    }

    if (!match.is_open) {
      throw new APIError(MSG_MATCH_CLOSE, httpStatus.BAD_REQUEST)
    }

    const referenceNumber = createReferenceNumber()

    const response = await TransactionService.createTransaction(user._id, {
      amount,
      description: `Bet reference ID: ${referenceNumber}`,
      status: COMPLETED,
      transaction_type: CREDIT,
      category: BET
    })

    const transaction = get(response, 'data.transaction')
    const profit = calculateProfit(odd.value, amount)

    const bet = await BetRepo.create({
      user_id: user._id,
      match_id: match._id,
      match_odd_id: odd._id,
      transaction_id: transaction._id,
      reference_number: referenceNumber,
      status: PENDING,
      betting_amount: amount,
      winning_amount: profit + amount,
      profit,
      odd: odd.value
    })

    return res.json({
      bet,
      transaction
    })
  } catch (error) {
    console.error(error)
    return next(error)
  }
}

/**
 * Update a resource
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function update(req, res, next) {
  try {
    const bet = await BetRepo.update(req.params.id, req.body)
    return res.json({ bet })
  } catch (error) {
    return next(error)
  }
}

/**
 * Delete a resource
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function destroy(req, res, next) {
  try {
    const bet = await BetRepo.destroy(req.params.id)
    return res.json({ bet })
  } catch (error) {
    return next(error)
  }
}

export default {
  index,
  user,
  find,
  create,
  update,
  destroy,
  updateWinners,
  updateLosers,
  updateReturns,
  returnBet
}
