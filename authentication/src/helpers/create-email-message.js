import createEmailTransport from './create-email-transport'
import config from 'config/config'

const transport = createEmailTransport()
const { address, name } = config.email
const from = `${name} <${address}>`

export default async function(options = {}) {
  return new Promise((resolve, reject) => {
    if (!options.to) {
      throw new Error('Receipient not defined')
    }
    transport.sendMail(
      {
        from,
        ...options
      },
      function(err, res) {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      }
    )
  })
}
