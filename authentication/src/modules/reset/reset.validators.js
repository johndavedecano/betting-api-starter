const Joi = require('joi')

export default {
  // POST /api/login
  post: {
    body: {
      email: Joi.string().required()
    }
  },
  put: {
    body: {
      token: Joi.string().required(),
      password: Joi.string()
        .min(6)
        .max(12)
        .required(),
      password_confirmation: Joi.any()
        .valid(Joi.ref('password'))
        .required()
        .options({ language: { any: { allowOnly: 'must match password' } } })
    }
  }
}
