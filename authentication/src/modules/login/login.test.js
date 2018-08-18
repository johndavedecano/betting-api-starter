import request from 'supertest-as-promised'
import httpStatus from 'http-status'
import chai from 'chai'
import app from './../../index'
import UserModel from 'models/user-model'

require('babel-core/register')
require('babel-polyfill')

const expect = chai.expect

chai.config.includeStack = true

/*eslint-disable */

describe('## Login APIs', () => {
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

  const invalidUserCredentials = {
    email: 'react@facebook.com',
    password: 'IDontKnow'
  }

  let jwtToken

  before(async () => {
    await UserModel.create(validUserCredentials)
  })

  after(async () => {
    await UserModel.remove({})
  })

  describe('# POST /api/login', () => {
    it('should return Authentication error', done => {
      request(app)
        .post('/api/login')
        .send(invalidUserCredentials)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          done()
        })
        .catch(done)
    })

    it('should get valid JWT token', done => {
      request(app)
        .post('/api/login')
        .send({
          email: validUserCredentials.email,
          password: validUserCredentials.password
        })
        .expect(httpStatus.OK)
        .then(res => {
          jwtToken = res.body.token
          expect(res.body).to.have.property('token')
          expect(res.body).to.have.property('user')
          expect(res.body.user.email).to.equal(validUserCredentials.email)
          done()
        })
        .catch(done)
    })

    it('should get valid JWT token using mobile', done => {
      request(app)
        .post('/api/login')
        .send({
          email: validUserCredentials.mobile,
          password: validUserCredentials.password
        })
        .expect(httpStatus.OK)
        .then(res => {
          jwtToken = res.body.token
          expect(res.body).to.have.property('token')
          expect(res.body).to.have.property('user')
          expect(res.body.user.email).to.equal(validUserCredentials.email)
          done()
        })
        .catch(done)
    })

    it('should get valid JWT token using username', done => {
      request(app)
        .post('/api/login')
        .send({
          email: validUserCredentials.username,
          password: validUserCredentials.password
        })
        .expect(httpStatus.OK)
        .then(res => {
          jwtToken = res.body.token
          expect(res.body).to.have.property('token')
          expect(res.body).to.have.property('user')
          expect(res.body.user.email).to.equal(validUserCredentials.email)
          done()
        })
        .catch(done)
    })
  })
})
