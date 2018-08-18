const Joi = require('joi')

export default {
  // POST /api/login
  login: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  },
  otp: {
    body: {
      token: Joi.string().required(),
      user_id: Joi.string().required()
    }
  }
}
