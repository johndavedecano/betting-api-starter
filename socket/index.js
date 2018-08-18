const dotenv = require('dotenv')
const path = require('path')
const redis = require('redis')
const logger = require('./helpers/logger')
const authMiddleware = require('./middlewares/auth-middleware')

// Channels
const CHANNELS = [
  'USER',
  'WALLET',
  'MATCHES',
  'BETTING',
  'NOTIFICATION',
  'MESSAGES'
]

// Load environment variables
dotenv.load({ path: path.resolve(__dirname, './../.env') })

// Create node js http application
const server = require('./server')

server.listen(process.env.SOCKET_PORT, err => {
  if (err) {
    logger.log('error', err)
    process.exit()
  } else {
    logger.log(
      'info',
      `Http server is now listening to ${process.env.SOCKET_PORT}`
    )
  }
})

// Create socket IO instance and inject existing node server.
const io = require('socket.io').listen(server)

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
})

redisClient.on('message', function(channel, response) {
  try {
    const { topic, event, payload, ref } = JSON.parse(response)

    logger.log('info', `Topic: ${topic} Event: ${event} ID: ${ref}`)

    io.to(topic).emit(channel, { topic, event, payload, ref, channel })
  } catch (err) {
    logger.log('error', JSON.stringify(err))
  }
})

redisClient.on('subscribe', function(channel, count) {
  logger.log('info', `Redis now subscribed to ${channel} ${count} `)
})

redisClient.subscribe(CHANNELS)

// Handle IO Connection
io.use(authMiddleware).on('connection', socket => {
  logger.log('info', `User has connected. ${socket.id}`)

  socket.join('MATCH:EVENTS')
  socket.join('NOTIFICATION:ALL')

  if (socket.user && socket.user.is_active && socket.user.is_verified) {
    socket.join(`USER:${socket.user._id}`)
    socket.join(`WALLET:${socket.user._id}`)
    socket.join(`NOTIFICATION:${socket.user._id}`)
    socket.join(`BETTING:${socket.user._id}`)
    socket.join(`MESSAGES:${socket.user._id}`)
  }

  if (
    socket.user &&
    socket.user.is_active &&
    socket.user.is_verified &&
    socket.user.is_admin
  ) {
    socket.join('NOTIFICATION:ADMIN')
  }

  socket.on('disconnect', () => {
    logger.log('info', 'User has disconnected.')
  })
})
