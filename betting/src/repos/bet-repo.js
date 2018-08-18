import get from 'lodash/get'
import isUndefined from 'lodash/isUndefined'
import { ModelNotFound } from './../helpers/api-error'
import BetModel from './../models/bet-model'
import { RETURNED } from '../constants'

/**
 * @param {*} transaction_id
 *
 * @returns {Promise}
 */
async function returnBet(transaction_id) {
  return await BetModel.update(
    { transaction_id },
    { $set: { status: RETURNED } }
  )
}

/**
 * @param {*} match_id
 * @param {*} match_odd_id
 * @param {*} status
 *
 * @returns {Promise}
 */
async function updateBetsStatus(match_id, match_odd_id, status) {
  return await BetModel.update(
    { match_id, match_odd_id },
    { $set: { status } },
    { multi: true }
  )
}

/**
 * List and paginate documents
 *
 * @param {*} params
 *
 * @returns {Promise}
 */
async function list(params = { page: 1, limit: 15 }) {
  const limit = get(params, 'limit', 15)
  const page = get(params, 'page', 1)

  return await BetModel.paginate({}, { limit, page })
}

/**
 * List and paginate documents by user
 *
 * @param {*} params
 *
 * @returns {Promise}
 */
async function listByUser(user_id, params = { page: 1, limit: 15 }) {
  const limit = get(params, 'limit', 15)
  const page = get(params, 'page', 1)

  return await BetModel.paginate({ user_id }, { limit, page })
}

/**
 * Find a document
 *
 * @param {String} _id
 *
 * @returns {Promise}
 */
async function find(_id) {
  try {
    const model = await BetModel.findById({ _id })
    if (!model) throw new Error('Value is null')
    return model
  } catch (err) {
    throw new ModelNotFound('Model not found')
  }
}

/**
 * Create a document
 *
 * @param {Object} params
 *
 * @returns {Promise}
 */
async function create(params) {
  return await BetModel.create(params)
}

/**
 * Update a document
 *
 * @param {String} id
 * @param {Object} params
 *
 * @returns {Promise}
 */
async function update(id, params) {
  const bet = await this.find(id)

  Object.keys(params).forEach(key => {
    if (!isUndefined(params[key])) {
      bet[key] = params[key]
    }
  })

  return await bet.save()
}

/**
 * Delete a document
 *
 * @param {*} id
 *
 * @returns {Promise}
 */
async function destroy(id) {
  const bet = await this.find(id)

  return await bet.remove()
}

export default {
  list,
  listByUser,
  find,
  create,
  update,
  destroy,
  updateBetsStatus,
  returnBet
}
