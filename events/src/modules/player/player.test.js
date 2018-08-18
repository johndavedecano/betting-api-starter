import request from 'supertest-as-promised'
import httpStatus from 'http-status'
import chai from 'chai'

import PlayerModel from './../../models/player-model'
import createTestToken from './../../helpers/create-test-jwt-token'

import app from './../../index'

require('babel-core/register')
require('babel-polyfill')

const expect = chai.expect

chai.config.includeStack = true

describe('## players APIs', () => {
  let player

  before(async () => {
    player = await PlayerModel.create({
      name: 'Test',
      cover_url: '',
      thumbnail_url: '',
      score: 0,
      is_winner: false
    })
  })

  after(async () => {
    await PlayerModel.remove({})
  })

  describe('# GET /api/players', () => {
    it('should return players', done => {
      request(app)
        .get('/api/players')
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('players')
          expect(res.body.players).to.have.property('docs')
          expect(res.body.players).to.have.property('page')
          expect(res.body.players).to.have.property('limit')
          done()
        })
        .catch(done)
    })
  })

  describe('# GET /api/players/:id', () => {
    it('should fail and return 404', done => {
      request(app)
        .get('/api/players/fakeid')
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
        .get('/api/players/' + player._id)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('player')
          done()
        })
        .catch(done)
    })
  })

  describe('# POST /api/players', () => {
    it('should fail and return 401', done => {
      request(app)
        .post('/api/players')
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
        .post('/api/players')
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
        .post('/api/players')
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
        .post('/api/players')
        .set('Authorization', `Bearer ${createTestToken(true)}`)
        .send({ name: 'Hello World' })
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('player')
          done()
        })
        .catch(done)
    })
  })

  describe('# PUT /api/players', () => {
    it('should fail and return 401', done => {
      request(app)
        .put('/api/players/' + player._id)
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
        .put('/api/players/' + player._id)
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
        .put('/api/players/' + player._id)
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
        .put('/api/players/' + player._id)
        .set('Authorization', `Bearer ${createTestToken(true)}`)
        .send({ name: 'Hello World' })
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('player')
          done()
        })
        .catch(done)
    })
  })

  describe('# DELETE /api/players', () => {
    it('should fail and return 401', done => {
      request(app)
        .del('/api/players/' + player._id)
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
        .del('/api/players/' + player._id)
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
        .del('/api/players/' + player._id)
        .set('Authorization', `Bearer ${createTestToken(true)}`)
        .send({ name: 'Hello World' })
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('player')
          done()
        })
        .catch(done)
    })
  })
})
