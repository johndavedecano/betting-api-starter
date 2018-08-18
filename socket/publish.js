const dotenv = require('dotenv')
const path = require('path')
const redis = require('redis')
const logger = require('./helpers/logger')

// Load environment variables
dotenv.load({ path: path.resolve(__dirname, './../.env') })

// Create redis client
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
})

redisClient.on('error', function(err) {
  process.exit()
  logger.log('error', err)
})

redisClient.on('ready', function(err) {
  logger.log(
    'info',
    `Redis client connected to ${process.env.REDIS_HOST}:${
      process.env.REDIS_PORT
    }`
  )

  redisClient.publish(
    'USER',
    JSON.stringify({
      topic: 'USER:5b339023f949c726b8353760',
      event: 'USER:PROFILE:UPDATED',
      payload: {},
      ref: '5b339023f949c726b8353890'
    })
  )

  redisClient.publish(
    'MESSAGES',
    JSON.stringify({
      topic: 'MESSAGES:5b339023f949c726b8353760',
      event: 'MESSAGES:RECEIVED',
      payload: {},
      ref: '5b339023f949c726b8353890'
    })
  )

  redisClient.publish(
    'NOTIFICATION',
    JSON.stringify({
      topic: 'NOTIFICATION:5b339023f949c726b8353760',
      event: 'NOTIFICATION:RECEIVED',
      payload: {
        user_id: '5b339023f949c726b8353760',
        type: 'notification',
        message: 'Tangina mo',
        meta: {},
        is_seen: false
      },
      ref: '5b339023f949c726b8353890'
    })
  )

  redisClient.publish(
    'WALLET',
    JSON.stringify({
      topic: 'WALLET:5b339023f949c726b8353760',
      event: 'WALLET:TRANSACTION:FAILED',
      payload: {},
      ref: '5b339023f949c726b8353890'
    })
  )

  redisClient.publish(
    'BETTING',
    JSON.stringify({
      topic: 'BETTING:5b339023f949c726b8353760',
      event: 'BETTING:WINNER',
      payload: {},
      ref: '5b339023f949c726b8353890'
    })
  )
})
