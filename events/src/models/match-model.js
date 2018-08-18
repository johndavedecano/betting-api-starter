import mongoose from 'mongoose'
import mongooseTimestamp from 'mongoose-timestamp'
import mongooseSlugPlugin from 'mongoose-slug-plugin'
import mongoosePaginate from 'mongoose-paginate'

import { STATUSES, PENDING } from './../constants'

require('mongoose-double')(mongoose)

const Schema = mongoose.Schema

var MatchSchema = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      index: true,
      required: true,
      ref: 'Category'
    },
    players: [{ type: Schema.Types.ObjectId, ref: 'Player', unique: true }],
    odds: [{ type: Schema.Types.ObjectId, ref: 'MatchOdd', unique: true }],
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    cover_url: {
      type: String
    },
    thumbnail_url: {
      type: String
    },
    media_url: {
      type: String
    },
    status: {
      type: String,
      enum: STATUSES,
      default: PENDING,
      index: true
    },
    is_open: {
      type: Boolean,
      default: false
    },
    is_streaming: {
      type: Boolean,
      default: false
    },
    starts_at: {
      type: Number,
      required: true
    }
  },
  { versionKey: false, usePushEach: true }
)

mongoosePaginate.paginate.options = {
  docsKey: 'items'
}

MatchSchema.plugin(mongoosePaginate)

MatchSchema.plugin(mongooseTimestamp)

MatchSchema.plugin(mongooseSlugPlugin, { tmpl: '<%=name%>' })

export default mongoose.model('Match', MatchSchema)
