import request from 'supertest-as-promised'
import httpStatus from 'http-status'
import chai from 'chai'

import CategoryModel from './../../models/category-model'
import MatchModel from './../../models/match-model'

import createTestToken from './../../helpers/create-test-jwt-token'

import app from './../../index'

require('babel-core/register')
require('babel-polyfill')

const expect = chai.expect

chai.config.includeStack = true

describe('## Matches APIs', () => {
  let category
  let match

  before(async () => {
    category = await CategoryModel.create({
      name: 'Test',
      cover_url: '',
      thumbnail_url: ''
    })

    match = await MatchModel.create({
      category: category._id,
      name: 'All new event',
      description: '',
      cover_url: '',
      thumbnail_url: '',
      media_url: '',
      starts_at: Math.floor(new Date().getTime() / 1000) * 2
    })
  })

  after(async () => {
    await MatchModel.remove({})
    await CategoryModel.remove({})
  })

  describe('# GET /api/matches', () => {
    it('should return matches', done => {
      request(app)
        .get('/api/matches')
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('matches')
          expect(res.body.matches).to.have.property('docs')
          expect(res.body.matches).to.have.property('page')
          expect(res.body.matches).to.have.property('limit')
          done()
        })
        .catch(done)
    })
  })

  describe('# GET /api/matches/:id', () => {
    it('should fail and return 404', done => {
      request(app)
        .get('/api/matches/fakeid')
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body).to.have.property('message')
          expect(res.body).to.have.property('status_code')
          done()
        })
        .catch(done)
    })

    it('should succeed and return a player', done => {
      request(app)
        .get('/api/matches/' + match._id)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('match')
          done()
        })
        .catch(done)
    })
  })

  describe('# POST /api/matches', () => {
    it('should fail and return 401', done => {
      request(app)
        .post('/api/matches')
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
        .post('/api/matches')
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
        .post('/api/matches')
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
        .post('/api/matches')
        .set('Authorization', `Bearer ${createTestToken(true)}`)
        .send({
          name: 'Hello World',
          category_id: category._id,
          starts_at: Math.floor(new Date().getTime() / 1000) * 2
        })
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('match')
          done()
        })
        .catch(done)
    })
  })

  describe('# PUT /api/matches/:match_id', () => {
    it('should fail and return 401', done => {
      request(app)
        .put('/api/matches/' + match._id)
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
        .put('/api/matches/' + match._id)
        .send({ name: 0 })
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
        .put('/api/matches/' + match._id)
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
        .put('/api/matches/' + match._id)
        .set('Authorization', `Bearer ${createTestToken(true)}`)
        .send({
          name: 'Hello World',
          category_id: category._id,
          starts_at: Math.floor(new Date().getTime() / 1000) * 2
        })
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('match')
          done()
        })
        .catch(done)
    })
  })

  describe('# DELETE /api/matches/:match_id', () => {
    it('should fail and return 401', done => {
      request(app)
        .del('/api/matches/' + match._id)
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
        .del('/api/matches/' + match._id)
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
        .del('/api/matches/' + match._id)
        .set('Authorization', `Bearer ${createTestToken(true)}`)
        .send({
          name: 'Hello World',
          category_id: category._id,
          starts_at: Math.floor(new Date().getTime() / 1000) * 2
        })
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('match')
          done()
        })
        .catch(done)
    })
  })
})
