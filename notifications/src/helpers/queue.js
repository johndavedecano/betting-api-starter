import Queue from 'bee-queue'
import config from 'config/config'

export default async function(channel, type, payload) {
  const queue = new Queue(channel, {
    redis: config.redis,
    worker: false
  })

  const job = queue.createJob({ type, payload })

  await job.save()

  queue.close(3000)

  return Promise.resolve()
}
