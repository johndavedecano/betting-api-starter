import bodyParser from 'body-parser'
import compress from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import expressValidation from 'express-validation'
import expressWinston from 'express-winston'
import helmet from 'helmet'
import httpStatus from 'http-status'
import logger from 'morgan'
import methodOverride from 'method-override'
import Raven from 'raven'
import APIError, { ModelNotFound } from 'helpers/api-error'

export default (app, config, routes, winstonInstance) => {
  if (config.env === 'development') {
    app.use(logger('dev'))
  }

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use(compress())
  app.use(methodOverride())
  app.use(helmet())
  app.use(cors())

  Raven.config(config.raven_uri).install()

  const LOGGER_MSG =
    'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms'

  // enable detailed API logging in dev env
  if (config.env === 'development') {
    expressWinston.requestWhitelist.push('body')
    expressWinston.responseWhitelist.push('body')
    app.use(
      expressWinston.logger({
        winstonInstance,
        meta: true, // optional: log meta data about request (defaults to true)
        msg: LOGGER_MSG,
        colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
      })
    )
  }

  app.get('/', (req, res) => res.send('OK'))

  app.use('/api', routes)

  app.use((err, req, res, next) => {
    if (err instanceof expressValidation.ValidationError) {
      const error = new APIError(
        'Unprocessable Entity',
        httpStatus.UNPROCESSABLE_ENTITY,
        err.errors.map(e => e.messages[0])
      )
      return next(error)
    } else if (err instanceof ModelNotFound) {
      const error = new APIError(err.message, httpStatus.NOT_FOUND)
      return next(error)
    } else if (!(err instanceof APIError)) {
      const apiError = new APIError(err.message, err.status)
      return next(apiError)
    }
    return next(err)
  })

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new APIError('API not found', httpStatus.NOT_FOUND)
    return next(err)
  })

  if (config.env !== 'test') {
    app.use(
      expressWinston.errorLogger({
        winstonInstance
      })
    )
  }

  app.use((
    err,
    req,
    res,
    next // eslint-disable-line no-unused-vars
  ) => {
    const isServerError =
      err.status === httpStatus.INTERNAL_SERVER_ERROR || !err.status

    if (isServerError && config.env === 'production') {
      Raven.captureException(err)
    }

    if (err.status === 500 && config.env === 'test') {
      console.error(err)
    }

    let status = err.status || httpStatus.INTERNAL_SERVER_ERROR
    let response = {
      status_code: status,
      message: err.message
    }

    if (err.errors && Object.keys(err.errors).length > 0) {
      response['errors'] = err.errors
    }

    return res.status(status).json(response)
  })

  return app
}
