import client from './create-redis-client'
import uuid4 from 'uuid/v4'

export default function(channel, topic, event, payload) {
  const ref = uuid4()
  const data = {
    topic,
    event,
    payload,
    ref
  }

  client.publish(channel, JSON.stringify(data))

  return data
}
