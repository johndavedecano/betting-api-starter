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

describe('## Matches Players APIs', () => {
  let category
  let match
  let player

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

  describe('# POST /api/matches/:id/players', () => {
    it('should fail and return 401', done => {
      request(app)
        .post('/api/matches/' + match._id + '/players')
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
        .post('/api/matches/' + match._id + '/players')
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
        .post('/api/matches/' + match._id + '/players')
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
        .post('/api/matches/' + match._id + '/players')
        .set('Authorization', `Bearer ${createTestToken(true)}`)
        .send({
          name: 'Manny Pacquiao',
          cover_url:
            'https://s3.amazonaws.com/uifaces/faces/twitter/csswizardry/128.jpg',
          thumbnail_url:
            'https://s3.amazonaws.com/uifaces/faces/twitter/csswizardry/128.jpg',
          score: 0,
          is_winner: false
        })
        .then(res => {
          expect(res.body).to.have.property('match')
          player = res.body.match.players[0]
          done()
        })
        .catch(done)
    })
  })

  describe('# POST /api/matches/:id/players/:player_id', () => {
    it('should fail and return 401', done => {
      request(app)
        .put('/api/matches/' + match._id + '/players/' + player._id)
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
        .put('/api/matches/' + match._id + '/players/' + player._id)
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
        .put('/api/matches/' + match._id + '/players/' + player._id)
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
        .put('/api/matches/' + match._id + '/players/' + player._id)
        .set('Authorization', `Bearer ${createTestToken(true)}`)
        .send({
          name: 'x',
          cover_url: 'x',
          thumbnail_url: 'x',
          score: 1,
          is_winner: true
        })
        .then(res => {
          expect(res.body).to.have.property('match')
          player = res.body.match.players[0]
          expect(player.name).to.equal('x')
          expect(player.cover_url).to.equal('x')
          expect(player.thumbnail_url).to.equal('x')
          expect(player.is_winner).to.equal(true)
          expect(player.score).to.equal(1)
          done()
        })
        .catch(done)
    })
  })

  describe('# DELETE /api/matches/:id/players/:player_id', () => {
    it('should fail and return 401', done => {
      request(app)
        .delete('/api/matches/' + match._id + '/players/' + player._id)
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
        .delete('/api/matches/' + match._id + '/players/' + player._id)
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
        .delete('/api/matches/' + match._id + '/players/' + player._id)
        .set('Authorization', `Bearer ${createTestToken(true)}`)
        .send({
          name: 'x',
          cover_url: 'x',
          thumbnail_url: 'x',
          score: 1,
          is_winner: true
        })
        .then(res => {
          expect(res.body).to.have.property('match')
          done()
        })
        .catch(done)
    })
  })
})
