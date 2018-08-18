import request from 'supertest-as-promised'
import httpStatus from 'http-status'
import chai from 'chai'
import jwt from 'jsonwebtoken'

import app from './../../index'
import config from 'config/config'

require('babel-core/register')
require('babel-polyfill')

const expect = chai.expect

chai.config.includeStack = true

describe('## Wallet APIs', () => {
  let adminToken
  let userToken

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

  before(async () => {
    adminToken = jwt.sign(admin, config.jwtSecret)
    userToken = jwt.sign(user, config.jwtSecret)
  })

  describe('# GET /api/wallet', () => {
    it('should return error', done => {
      request(app)
        .get('/api/wallet')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should return ok', done => {
      request(app)
        .get('/api/wallet')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('wallets')
          done()
        })
        .catch(done)
    })
  })

  describe('# POST /api/wallet', () => {
    it('should return error', done => {
      request(app)
        .post('/api/wallet/' + user._id)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should return ok', done => {
      request(app)
        .post('/api/wallet/' + user._id)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('wallet')
          done()
        })
        .catch(done)
    })
  })

  describe('# PUT /api/wallet', () => {
    it('should return error', done => {
      request(app)
        .put('/api/wallet/' + user._id)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should return ok', done => {
      request(app)
        .put('/api/wallet/' + user._id)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('wallet')
          done()
        })
        .catch(done)
    })
  })

  describe('# DELETE /api/wallet', () => {
    it('should return error', done => {
      request(app)
        .del('/api/wallet/' + user._id)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should return ok', done => {
      request(app)
        .del('/api/wallet/' + user._id)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('wallet')
          done()
        })
        .catch(done)
    })
  })
})
