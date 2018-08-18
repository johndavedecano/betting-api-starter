import chai from 'chai'
import sendResetEmail from './reset-email'
import createRandomToken from 'helpers/create-random-token'
import config from 'config/config'

require('babel-core/register')
require('babel-polyfill')

const expect = chai.expect

chai.config.includeStack = true

/*eslint-disable */

describe('## Reset password emails', () => {
  it('Email should fail', async () => {
    const token = createRandomToken()
    const user = {
      email: 'johndavedecano@gmail.com',
      name: 'John Dave Decano'
    }

    try {
      await sendResetEmail(undefined, {
        name: user.name,
        email: user.email,
        password_reset_url: `${config.app_url}/api/reset?token=${token}`
      })
    } catch (err) {
      expect(err).to.have.property('message')
    }

    return true
  })

  it('Email should succeed', async () => {
    const token = createRandomToken()
    const user = {
      email: 'johndavedecano@gmail.com',
      name: 'John Dave Decano'
    }

    const response = await sendResetEmail(user.email, {
      name: user.name,
      email: user.email,
      password_reset_url: `${config.app_url}/api/reset?token=${token}`
    })

    expect(response).to.have.property('response')
    expect(response).to.have.property('messageId')
    expect(response).to.have.property('envelope')

    return true
  })
})
