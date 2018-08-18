import get from 'lodash/get'
import pick from 'lodash/pick'
import isUndefined from 'lodash/isUndefined'

import {
  MSG_WALLET_NOTFOUND,
  MSG_TRANSACTION_NOTFOUND,
  MSG_TRANSACTION_ARCHIVED,
  MSG_TRANSACTION_FAILED,
  FAILED
} from '../constants'
import { ModelNotFound } from 'helpers/api-error'

import UserTransactionModel from 'models/user-transaction-model'

const FILLABLES = [
  'amount',
  'category',
  'currency',
  'description',
  'failure_reason',
  'is_archived',
  'meta',
  'status',
  'transaction_number',
  'transaction_type',
  'user_id'
]

const DEFAULT_LIMIT = 15

class UserTransactionRepo {
  /**
   * @param {*} user_id
   * @param {*} params
   *
   * @returns {Promise}
   */
  async list(user_id, params = { page: 1, limit: 15 }) {
    try {
      const limit = get(params, 'limit', DEFAULT_LIMIT)
      const page = get(params, 'page', 1)

      return await UserTransactionModel.paginate({ user_id }, { limit, page })
    } catch (err) {
      throw new ModelNotFound(MSG_WALLET_NOTFOUND)
    }
  }

  /**
   * @param {*} user_id
   * @param {*} _id
   *
   * @returns {Promise}
   */
  async findByUserId(user_id, _id) {
    try {
      const transaction = await UserTransactionModel.findOne({ user_id, _id })

      if (!transaction) {
        throw new Error(MSG_TRANSACTION_NOTFOUND)
      }

      return transaction
    } catch (err) {
      throw new ModelNotFound(err.message)
    }
  }

  /**
   * @param {*} _id
   *
   * @returns {Promise}
   */
  async find(_id) {
    try {
      return await UserTransactionModel.findById({ _id })
    } catch (err) {
      throw new ModelNotFound(MSG_TRANSACTION_NOTFOUND)
    }
  }

  /**
   * @param {*} params
   *
   * @returns {Promise}
   */
  create(params) {
    return UserTransactionModel.create(pick(params, FILLABLES))
  }

  /**
   * @param {*} _id
   * @param {*} params
   *
   * @returns {Promise}
   */
  async update(_id, params = {}) {
    const transaction = await this.find(_id)

    if (params.is_archived && transaction.status === PENDING) {
      throw new ModelNotFound(MSG_TRANSACTION_ARCHIVED)
    }

    if (transaction.status === FAILED) {
      // WE CANNOT UPDATE A TRANSACTION THAT IS ALREADY FAILED.
      throw new ModelNotFound(MSG_TRANSACTION_FAILED)
    }

    Object.keys(params).forEach(key => {
      if (FILLABLES.indexOf(key) !== -1 && !isUndefined(params[key])) {
        transaction[key] = params[key]
      }
    })

    return transaction.save()
  }

  /**
   * @param {*} _id
   *
   * @returns {Promise}
   */
  async destroy(_id) {
    const transaction = await this.find(_id)

    return transaction.remove()
  }
}

export default new UserTransactionRepo()
