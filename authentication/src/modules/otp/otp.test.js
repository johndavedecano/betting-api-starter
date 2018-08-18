import request from 'supertest-as-promised'
import httpStatus from 'http-status'
import chai from 'chai'
import jwt from 'jsonwebtoken'
import speakeasy from 'speakeasy'

import app from './../../index'
import config from 'config/config'
import UserModel from 'models/user-model'

require('babel-core/register')
require('babel-polyfill')

const expect = chai.expect

chai.config.includeStack = true

describe('## OTP APIs', () => {
  const validUserCredentials = {
    avatar: '',
    email: 'johndavedecano@gmail.com',
    username: 'johndavedecano',
    name: 'John Dave Decano',
    mobile: '09292823507',
    is_admin: false,
    is_verified: true,
    is_otp: false,
    password: 'password',
    otp_tmp_secret: '',
    otp_secret: ''
  }

  let jwtToken
  let userSecret

  before(async () => {
    const currentUser = await UserModel.create(validUserCredentials)
    const token = jwt.sign(
      {
        _id: currentUser._id,
        email: currentUser.email,
        username: currentUser.username,
        name: currentUser.name,
        mobile: currentUser.mobile,
        is_admin: currentUser.is_admin,
        is_verified: currentUser.is_verified,
        is_otp: currentUser.is_otp
      },
      config.jwtSecret
    )

    jwtToken = `Bearer ${token}`
  })

  after(async () => {
    await UserModel.remove({})
  })

  describe('# POST /api/otp', () => {
    it('should fail due to authentication error.', async () => {
      const response = await request(app).post('/api/otp')
      expect(response.statusCode).to.equal(httpStatus.UNAUTHORIZED)
      expect(response.body).to.have.property('status_code')
      expect(response.body).to.have.property('message')
    })

    it('should be able to get a secret key.', async () => {
      const response = await request(app)
        .post('/api/otp')
        .set('Authorization', jwtToken)
      expect(response.statusCode).to.equal(httpStatus.OK)
      expect(response.body).to.have.property('user')
      expect(response.body).to.have.property('otp')
      expect(response.body.otp).to.have.property('qrcode')
      expect(response.body.otp).to.have.property('secret')
      userSecret = response.body.otp.secret
    })
  })

  describe('# PUT /api/otp', () => {
    it('should fail due to authentication error.', async () => {
      const response = await request(app).put('/api/otp')
      expect(response.statusCode).to.equal(httpStatus.UNAUTHORIZED)
      expect(response.body).to.have.property('status_code')
      expect(response.body).to.have.property('message')
    })

    it('should fail no token provided.', async () => {
      const response = await request(app)
        .put('/api/otp')
        .set('Authorization', jwtToken)
      expect(response.statusCode).to.equal(httpStatus.UNAUTHORIZED)
    })

    it('should succeed on verifying token.', async () => {
      const token = speakeasy.totp({
        secret: userSecret,
        encoding: 'base32'
      })

      const response = await request(app)
        .put('/api/otp')
        .send({ token })
        .set('Authorization', jwtToken)
      expect(response.statusCode).to.equal(httpStatus.OK)
      expect(response.body).to.have.property('user')
      expect(response.body.user.is_otp).to.equal(true)
    })
  })

  describe('# DELETE /api/otp', () => {
    it('should fail due to authentication error.', async () => {
      const response = await request(app).del('/api/otp')
      expect(response.statusCode).to.equal(httpStatus.UNAUTHORIZED)
      expect(response.body).to.have.property('status_code')
      expect(response.body).to.have.property('message')
    })

    it('should succeed deactivating otp.', async () => {
      const token = speakeasy.totp({
        secret: userSecret,
        encoding: 'base32'
      })

      const response = await request(app)
        .del('/api/otp')
        .send({ token })
        .set('Authorization', jwtToken)
      expect(response.statusCode).to.equal(httpStatus.OK)
      expect(response.body).to.have.property('user')
      expect(response.body.user.is_otp).to.equal(false)
    })
  })
})
