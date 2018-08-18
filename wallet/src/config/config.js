import * as dotenv from 'dotenv'
import path from 'path'

const ENV_PATH =
  process.env.NODE_ENV === 'test'
    ? path.resolve(__dirname, './../../../.test.env')
    : path.resolve(__dirname, './../../../.env')

dotenv.config({ path: ENV_PATH })

export default {
  auth_url: process.env.AUTH_URL,
  app_url: process.env.WALLET_URL,
  env: process.env.NODE_ENV,
  port: process.env.WALLET_PORT,
  mongooseDebug: process.env.WALLET_MONGOOSE_DEBUG,
  mongo: {
    host: process.env.WALLET_MONGO_HOST,
    port: process.env.WALLET_MONGO_PORT
  },
  defaultCurrency: process.env.DEFAULT_CURRENCY,
  jwtSecret: process.env.JWT_SECRET,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  raven_uri: process.env.RAVEN_ACCOUNT_URI
}
