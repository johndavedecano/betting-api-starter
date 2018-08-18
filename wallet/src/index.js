import express from 'express'
import config from 'config/config'
import createDatabase from 'helpers/create-database'
import createApi from 'helpers/create-api'
import routes from './routes'
import winstonInstance from 'config/winston'

const app = express()

createDatabase({ config })

createApi(app, config, routes, winstonInstance)

if (!module.parent) {
  app.listen(config.port, () => {
    console.info(`server started on port ${config.port} (${config.env})`)
  })
}

export default app
