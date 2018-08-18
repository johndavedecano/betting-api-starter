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

describe('## Matches Odds APIs', () => {
  let category
  let match
  let odd

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

  describe('# POST /api/matches/:id/odds', () => {
    it('should fail and return 401', done => {
      request(app)
        .post('/api/matches/' + match._id + '/odds')
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
        .post('/api/matches/' + match._id + '/odds')
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
        .post('/api/matches/' + match._id + '/odds')
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
        .post('/api/matches/' + match._id + '/odds')
        .set('Authorization', `Bearer ${createTestToken(true)}`)
        .send({
          name: 'Wala',
          description: 'test',
          value: 1.0,
          cover_url: 'x',
          thumbnail_url: 'x'
        })
        .then(res => {
          expect(res.body).to.have.property('match')
          odd = res.body.match.odds[0]
          done()
        })
        .catch(done)
    })
  })

  describe('# PUT /api/matches/:id/odds/:odd_id', () => {
    it('should fail and return 401', done => {
      request(app)
        .put('/api/matches/' + match._id + '/odds/' + odd._id)
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
        .put('/api/matches/' + match._id + '/odds/' + odd._id)
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
        .put('/api/matches/' + match._id + '/odds/' + odd._id)
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
        .put('/api/matches/' + match._id + '/odds/' + odd._id)
        .set('Authorization', `Bearer ${createTestToken(true)}`)
        .send({
          name: 'x',
          description: 'x',
          value: 1.0,
          cover_url: 'x',
          thumbnail_url: 'x'
        })
        .then(res => {
          expect(res.body).to.have.property('match')
          odd = res.body.match.odds[0]
          expect(odd.name).to.equal('x')
          expect(odd.description).to.equal('x')
          expect(odd.cover_url).to.equal('x')
          expect(odd.thumbnail_url).to.equal('x')
          done()
        })
        .catch(done)
    })
  })

  describe('# DELETE /api/matches/:id/odds/:odd_id', () => {
    it('should fail and return 401', done => {
      request(app)
        .delete('/api/matches/' + match._id + '/odds/' + odd._id)
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
        .delete('/api/matches/' + match._id + '/odds/' + odd._id)
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
        .delete('/api/matches/' + match._id + '/odds/' + odd._id)
        .set('Authorization', `Bearer ${createTestToken(true)}`)
        .then(res => {
          expect(res.body).to.have.property('match')
          done()
        })
        .catch(done)
    })
  })
})
