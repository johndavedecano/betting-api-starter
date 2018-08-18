import request from 'supertest-as-promised'
import httpStatus from 'http-status'
import chai from 'chai'
import jwt from 'jsonwebtoken'

import app from './../../index'
import config from 'config/config'
import UserModel from 'models/user-model'

require('babel-core/register')
require('babel-polyfill')

const expect = chai.expect

chai.config.includeStack = true

describe('## User APIs', () => {
  const validUserCredentials = {
    email: 'react@facebook.com',
    name: 'John Dave Decano',
    username: 'johndavedecano',
    is_admin: false,
    is_verified: true,
    is_active: true,
    password: 'express',
    mobile: '09292823507'
  }

  let jwtToken

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
        is_active: currentUser.is_active,
        is_otp: currentUser.is_otp
      },
      config.jwtSecret
    )

    jwtToken = `Bearer ${token}`
  })

  after(async () => {
    await UserModel.remove({})
  })

  describe('# POST /api/user', () => {
    it('should return Authentication error', done => {
      request(app)
        .get('/api/user')
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          done()
        })
        .catch(done)
    })

    it('should get user data', done => {
      request(app)
        .get('/api/user')
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('user')
          expect(res.body.user.email).to.equal(validUserCredentials.email)
          done()
        })
        .catch(done)
    })
  })
})
