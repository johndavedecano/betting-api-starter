import UserModel from 'models/user-model'

const INVALID_LOGIN_CREDENTIALS = 'Invalid login credentails'
const ACCOUNT_NOT_VERIFIED = 'Account is not verified'
const ACCOUNT_NOT_ACTIVE = 'Account is not active'

class UserRepo {
  /**
   * @param {*} data
   *
   * @returns {Promise}
   */
  create(data) {
    return UserModel.create(data)
  }

  /**
   * @param {String} key
   * @param {*} val
   *
   * @returns {Promise}
   */
  async existsByKey(key, val) {
    return new Promise((resolve, reject) => {
      UserModel.find({ [key]: val }, (err, docs) => {
        if (err) {
          reject(err)
        } else {
          resolve(docs.length > 0)
        }
      }).limit(1)
    })
  }

  /**
   * @param {String} key
   * @param {*} val
   * @param {String} exceptId
   *
   * @returns {Promise}
   */
  async existsByKeyExcept(key, val, exceptId) {
    return new Promise((resolve, reject) => {
      UserModel.find({ [key]: val, _id: { $not: exceptId } }, (err, docs) => {
        if (err) {
          reject(err)
        } else {
          resolve(docs.length > 0)
        }
      }).limit(1)
    })
  }

  /**
   * Find user by email update code.
   *
   * @param {*} token
   *
   * @returns {Promise}
   */
  findByEmailUpdateToken(token) {
    return UserModel.findOne({
      email_update_token: token,
      email_update_expiration: { $gt: Date.now() }
    })
  }

  /**
   * Find user by account verification code.
   *
   * @param {*} token
   *
   * @returns {Promise}
   */
  findByVerificationToken(token) {
    return UserModel.findOne({
      account_verification_token: token,
      account_verification_expiration: { $gt: Date.now() }
    })
  }

  /**
   * Find user by password reset code.
   *
   * @param {*} token
   *
   * @returns {Promise}
   */
  findByResetToken(token) {
    return UserModel.findOne({
      password_reset_token: token,
      password_reset_expiration: { $gt: Date.now() }
    })
  }

  /**
   * @param {*} username
   *
   * @returns {Promise}
   */
  findByUsername(username) {
    return UserModel.findOne({ username })
  }

  /**
   * @param {*} mobile
   *
   * @returns {Promise}
   */
  findByMobile(mobile) {
    return UserModel.findOne({ mobile })
  }

  /**
   * @param {*} email
   *
   * @returns {Promise}
   */
  findByEmail(email) {
    return UserModel.findOne({ email })
  }

  /**
   * @param {*} _id
   *
   * @returns {Promise}
   */
  findById(_id) {
    return UserModel.findById({ _id })
  }

  /**
   * @param {String} username
   *
   * @returns {Promise}
   */
  async loginUserByUsername(username, password) {
    const user = await this.findByUsername(username)

    if (!user) throw new Error(INVALID_LOGIN_CREDENTIALS)

    const { isMatch } = await user.comparePassword(password)

    if (!isMatch) throw new Error(INVALID_LOGIN_CREDENTIALS)

    if (!user.is_verified) throw new Error(ACCOUNT_NOT_VERIFIED)

    if (!user.is_active) throw new Error(ACCOUNT_NOT_ACTIVE)

    return user
  }

  /**
   * @param {String} mobile
   *
   * @returns {Promise}
   */
  async loginUserByMobile(mobile, password) {
    const user = await this.findByMobile(mobile)

    if (!user) throw new Error(INVALID_LOGIN_CREDENTIALS)

    const { isMatch } = await user.comparePassword(password)

    if (!isMatch) throw new Error(INVALID_LOGIN_CREDENTIALS)

    if (!user.is_verified) throw new Error(ACCOUNT_NOT_VERIFIED)

    if (!user.is_active) throw new Error(ACCOUNT_NOT_ACTIVE)

    return user
  }

  /**
   * @param {String} email
   *
   * @returns {Promise}
   */
  async loginUserByEmail(email, password) {
    const user = await this.findByEmail(email)

    if (!user) throw new Error(INVALID_LOGIN_CREDENTIALS)

    const { isMatch } = await user.comparePassword(password)

    if (!isMatch) throw new Error(INVALID_LOGIN_CREDENTIALS)

    if (!user.is_verified) throw new Error(ACCOUNT_NOT_VERIFIED)

    if (!user.is_active) throw new Error(ACCOUNT_NOT_ACTIVE)

    return user
  }
}

export default new UserRepo()
