import * as dotenv from 'dotenv'
import path from 'path'

const ENV_PATH =
  process.env.NODE_ENV === 'test'
    ? path.resolve(__dirname, './../../../.test.env')
    : path.resolve(__dirname, './../../../.env')

dotenv.config({ path: ENV_PATH })

export default {
  wallets_url: process.env.WALLET_URL,
  app_url: process.env.AUTH_URL,
  env: process.env.NODE_ENV,
  port: process.env.AUTH_PORT,
  mongooseDebug: process.env.AUTH_MONGOOSE_DEBUG,
  jwtSecret: process.env.JWT_SECRET,
  mongo: {
    host: process.env.AUTH_MONGO_HOST,
    port: process.env.AUTH_MONGO_PORT
  },
  email: {
    address: process.env.EMAIL_FROM_ADDRESS,
    name: process.EMAIL_FROM_NAME
  },
  smtp: {
    host: process.env.EMAIL_SMTP_HOST,
    user: process.env.EMAIL_SMTP_USER,
    pass: process.env.EMAIL_SMTP_PASS,
    port: process.env.EMAIL_SMTP_PORT
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  raven_uri: process.env.RAVEN_ACCOUNT_URI
}
