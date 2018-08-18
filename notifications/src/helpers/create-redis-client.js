import redis from 'redis'
import config from './../config/config'
import logger from './create-redis-logger'

const client = redis.createClient({
  host: config.redis.host,
  port: config.redis.port
})

client.on('ready', function() {
  logger.log('info', 'Successfully connected to server.')
})

client.on('error', function(err) {
  logger.log('error', err.message, {
    name: err.name,
    file: err.fileName,
    stack: err.stack,
    line: err.lineNumber,
    column: err.columnNumber
  })
})

export default client
