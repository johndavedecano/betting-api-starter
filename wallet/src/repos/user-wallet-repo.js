import get from 'lodash/get'
import isUndefined from 'lodash/isUndefined'

import { ModelNotFound } from 'helpers/api-error'
import { MSG_WALLET_NOTFOUND } from '../constants'

import UserWalletModel from 'models/user-wallet-model'

const WALLET_FILLABLES = ['currency', 'balance', 'is_active', 'is_verified']
const DEFAULT_LIMIT = 15

class UserWalletRepo {
  /**
   *
   * @param {*} params
   */
  async getWallets(params = { page: 1, limit: 15 }) {
    const limit = get(params, 'limit', DEFAULT_LIMIT)
    const page = get(params, 'page', 1)

    return await UserWalletModel.paginate({}, { limit, page })
  }

  /**
   * @param {*} user_id
   *
   * @returns {Promise}
   */
  async findWallet(user_id) {
    try {
      const wallet = await UserWalletModel.findOne({
        user_id
      })

      if (!wallet) {
        throw new Error(MSG_WALLET_NOTFOUND)
      }

      return wallet
    } catch (error) {
      throw new ModelNotFound(error.message)
    }
  }

  /**
   * @param {*} user_id
   * @param {*} params
   *
   * @returns {Promise}
   */
  createWallet(user_id, params = {}) {
    return UserWalletModel.create({
      user_id,
      is_active: true,
      is_verified: true,
      balance: 0,
      ...params
    })
  }

  /**
   * @param {*} user_id
   * @param {*} params
   *
   * @returns {Promise}
   */
  async updateWallet(user_id, params = {}) {
    const wallet = await this.findWallet(user_id)

    Object.keys(params).forEach(key => {
      if (WALLET_FILLABLES.indexOf(key) !== -1 && !isUndefined(params[key])) {
        wallet[key] = params[key]
      }
    })

    return wallet.save()
  }

  /**
   * @param {*} user_id
   *
   * @returns {Promise}
   */
  async destroyWallet(user_id) {
    const wallet = await this.findWallet(user_id)

    return wallet.remove()
  }
}

export default new UserWalletRepo()
