const httpStatus = require('http-status')

/**
 * @extends Error
 */
class ExtendableError extends Error {
  constructor(message, status, errors = []) {
    super(message)
    this.name = this.constructor.name
    this.message = message
    this.status = status
    this.errors = errors
    this.isOperational = true // This is required since bluebird 4 doesn't append it anymore.
    Error.captureStackTrace(this, this.constructor.name)
  }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
export default class APIError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {array} errors - Errors for validation.
   */
  constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR, errors = {}) {
    super(message, status, errors)
  }
}
