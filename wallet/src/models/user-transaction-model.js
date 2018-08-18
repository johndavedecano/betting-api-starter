import mongoose from 'mongoose'
import mongooseHidden from 'mongoose-hidden'
import mongooseTimestamp from 'mongoose-timestamp'
import mongoosePaginate from 'mongoose-paginate'
import currencies from 'config/currencies'
import config from 'config/config'
import createRandomId from 'helpers/create-random-id'

import { TYPES, STATUSES, CATEGORIES } from '../constants'

require('mongoose-currency').loadType(mongoose)

const Currency = mongoose.Types.Currency

const CURRENCIES = Object.keys(currencies)

const Schema = mongoose.Schema

var UserTransactionSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    index: true,
    required: true
  },
  currency: {
    type: String,
    enum: CURRENCIES,
    default: config.defaultCurrency
  },
  amount: {
    type: Currency,
    required: true,
    min: 0
  },
  transaction_number: {
    type: String,
    unique: true,
    index: true
  },
  transaction_type: {
    type: String,
    require: true,
    enum: TYPES,
    index: true
  },
  category: {
    type: String,
    require: true,
    enum: CATEGORIES,
    index: true
  },
  description: {
    type: String,
    require: true
  },
  status: {
    type: String,
    enum: STATUSES,
    index: true,
    default: 'pending'
  },
  failure_reason: {
    type: String
  },
  is_archived: {
    type: Boolean,
    default: false,
    index: true
  },
  meta: {
    type: Object,
    default: {}
  }
})

UserTransactionSchema.pre('save', function(next) {
  const model = this
  if (this.isNew) {
    model.transaction_number = createRandomId()
    next()
  } else {
    return next()
  }
})

UserTransactionSchema.plugin(mongooseHidden())

UserTransactionSchema.plugin(mongooseTimestamp)

UserTransactionSchema.plugin(mongoosePaginate)

mongoosePaginate.paginate.options = {
  docsKey: 'items'
}

export default mongoose.model('UserTransaction', UserTransactionSchema)
