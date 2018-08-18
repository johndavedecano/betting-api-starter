import get from 'lodash/get'
import isUndefined from 'lodash/isUndefined'
import { ModelNotFound } from './../helpers/api-error'
import CategoryModel from './../models/category-model'

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

  return await CategoryModel.paginate({}, { limit, page })
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
    const model = await CategoryModel.findById({ _id })
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
  return await CategoryModel.create(params)
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
  const category = await this.find(id)

  Object.keys(params).forEach(key => {
    if (!isUndefined(params[key])) {
      category[key] = params[key]
    }
  })

  return await category.save()
}

/**
 * Delete a document
 *
 * @param {*} id
 *
 * @returns {Promise}
 */
async function destroy(id) {
  const category = await this.find(id)

  return await category.remove()
}

export default { list, find, create, update, destroy }
