import {
  MINIMUM_BETTING_AMOUNT,
  ALLLOWED_BETTING_AMOUNT,
  BETTING_STATUSES
} from '../../constants'

const Joi = require('joi')

export default {
  create: {
    body: {
      match_id: Joi.string().required(),
      match_odd_id: Joi.string().required(),
      betting_amount: Joi.number()
        .valid(ALLLOWED_BETTING_AMOUNT)
        .min(MINIMUM_BETTING_AMOUNT)
        .required()
    }
  },
  update: {
    body: {
      match_id: Joi.string(),
      match_odd_id: Joi.string(),
      transaction_id: Joi.string(),
      reference_number: Joi.string(),
      status: Joi.string().valid(BETTING_STATUSES),
      betting_amount: Joi.string().number(),
      winning_amount: Joi.string().number(),
      profit: Joi.string().number(),
      odd: Joi.string().number()
    }
  },
  updateResults: {
    body: {
      match_odd_id: Joi.string().required()
    }
  }
}
