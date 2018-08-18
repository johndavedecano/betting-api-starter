import nodemailer from 'nodemailer'
import stubTransport from 'nodemailer-stub-transport'

import config from 'config/config'

export default function() {
  let transport

  if (config.env === 'test') {
    transport = nodemailer.createTransport(stubTransport())
  } else {
    const { user, pass, host, port } = config.smtp

    const transportOptions = {
      host: host,
      port: port,
      auth: {
        user: user,
        pass: pass
      }
    }

    transport = nodemailer.createTransport(transportOptions)
  }

  return transport
}
