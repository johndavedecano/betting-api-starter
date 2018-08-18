import request from 'supertest-as-promised'
import httpStatus from 'http-status'
import chai from 'chai'

import CategoryModel from './../../models/category-model'
import createTestToken from './../../helpers/create-test-jwt-token'

import app from './../../index'

require('babel-core/register')
require('babel-polyfill')

const expect = chai.expect

chai.config.includeStack = true

describe('## Categories APIs', () => {
  let category

  before(async () => {
    category = await CategoryModel.create({
      name: 'Test',
      cover_url: '',
      thumbnail_url: ''
    })
  })

  after(async () => {
    await CategoryModel.remove({})
  })

  describe('# GET /api/categories', () => {
    it('should return categories', done => {
      request(app)
        .get('/api/categories')
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('categories')
          expect(res.body.categories).to.have.property('docs')
          expect(res.body.categories).to.have.property('page')
          expect(res.body.categories).to.have.property('limit')
          done()
        })
        .catch(done)
    })
  })

  describe('# GET /api/categories/:id', () => {
    it('should fail and return 404', done => {
      request(app)
        .get('/api/categories/fakeid')
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body).to.have.property('message')
          expect(res.body).to.have.property('status_code')
          done()
        })
        .catch(done)
    })

    it('should succeed and return a category', done => {
      request(app)
        .get('/api/categories/' + category._id)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('category')
          done()
        })
        .catch(done)
    })
  })

  describe('# POST /api/categories', () => {
    it('should fail and return 401', done => {
      request(app)
        .post('/api/categories')
        .set('Authorization', '')
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body).to.have.property('message')
          expect(res.body).to.have.property('status_code')
          done()
        })
        .catch(done)
    })

    it('should fail with validation error', done => {
      request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${createTestToken(true)}`)
        .expect(httpStatus.UNPROCESSABLE_ENTITY)
        .then(res => {
          expect(res.body).to.have.property('errors')
          done()
        })
        .catch(done)
    })

    it('should fail not admin', done => {
      request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${createTestToken()}`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should be ok', done => {
      request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${createTestToken(true)}`)
        .send({ name: 'Hello World' })
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('category')
          done()
        })
        .catch(done)
    })
  })

  describe('# PUT /api/categories', () => {
    it('should fail and return 401', done => {
      request(app)
        .put('/api/categories/' + category._id)
        .set('Authorization', '')
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body).to.have.property('message')
          expect(res.body).to.have.property('status_code')
          done()
        })
        .catch(done)
    })

    it('should fail with validation error', done => {
      request(app)
        .put('/api/categories/' + category._id)
        .set('Authorization', `Bearer ${createTestToken(true)}`)
        .expect(httpStatus.UNPROCESSABLE_ENTITY)
        .then(res => {
          expect(res.body).to.have.property('errors')
          done()
        })
        .catch(done)
    })

    it('should fail not admin', done => {
      request(app)
        .put('/api/categories/' + category._id)
        .set('Authorization', `Bearer ${createTestToken()}`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should be ok', done => {
      request(app)
        .put('/api/categories/' + category._id)
        .set('Authorization', `Bearer ${createTestToken(true)}`)
        .send({ name: 'Hello World' })
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('category')
          done()
        })
        .catch(done)
    })
  })

  describe('# DELETE /api/categories', () => {
    it('should fail and return 401', done => {
      request(app)
        .del('/api/categories/' + category._id)
        .set('Authorization', '')
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body).to.have.property('message')
          expect(res.body).to.have.property('status_code')
          done()
        })
        .catch(done)
    })

    it('should fail not admin', done => {
      request(app)
        .del('/api/categories/' + category._id)
        .set('Authorization', `Bearer ${createTestToken()}`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should be ok', done => {
      request(app)
        .del('/api/categories/' + category._id)
        .set('Authorization', `Bearer ${createTestToken(true)}`)
        .send({ name: 'Hello World' })
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('category')
          done()
        })
        .catch(done)
    })
  })
})
