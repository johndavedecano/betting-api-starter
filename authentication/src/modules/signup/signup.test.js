import request from 'supertest-as-promised'
import httpStatus from 'http-status'
import chai from 'chai'
import UserModel from 'models/user-model'
import app from './../../index'
import createRandomToken from 'helpers/create-random-token'

require('babel-core/register')
require('babel-polyfill')

const expect = chai.expect

chai.config.includeStack = true

describe('## Signup APIs', () => {
  const validUserCredentials = {
    email: 'react@facebook.com',
    name: 'John Dave Decano',
    username: 'johndavedecano',
    is_admin: false,
    is_verified: true,
    password: 'express',
    mobile: '09292823507'
  }

  before(async () => {
    await UserModel.create(validUserCredentials)
  })

  after(async () => {
    await UserModel.remove({})
  })

  describe('# GET /api/signup', () => {
    it('should return sign up page', done => {
      request(app)
        .get('/api/signup')
        .expect(httpStatus.OK)
        .then(res => {
          done()
        })
        .catch(done)
    })
  })

  describe('# GET /api/signup', () => {
    let token

    before(async () => {
      token = createRandomToken()
      await UserModel.create({
        name: 'Anna Calikot',
        username: 'annahkalikot',
        email: 'annahkalikot@gmail.com',
        password: 'password',
        is_verified: false,
        account_verification_token: token,
        account_verification_expiration: Date.now() + 3600000 // 1hr
      })
    })

    it('should return not found when verifying token', done => {
      request(app)
        .get('/api/signup/verify?token=')
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          done()
        })
        .catch(done)
    })

    it('should be token when passed valid token', done => {
      request(app)
        .get('/api/signup/verify?token=' + token)
        .expect(httpStatus.OK)
        .then(res => {
          done()
        })
        .catch(done)
    })
  })

  describe('# POST /api/signup', () => {
    it('should receive validation error', done => {
      request(app)
        .post('/api/signup')
        .expect(httpStatus.UNPROCESSABLE_ENTITY)
        .then(res => {
          expect(res.body).to.have.property('errors')
          expect(res.body).to.have.property('message')
          expect(res.body).to.have.property('status_code')
          done()
        })
        .catch(done)
    })

    it('should receive error existing email', done => {
      request(app)
        .post('/api/signup')
        .send({
          ...validUserCredentials,
          password_confirmation: 'express',
          username: 'username',
          email: 'react@facebook.com'
        })
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          expect(res.body).to.have.property('message')
          expect(res.body).to.have.property('status_code')
          done()
        })
        .catch(done)
    })

    it('should receive error existing username', done => {
      request(app)
        .post('/api/signup')
        .send({
          ...validUserCredentials,
          password_confirmation: 'express',
          username: 'johndavedecano',
          email: 'sdgdsgdsgdsgs@facebook.com'
        })
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          expect(res.body).to.have.property('message')
          expect(res.body).to.have.property('status_code')
          done()
        })
        .catch(done)
    })

    it('should succeed signup when pass valid details', done => {
      request(app)
        .post('/api/signup')
        .send({
          ...validUserCredentials,
          password_confirmation: 'express',
          username: 'johndavedecanoxxxx',
          email: 'sdgdsgdsgdsgs232323@facebook.com'
        })
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('user')
          done()
        })
        .catch(done)
    })
  })
})
