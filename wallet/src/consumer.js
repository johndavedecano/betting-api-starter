import Queue from 'bee-queue'
import isFunction from 'lodash/isFunction'
import config from './config/config'

import logger from './helpers/create-redis-logger'

import WalletTasks from './tasks'
import createDatabase from './helpers/create-database'

const USER_WALLET = 'USER_WALLET'

createDatabase({ config })

const logMessage = (type = 'info', message = '', other = '') => {
  logger.log(type, `[${new Date().toLocaleString()}] ${other}`, message)
}

const queue = new Queue(USER_WALLET, {
  redis: config.redis
})

queue.on('ready', function() {
  logMessage('info', 'Queue is ready')
})

queue.on('retrying', (job, err) => {
  logMessage(
    'warning',
    `Job ${job.id} failed with error ${err.message} but is being retried!`
  )
})

queue.process(async function(job) {
  const worker = WalletTasks[job.data.type]

  logMessage('info', JSON.stringify(job.data), job.data.type)

  if (!isFunction(worker)) return Promise.resolve()

  return await worker(job.data.payload)
})

queue.on('error', err => {
  logMessage('error', err.message)
})

// Some reasonable period of time for all your concurrent jobs to finish
// processing. If a job does not finish processing in this time, it will stall
// and be retried. As such, do attempt to make your jobs idempotent, as you
// generally should with any queue that provides at-least-once delivery.
const TIMEOUT = 30 * 1000

process.on('uncaughtException', async () => {
  // Queue#close is idempotent - no need to guard against duplicate calls.
  try {
    await queue.close(TIMEOUT)
  } catch (err) {
    console.error('bee-queue failed to shut down gracefully', err)
  }
  process.exit(1)
})
