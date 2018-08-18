import mongoose from 'mongoose'
import mongooseTimestamp from 'mongoose-timestamp'
import mongooseSlugPlugin from 'mongoose-slug-plugin'
import mongoosePaginate from 'mongoose-paginate'

mongoosePaginate.paginate.options = {
  docsKey: 'items'
}

const Schema = mongoose.Schema

var CategorySchema = new Schema(
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
    }
  },
  { versionKey: false }
)

CategorySchema.plugin(mongoosePaginate)

CategorySchema.plugin(mongooseTimestamp)

CategorySchema.plugin(mongooseSlugPlugin, { tmpl: '<%=name%>' })

export default mongoose.model('Category', CategorySchema)
