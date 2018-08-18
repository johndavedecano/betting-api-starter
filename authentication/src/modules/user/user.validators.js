const Joi = require('joi')

export default {
  email: {
    body: {
      email: Joi.string()
        .email()
        .required()
    }
  },
  password: {
    body: {
      password: Joi.string()
        .min(6)
        .max(12)
        .required(),
      password_confirmation: Joi.any()
        .valid(Joi.ref('password'))
        .required()
        .options({ language: { any: { allowOnly: 'must match password' } } })
    }
  },
  profile: {
    body: {
      name: Joi.string().required(),
      username: Joi.string().required(),
      mobile: Joi.string().required()
    }
  }
}
