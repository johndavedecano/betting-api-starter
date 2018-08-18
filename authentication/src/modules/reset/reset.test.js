import request from 'supertest-as-promised'
import httpStatus from 'http-status'
import chai from 'chai'
import app from './../../index'
import UserModel from 'models/user-model'
import createRandomToken from 'helpers/create-random-token'

require('babel-core/register')
require('babel-polyfill')

chai.config.includeStack = true

/*eslint-disable */

describe('## Reset Password APIs', () => {
  const validUserCredentials = {
    email: 'react@facebook.com',
    name: 'John Dave Decano',
    username: 'johndavedecano',
    is_admin: false,
    is_verified: true,
    password: 'express',
    mobile: '09292823507'
  }

  after(async () => {
    await UserModel.remove({})
  })

  describe('# PUT /api/reset', () => {
    let token

    before(async () => {
      token = await createRandomToken()
      await UserModel.create({
        ...validUserCredentials,
        username: 'myusername',
        email: 'myemail@gmail.com',
        password_reset_token: token,
        password_reset_expiration: Date.now() + 3600000
      })
    })

    it('should get validation error', done => {
      request(app)
        .put('/api/reset')
        .expect(httpStatus.UNPROCESSABLE_ENTITY)
        .then(() => done())
        .catch(done)
    })

    it('should get user not found', done => {
      request(app)
        .put('/api/reset')
        .send({
          token: 'invalidtoken',
          password: 'password',
          password_confirmation: 'password'
        })
        .expect(httpStatus.NOT_FOUND)
        .then(() => done())
        .catch(done)
    })

    it('should be ok when resetting password', done => {
      request(app)
        .put('/api/reset')
        .send({
          token: token,
          password: 'password',
          password_confirmation: 'password'
        })
        .expect(httpStatus.OK)
        .then(() => done())
        .catch(done)
    })
  })

  describe('# POST /api/reset', () => {
    before(async () => {
      await UserModel.create(validUserCredentials)
    })

    it('should get validation error', done => {
      request(app)
        .post('/api/reset')
        .expect(httpStatus.UNPROCESSABLE_ENTITY)
        .then(() => done())
        .catch(done)
    })

    it('should get user not found', done => {
      request(app)
        .post('/api/reset')
        .send({ email: 'random@email.com' })
        .expect(httpStatus.NOT_FOUND)
        .then(() => done())
        .catch(done)
    })

    it('should be ok when sending reset email', done => {
      request(app)
        .post('/api/reset')
        .send({ email: 'react@facebook.com' })
        .expect(httpStatus.OK)
        .then(() => done())
        .catch(done)
    })
  })
})
