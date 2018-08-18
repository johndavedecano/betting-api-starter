import mongoose from 'mongoose'
import mongooseHidden from 'mongoose-hidden'
import mongooseTimestamp from 'mongoose-timestamp'
import mongoosePaginate from 'mongoose-paginate'
import currencies from 'config/currencies'
import config from 'config/config'
import createRandomId from 'helpers/create-random-id'

import { CREDIT, DEBIT, MSG_INSUFFICIENT_BALANCE } from '../constants'

require('mongoose-currency').loadType(mongoose)

const Currency = mongoose.Types.Currency

const CURRENCIES = Object.keys(currencies)

const Schema = mongoose.Schema

var UserWalletSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    unique: true,
    index: true,
    required: true
  },
  account_number: {
    type: String,
    unique: true,
    index: true
  },
  currency: {
    type: String,
    enum: CURRENCIES,
    default: config.defaultCurrency
  },
  balance: {
    type: Currency,
    min: 0,
    default: 0
  },
  is_active: {
    type: Boolean,
    default: true
  },
  is_verified: {
    type: Boolean,
    default: true
  }
})

UserWalletSchema.pre('save', function(next) {
  const model = this
  if (this.isNew) {
    model.account_number = createRandomId()
    next()
  } else {
    return next()
  }
})

UserWalletSchema.methods.updateBalance = async function(type, amount) {
  let balance = this.balance
  if (type === CREDIT) {
    if (amount > this.balance) {
      throw new Error(MSG_INSUFFICIENT_BALANCE)
    }
    this.balance = balance - amount
    await this.save()
  } else if (type === DEBIT) {
    balance = balance + amount
    this.balance = balance
    await this.save()
  } else {
    return
  }
}

UserWalletSchema.plugin(mongooseHidden())

UserWalletSchema.plugin(mongooseTimestamp)

UserWalletSchema.plugin(mongoosePaginate)

mongoosePaginate.paginate.options = {
  docsKey: 'items'
}

export default mongoose.model('UserWallet', UserWalletSchema)
