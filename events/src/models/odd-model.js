import mongoose from 'mongoose'
import mongooseTimestamp from 'mongoose-timestamp'

require('mongoose-double')(mongoose)

const Schema = mongoose.Schema

var MatchOddSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    value: {
      type: Schema.Types.Double,
      required: true
    },
    cover_url: {
      type: String
    },
    thumbnail_url: {
      type: String
    },
    is_winner: {
      type: Boolean,
      default: false
    },
    is_closed: {
      type: Boolean,
      default: false
    }
  },
  { versionKey: false }
)

MatchOddSchema.plugin(mongooseTimestamp)

export default mongoose.model('MatchOdd', MatchOddSchema)
