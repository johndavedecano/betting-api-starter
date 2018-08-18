import mongoose from 'mongoose'
import mongooseHidden from 'mongoose-hidden'
import mongooseTimestamp from 'mongoose-timestamp'
import bcrypt from 'bcrypt-nodejs'
import pick from 'lodash/pick'

const Schema = mongoose.Schema

var UserSchema = new Schema({
  avatar: {
    type: String
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  email_update: {
    type: String
  },
  email_update_token: {
    type: String
  },
  email_update_expiration: {
    type: String
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    hide: true
  },
  password_reset_token: {
    type: String,
    hide: true
  },
  password_reset_expiration: {
    type: Date,
    hide: true
  },
  name: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: false
  },
  account_verification_token: {
    type: String,
    hide: true
  },
  account_verification_expiration: {
    type: Date,
    hide: true
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  is_admin: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: false
  },
  is_otp: {
    type: Boolean,
    default: false
  },
  otp_tmp_secret: {
    type: String,
    default: ''
  },
  otp_secret: {
    type: String,
    default: ''
  }
})

const SALT_FACTOR = 10

UserSchema.pre('save', function(next) {
  const user = this
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
      if (err) {
        return next(err)
      }
      bcrypt.hash(user.password, salt, null, function(err, hash) {
        if (err) {
          return next(err)
        }
        user.password = hash
        next()
      })
    })
  } else {
    return next()
  }
})

const PUBLIC_FIELDS = [
  '_id',
  'name',
  'username',
  'email',
  'is_admin',
  'is_otp',
  'is_verified',
  'is_active',
  'mobile'
]

UserSchema.methods.getPublicFields = function() {
  return pick(this, PUBLIC_FIELDS)
}

UserSchema.methods.comparePassword = function(passw) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(passw, this.password, function(err, isMatch) {
      if (err) reject(err)
      resolve({ isMatch })
    })
  })
}

UserSchema.plugin(mongooseHidden())

UserSchema.plugin(mongooseTimestamp)

export default mongoose.model('User', UserSchema)
