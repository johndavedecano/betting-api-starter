const Joi = require('joi')

const TYPES = ['match', 'wallet', 'bet', 'user', 'general', 'transaction']

export default {
  create: {
    body: {
      user_id: Joi.string().required(),
      type: Joi.string()
        .valid(TYPES)
        .required(),
      message: Joi.string().required(),
      meta: Joi.object(),
      is_seen: Joi.boolean().required()
    }
  },
  update: {
    body: {
      user_id: Joi.string(),
      type: Joi.string().valid(TYPES),
      message: Joi.string(),
      meta: Joi.object(),
      is_seen: Joi.boolean()
    }
  }
}
