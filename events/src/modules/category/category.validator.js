const Joi = require('joi')

export default {
  create: {
    body: {
      name: Joi.string()
        .required()
        .trim(),
      cover_url: Joi.string(),
      thumbnail_url: Joi.string()
    }
  },
  update: {
    body: {
      name: Joi.string()
        .required()
        .trim(),
      cover_url: Joi.string(),
      thumbnail_url: Joi.string()
    }
  }
}
