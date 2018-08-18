import moment from 'moment'
import Joi from 'joi'

import { STATUSES } from './../../constants'

export default {
  create: {
    body: {
      category_id: Joi.string()
        .trim()
        .required(),
      name: Joi.string()
        .trim()
        .required(),
      description: Joi.string().trim(),
      cover_url: Joi.string().trim(),
      thumbnail_url: Joi.string().trim(),
      media_url: Joi.string().trim(),
      starts_at: Joi.date()
        .timestamp()
        .min(moment().unix())
        .raw()
        .required()
    }
  },
  update: {
    body: {
      category_id: Joi.string().trim(),
      name: Joi.string().trim(),
      description: Joi.string().trim(),
      cover_url: Joi.string().trim(),
      thumbnail_url: Joi.string().trim(),
      media_url: Joi.string().trim(),
      status: Joi.valid(STATUSES),
      is_open: Joi.boolean(),
      is_streaming: Joi.boolean(),
      starts_at: Joi.date()
        .timestamp()
        .min(moment().unix())
        .raw()
    }
  },
  updateStatus: {
    body: {
      status: Joi.valid(STATUSES).required()
    }
  },
  addPlayer: {
    body: {
      name: Joi.string().required(),
      cover_url: Joi.string(),
      thumbnail_url: Joi.string(),
      is_winner: Joi.boolean(),
      score: Joi.number()
    }
  },
  updatePlayer: {
    body: {
      name: Joi.string().required(),
      cover_url: Joi.string(),
      thumbnail_url: Joi.string(),
      is_winner: Joi.boolean(),
      score: Joi.number()
    }
  },
  addOdd: {
    body: {
      name: Joi.string().required(),
      description: Joi.string().required(),
      value: Joi.number().required(),
      cover_url: Joi.string(),
      thumbnail_url: Joi.string()
    }
  },
  updateOdd: {
    body: {
      name: Joi.string().required(),
      description: Joi.string().required(),
      value: Joi.number().required(),
      cover_url: Joi.string(),
      thumbnail_url: Joi.string()
    }
  }
}
