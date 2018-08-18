import get from 'lodash/get'
import isUndefined from 'lodash/isUndefined'
import { ModelNotFound } from './../helpers/api-error'
import NotificationModel from './../models/notification-model'

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

  return await NotificationModel.paginate({}, { limit, page })
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

  return await NotificationModel.paginate({ user_id }, { limit, page })
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
    const model = await NotificationModel.findById({ _id })
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
  return await NotificationModel.create(params)
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
  const notification = await this.find(id)

  Object.keys(params).forEach(key => {
    if (!isUndefined(params[key])) {
      notification[key] = params[key]
    }
  })

  return await notification.save()
}

/**
 * Delete a document
 *
 * @param {*} id
 *
 * @returns {Promise}
 */
async function destroy(id) {
  const notification = await this.find(id)

  return await notification.remove()
}

export default { list, listByUser, find, create, update, destroy }
