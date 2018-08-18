import jwt from 'jsonwebtoken'
import config from './../config/config'

/**
 * Create temporary jwt token for testing.
 *
 * @param {*} is_admin
 *
 * @returns {String}
 */
export default function() {
  return jwt.sign(
    {
      _id: '5b22a2a9eef0fe3c488ff835',
      email: 'admin@admin.com',
      username: 'admin',
      name: 'John Dave Decano',
      mobile: '09292823507',
      is_admin: true,
      is_verified: true,
      is_active: true,
      is_otp: false
    },
    config.jwtSecret
  )
}
