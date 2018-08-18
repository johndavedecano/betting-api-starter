const { createLogger, format, transports } = require('winston')

// Create Logger
const { colorize, printf, combine, timestamp } = format

const consoleFormat = printf(info => {
  return `[${info.level}][${info.timestamp}] ${info.message}`
})

const fileFormat = printf(info => {
  return JSON.stringify({
    timestamp: info.timestamp,
    level: info.level,
    message: info.message
  })
})

const logger = createLogger({
  transports: [
    new transports.File({
      filename: 'socket-error.log',
      timestamp: true
    }),
    new transports.File({
      filename: 'socket-info.log',
      timestamp: true
    }),
    new transports.Console({
      timestamp: true,
      colorize: true,
      format: combine(timestamp(), colorize(), consoleFormat)
    })
  ]
})

module.exports = logger
