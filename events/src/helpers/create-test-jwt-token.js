import jwt from 'jsonwebtoken'
import config from './../config/config'

/**
 * Create temporary jwt token for testing.
 *
 * @param {*} is_admin
 *
 * @returns {String}
 */
export default function(is_admin = false) {
  let admin = {
    _id: '5b22a2a9eef0fe3c488ff835',
    email: 'admin@admin.com',
    username: 'admin',
    name: 'John Dave Decano',
    mobile: '09292823507',
    is_admin: true,
    is_verified: true,
    is_active: true,
    is_otp: false
  }

  let user = {
    _id: '5b22a2a9eef0fe3c488ff833',
    email: 'user@user.com',
    username: 'user',
    name: 'John Dave Decano',
    mobile: '09292823507',
    is_admin: false,
    is_verified: true,
    is_active: true,
    is_otp: false
  }

  return jwt.sign(is_admin ? admin : user, config.jwtSecret)
}
