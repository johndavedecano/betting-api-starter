import mongoose from 'mongoose'
import mongooseTimestamp from 'mongoose-timestamp'
import mongooseSlugPlugin from 'mongoose-slug-plugin'
import mongoosePaginate from 'mongoose-paginate'

const Schema = mongoose.Schema

var PlayerSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    cover_url: {
      type: String
    },
    thumbnail_url: {
      type: String
    },
    score: {
      type: Number,
      default: 0
    },
    is_winner: {
      type: Boolean,
      default: false
    }
  },
  { versionKey: false }
)

mongoosePaginate.paginate.options = {
  docsKey: 'items'
}

PlayerSchema.plugin(mongoosePaginate)

PlayerSchema.plugin(mongooseTimestamp)

PlayerSchema.plugin(mongooseSlugPlugin, { tmpl: '<%=name%>' })

export default mongoose.model('Player', PlayerSchema)
