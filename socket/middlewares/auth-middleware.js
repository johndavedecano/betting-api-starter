const jwt = require('jsonwebtoken')
const logger = require('./../helpers/logger')

module.exports = function(socket, next) {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, function(
      err,
      decoded
    ) {
      socket.user = decoded
      next()
    })
  } else {
    logger.log('info', `Socket ${socket.id} is not authenticated.`)
    next()
  }
}
