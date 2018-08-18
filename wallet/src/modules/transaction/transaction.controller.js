import UserTransactionRepo from 'repos/user-transaction-repo'
import UserWalletRepo from 'repos/user-wallet-repo'

import { COMPLETED, PENDING } from '../../constants'

/**
 * @param req
 * @param res
 * @param next
 *
 * @returns {*}
 */
async function list(req, res, next) {
  try {
    await UserWalletRepo.findWallet(req.params.user_id)

    const transactions = await UserTransactionRepo.list(
      req.params.user_id,
      req.query
    )
    return res.json({
      transactions
    })
  } catch (error) {
    return next(error)
  }
}

/**
 * @param req
 * @param res
 * @param next
 *
 * @returns {*}
 */
async function find(req, res, next) {
  try {
    const transaction = await UserTransactionRepo.findByUserId(
      req.params.user_id,
      req.params.transaction_id
    )
    return res.json({
      transaction: {
        _id: transaction._id,
        currency: transaction.currency,
        status: transaction.status,
        is_archived: transaction.is_archived,
        meta: transaction.meta,
        user_id: transaction.user_id,
        transaction_type: transaction.transaction_type,
        description: transaction.description,
        category: transaction.category,
        amount: transaction.amount,
        transaction_number: transaction.transaction_number,
        updatedAt: transaction.updatedAt,
        createdAt: transaction.createdAt
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @param req
 * @param res
 * @param next
 *
 * @returns {*}
 */
async function create(req, res, next) {
  try {
    const wallet = await UserWalletRepo.findWallet(req.params.user_id)
    const transaction = await UserTransactionRepo.create({
      user_id: wallet.user_id,
      amount: req.body.amount,
      transaction_type: req.body.transaction_type,
      category: req.body.category,
      description: req.body.description,
      status: req.body.status,
      meta: req.body.meta
    })

    if (req.body.status === COMPLETED) {
      await wallet.updateBalance(req.body.transaction_type, req.body.amount)
    }

    return res.json({
      transaction: {
        _id: transaction._id,
        currency: transaction.currency,
        status: transaction.status,
        is_archived: transaction.is_archived,
        meta: transaction.meta,
        user_id: transaction.user_id,
        transaction_type: transaction.transaction_type,
        description: transaction.description,
        category: transaction.category,
        amount: transaction.amount,
        transaction_number: transaction.transaction_number,
        updatedAt: transaction.updatedAt,
        createdAt: transaction.createdAt
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @param req
 * @param res
 * @param next
 *
 * @returns {*}
 */
async function update(req, res, next) {
  try {
    const wallet = await UserWalletRepo.findWallet(req.params.user_id)

    const transaction = await UserTransactionRepo.update(
      req.params.transaction_id,
      {
        category: req.body.category,
        description: req.body.description,
        failure_reason: req.body.failure_reason,
        is_archived: req.body.is_archived,
        meta: req.body.meta,
        status: req.body.status
      }
    )

    if (req.body.status === COMPLETED && transaction.status === PENDING) {
      await wallet.updateBalance(
        transaction.transaction_type,
        transaction.amount
      )
    }

    return res.json({
      transaction
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @param req
 * @param res
 * @param next
 *
 * @returns {*}
 */
async function destroy(req, res, next) {
  try {
    await UserWalletRepo.findWallet(req.params.user_id)

    const transaction = await UserTransactionRepo.destroy(
      req.params.transaction_id
    )

    return res.json({
      transaction: {
        _id: transaction._id,
        currency: transaction.currency,
        status: transaction.status,
        is_archived: transaction.is_archived,
        meta: transaction.meta,
        user_id: transaction.user_id,
        transaction_type: transaction.transaction_type,
        description: transaction.description,
        category: transaction.category,
        amount: transaction.amount,
        transaction_number: transaction.transaction_number,
        updatedAt: transaction.updatedAt,
        createdAt: transaction.createdAt
      }
    })
  } catch (error) {
    next(error)
  }
}

export default {
  list,
  find,
  create,
  update,
  destroy
}
