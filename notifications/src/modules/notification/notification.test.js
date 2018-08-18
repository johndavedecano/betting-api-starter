import request from 'supertest-as-promised'
import httpStatus from 'http-status'
import chai from 'chai'

import app from './../../index'
import NotificationModel from '../../models/notification-model'
import createJwtToken from '../../helpers/create-test-jwt-token'

require('babel-core/register')
require('babel-polyfill')

const expect = chai.expect

chai.config.includeStack = true

const userId = '5b22a2a9eef0fe3c488ff833'

const PAYLOAD = (others = {}) => {
  return {
    user_id: userId,
    type: 'general',
    message: 'Hello World',
    meta: {},
    is_seen: false,
    ...others
  }
}

describe('## Notifications APIs', () => {
  let notification

  before(async () => {
    notification = await NotificationModel.create(PAYLOAD())
  })

  after(async () => {
    return await NotificationModel.remove({})
  })

  describe('# GET /api/notifications/:user_id', () => {
    it('should return error', done => {
      request(app)
        .get(`/api/notifications/${userId}`)
        .set('Authorization', `Bearer`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should return ok plain user', done => {
      request(app)
        .get(`/api/notifications/${userId}`)
        .set('Authorization', `Bearer ${createJwtToken()}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('notifications')
          done()
        })
        .catch(done)
    })

    it('should return ok admin', done => {
      request(app)
        .get(`/api/notifications/${userId}`)
        .set('Authorization', `Bearer ${createJwtToken(true)}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('notifications')
          done()
        })
        .catch(done)
    })
  })

  describe('# POST /api/notifications/:user_id', () => {
    it('should return error', done => {
      request(app)
        .post(`/api/notifications/${userId}`)
        .send(PAYLOAD())
        .set('Authorization', `Bearer`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should return unauthorized for plain user', done => {
      request(app)
        .post(`/api/notifications/${userId}`)
        .send(PAYLOAD())
        .set('Authorization', `Bearer ${createJwtToken()}`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should return validation error', done => {
      request(app)
        .post(`/api/notifications/${userId}`)
        .send(PAYLOAD({ type: 'bad-topic' }))
        .set('Authorization', `Bearer ${createJwtToken(true)}`)
        .expect(httpStatus.UNPROCESSABLE_ENTITY)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should return ok admin', done => {
      request(app)
        .post(`/api/notifications/${userId}`)
        .send(PAYLOAD())
        .set('Authorization', `Bearer ${createJwtToken(true)}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('notification')
          done()
        })
        .catch(done)
    })
  })

  describe('# PUT /api/notifications/:user_id/:id', () => {
    it('should return error', done => {
      request(app)
        .put(`/api/notifications/${userId}/${notification._id}`)
        .send(PAYLOAD())
        .set('Authorization', `Bearer`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should return validation error', done => {
      request(app)
        .put(`/api/notifications/${userId}/${notification._id}`)
        .send(PAYLOAD({ type: 'bad-topic' }))
        .set('Authorization', `Bearer ${createJwtToken(true)}`)
        .expect(httpStatus.UNPROCESSABLE_ENTITY)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should not be okay on plain user', done => {
      request(app)
        .put(`/api/notifications/${userId}/${notification._id}`)
        .send(PAYLOAD())
        .set('Authorization', `Bearer ${createJwtToken()}`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should return ok admin but notification not found', done => {
      request(app)
        .put(`/api/notifications/${userId}/5b22a2a9eef0fe3c488ff833`)
        .send(PAYLOAD())
        .set('Authorization', `Bearer ${createJwtToken(true)}`)
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })
  })

  describe('# PUT /api/notifications/:user_id/:id/seen', () => {
    it('should return error', done => {
      request(app)
        .put(`/api/notifications/${userId}/${notification._id}/seen`)
        .set('Authorization', `Bearer`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should not be okay on plain user', done => {
      request(app)
        .put(`/api/notifications/${userId}/${notification._id}/seen`)
        .set('Authorization', `Bearer ${createJwtToken()}`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should return ok admin but notification not found', done => {
      request(app)
        .put(`/api/notifications/${userId}/5b22a2a9eef0fe3c488ff833/seen`)
        .set('Authorization', `Bearer ${createJwtToken(true)}`)
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })
  })

  describe('# GET /api/notifications/:user_id/:id', () => {
    it('should return error', done => {
      request(app)
        .get(`/api/notifications/${userId}/${notification._id}`)
        .set('Authorization', `Bearer`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should be okay on plain user', done => {
      request(app)
        .get(`/api/notifications/${userId}/${notification._id}`)
        .set('Authorization', `Bearer ${createJwtToken()}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('notification')
          done()
        })
        .catch(done)
    })

    it('should return ok admin but notification not found', done => {
      request(app)
        .get(`/api/notifications/${userId}/5b22a2a9eef0fe3c488ff833`)
        .set('Authorization', `Bearer ${createJwtToken(true)}`)
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })
  })

  describe('# DELETE /api/notifications/:user_id', () => {
    it('should return error', done => {
      request(app)
        .del(`/api/notifications/${userId}/${notification._id}`)
        .set('Authorization', `Bearer`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })

    it('should be okay on plain user', done => {
      request(app)
        .del(`/api/notifications/${userId}/${notification._id}`)
        .set('Authorization', `Bearer ${createJwtToken()}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('notification')
          done()
        })
        .catch(done)
    })

    it('should return ok admin but notification not found', done => {
      request(app)
        .del(`/api/notifications/${userId}/5b22a2a9eef0fe3c488ff833`)
        .set('Authorization', `Bearer ${createJwtToken(true)}`)
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body).to.have.property('status_code')
          expect(res.body).to.have.property('message')
          done()
        })
        .catch(done)
    })
  })
})
