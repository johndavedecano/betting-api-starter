import client from './helpers/create-redis-client'
import logger from './helpers/create-redis-logger'

const CHANNELS = ['USER', 'WALLET', 'MATCHES', 'BETTING']

client.on('message', function(channel, message) {
  try {
    logger.log('info', `Message from ${channel} with `, message)
  } catch (err) {
    logger.log(
      'error',
      err.message,
      JSON.stringify({
        channel,
        name: err.name,
        file: err.fileName,
        stack: err.stack,
        line: err.lineNumber,
        column: err.columnNumber
      })
    )
  }
})

client.subscribe(CHANNELS)
