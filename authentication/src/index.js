import express from 'express'
import path from 'path'
import config from 'config/config'
import createDatabase from 'helpers/create-database'
import createApi from 'helpers/create-api'
import createViewsSupport from 'helpers/create-views-support'
import routes from './routes'
import winstonInstance from 'config/winston'

const app = express()

createDatabase({ config })

createViewsSupport(app, path.join(__dirname, 'views'))

createApi(app, config, routes, winstonInstance)

if (!module.parent) {
  app.listen(config.port, () => {
    console.info(`server started on port ${config.port} (${config.env})`)
  })
}

export default app
