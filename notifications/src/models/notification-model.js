import mongoose from 'mongoose'
import mongooseTimestamp from 'mongoose-timestamp'
import mongoosePaginate from 'mongoose-paginate'

mongoosePaginate.paginate.options = {
  docsKey: 'items'
}

const Schema = mongoose.Schema

var NotificationSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      index: true,
      required: true
    },
    type: {
      type: String,
      enum: ['match', 'wallet', 'bet', 'user', 'general', 'transaction'],
      default: 'general',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    meta: {
      type: Schema.Types.Mixed
    },
    is_seen: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  { versionKey: false }
)

NotificationSchema.plugin(mongoosePaginate)

NotificationSchema.plugin(mongooseTimestamp)

export default mongoose.model('Notification', NotificationSchema)
