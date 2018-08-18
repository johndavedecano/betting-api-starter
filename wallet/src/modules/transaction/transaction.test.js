import request from 'supertest-as-promised'
import httpStatus from 'http-status'
import chai from 'chai'
import jwt from 'jsonwebtoken'

import app from './../../index'
import config from 'config/config'

import UserWalletModel from 'models/user-wallet-model'
import UserTransactionModel from 'models/user-transaction-model'

require('babel-core/register')
require('babel-polyfill')

const expect = chai.expect

chai.config.includeStack = true

describe('## Transaction APIs', () => {
  let adminToken
  let userToken
  let userWithWalletToken

  let admin = {
    _id: '5b22a2a9eef0fe3c488ff835',
    email: 'admin@admin.com',
    username: 'admin',
    name: 'John Dave Decano',
    mobile: '09292823507',
    is_admin: true,
    is_verified: true,
    is_otp: false,
    is_active: true
  }

  let user = {
    _id: '5b22a2a9eef0fe3c488ff833',
    email: 'user@user.com',
    username: 'user',
    name: 'John Dave Decano',
    mobile: '09292823507',
    is_admin: false,
    is_verified: true,
    is_otp: false,
    is_active: true
  }

  let userWithWallet = {
    _id: '5b22a2a9eef0fe3c488ff075',
    email: 'user2@user2.com',
    username: 'use2r',
    name: 'John Dave Decano',
    mobile: '09292823507',
    is_admin: false,
    is_verified: true,
    is_otp: false,
    is_active: true
  }

  before(async () => {
    adminToken = jwt.sign(admin, config.jwtSecret)
    userToken = jwt.sign(user, config.jwtSecret)
    userWithWalletToken = jwt.sign(userWithWallet, config.jwtSecret)

    await UserWalletModel.create({
      user_id: userWithWallet._id,
      is_active: true,
      is_verified: true,
      balance: 0
    })
  })

  after(async () => {
    await UserWalletModel.remove({})
    await UserTransactionModel.remove({})
  })

  describe('# GET /api/transactions/:user_id', () => {
    it('should return error user cant view others', done => {
      request(app)
        .get('/api/transactions/fake_id')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should return error user wallet not found', done => {
      request(app)
        .get('/api/transactions/' + user._id)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should return error user wallet not found using admin token', done => {
      request(app)
        .get('/api/transactions/' + user._id)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should return success as can view by admin', done => {
      request(app)
        .get('/api/transactions/' + userWithWallet._id)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('transactions')
          done()
        })
        .catch(done)
    })

    it('should return success as can view by user himself', done => {
      request(app)
        .get('/api/transactions/' + userWithWallet._id)
        .set('Authorization', `Bearer ${userWithWalletToken}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('transactions')
          done()
        })
        .catch(done)
    })
  })

  describe('# POST /api/transactions/:user_id', () => {
    it('should return error user cant view others', done => {
      request(app)
        .post('/api/transactions/fake_id')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should return error wallet not found', done => {
      request(app)
        .post('/api/transactions/fake_id')
        .send({
          status: 'pending',
          transaction_type: 'credit',
          category: 'deposit',
          amount: 10,
          description: 'Added money from bank'
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should return error validation error', done => {
      request(app)
        .post('/api/transactions/' + userWithWallet._id)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(httpStatus.UNPROCESSABLE_ENTITY)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should return success', done => {
      request(app)
        .post('/api/transactions/' + userWithWallet._id)
        .send({
          status: 'pending',
          transaction_type: 'credit',
          category: 'deposit',
          amount: 10,
          description: 'Added money from bank'
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('transaction')
          done()
        })
        .catch(done)
    })
  })

  describe('# PUT /api/transactions/:user_id', () => {
    let transaction

    before(async () => {
      try {
        transaction = await UserTransactionModel.create({
          user_id: userWithWallet._id,
          status: 'pending',
          transaction_type: 'credit',
          category: 'deposit',
          amount: 10,
          description: 'Added money from bank'
        })
      } catch (error) {
        console.error(error)
      }
    })

    it('should return error user cant view others', done => {
      request(app)
        .put('/api/transactions/fake_id/' + transaction._id)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should return error wallet not found', done => {
      request(app)
        .put('/api/transactions/fake_id/' + transaction._id)
        .send({
          status: 'pending',
          transaction_type: 'credit',
          category: 'deposit',
          amount: 10,
          description: 'Added money from bank'
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should return success since fields are optional', done => {
      request(app)
        .put('/api/transactions/' + userWithWallet._id + '/' + transaction._id)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('transaction')
          expect(res.body.transaction.amount).to.be.a('number')
          done()
        })
        .catch(done)
    })

    it('should return success', done => {
      request(app)
        .put('/api/transactions/' + userWithWallet._id + '/' + transaction._id)
        .send({
          status: 'pending',
          transaction_type: 'credit',
          category: 'deposit',
          amount: 10,
          description: 'Added money from bank'
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('transaction')
          done()
        })
        .catch(done)
    })
  })

  describe('# GET /api/transactions/:user_id/:transaction_id', () => {
    let transaction

    before(async () => {
      try {
        transaction = await UserTransactionModel.create({
          user_id: userWithWallet._id,
          status: 'pending',
          transaction_type: 'credit',
          category: 'deposit',
          amount: 10,
          description: 'Added money from bank'
        })
      } catch (error) {
        console.error(error)
      }
    })

    it('should return error user cant view others', done => {
      request(app)
        .get('/api/transactions/fake_id/' + transaction._id)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should return error wallet not found', done => {
      request(app)
        .get('/api/transactions/fake_id/' + transaction._id)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should return success since fields are optional', done => {
      request(app)
        .get('/api/transactions/' + userWithWallet._id + '/' + transaction._id)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('transaction')
          expect(res.body.transaction.amount).to.be.a('number')
          done()
        })
        .catch(done)
    })

    it('should return success', done => {
      request(app)
        .get('/api/transactions/' + userWithWallet._id + '/' + transaction._id)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('transaction')
          done()
        })
        .catch(done)
    })
  })

  describe('# DELETE /api/transactions/:user_id/:transaction_id', () => {
    let transaction

    before(async () => {
      try {
        transaction = await UserTransactionModel.create({
          user_id: userWithWallet._id,
          status: 'pending',
          transaction_type: 'credit',
          category: 'deposit',
          amount: 10,
          description: 'Added money from bank'
        })
      } catch (error) {
        console.error(error)
      }
    })

    it('should return error user cant view others', done => {
      request(app)
        .del('/api/transactions/fake_id/' + transaction._id)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should return error wallet not found', done => {
      request(app)
        .del('/api/transactions/fake_id/' + transaction._id)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should return success', done => {
      request(app)
        .del('/api/transactions/' + userWithWallet._id + '/' + transaction._id)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('transaction')
          done()
        })
        .catch(done)
    })
  })
})
