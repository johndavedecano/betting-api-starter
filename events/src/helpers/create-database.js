import mongoose from 'mongoose'
import util from 'util'

export default ({ config }) => {
  const debug = require('debug')('sabongmobile:index')

  // make bluebird default Promise
  Promise = require('bluebird') // eslint-disable-line no-global-assign

  // plugin bluebird promise in mongoose
  mongoose.Promise = Promise

  // connect to mongo db
  const mongoUri = config.mongo.host

  mongoose.connect(
    mongoUri,
    { server: { socketOptions: { keepAlive: 1 } } }
  )

  // print mongoose logs in dev env
  if (config.mongooseDebug) {
    mongoose.set('debug', (collectionName, method, query, doc) => {
      debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc)
    })
  }

  return mongoose
}
