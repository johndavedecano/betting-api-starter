const Joi = require('joi')

import { CATEGORIES, STATUSES, TYPES } from '../../constants'

export default {
  create: {
    body: {
      amount: Joi.number().required(),
      description: Joi.string().required(),
      status: Joi.string()
        .optional()
        .valid(STATUSES),
      transaction_type: Joi.string()
        .required()
        .valid(TYPES),
      category: Joi.string()
        .required()
        .valid(CATEGORIES)
    }
  },
  update: {
    body: {
      is_archived: Joi.boolean().optional(),
      description: Joi.string().optional(),
      failure_reason: Joi.string().optional(),
      meta: Joi.object().optional(),
      status: Joi.string()
        .optional()
        .valid(STATUSES),
      category: Joi.string()
        .optional()
        .valid(CATEGORIES)
    }
  }
}
