import get from 'lodash/get'
import isUndefined from 'lodash/isUndefined'
import { ModelNotFound } from './../helpers/api-error'
import PlayerModel from './../models/player-model'

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

  return await PlayerModel.paginate({}, { limit, page })
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
    const model = await PlayerModel.findById({ _id })

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
  const player = await PlayerModel.create({
    name: params.name,
    cover_url: params.cover_url,
    thumbnail_url: params.thumbnail_url
  })

  return await this.find(player._id)
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
  const player = await this.find(id)

  Object.keys(params).forEach(key => {
    if (!isUndefined(params[key]) && key !== 'category_id') {
      player[key] = params[key]
    }
  })

  return await player.save()
}

/**
 * Delete a document
 *
 * @param {*} id
 *
 * @returns {Promise}
 */
async function destroy(id) {
  const player = await this.find(id)

  return await player.remove()
}

export default {
  list,
  find,
  create,
  update,
  destroy
}
