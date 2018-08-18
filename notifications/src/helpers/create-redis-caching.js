import cachegoose from 'cachegoose'

import config from './../config/config'

export default function(mongoose) {
  return cachegoose(mongoose, {
    engine: 'redis',
    port: config.redis.port || 6379,
    host: config.redis.host || 'localhost'
  })
}
