import { ModelNotFound } from 'helpers/api-error'
import { MSG_USER_NOTFOUND } from '../constants'

import UserModel from 'models/user-model'

class UserRepo {
  /**
   * @param {*} _id
   *
   * @returns {Promise}
   */
  async findById(_id) {
    try {
      return await UserModel.findById({ _id })
    } catch (err) {
      throw new ModelNotFound(MSG_USER_NOTFOUND)
    }
  }
}

export default new UserRepo()
