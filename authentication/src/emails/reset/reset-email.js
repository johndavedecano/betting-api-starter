import path from 'path'
import send from 'helpers/create-email-message'
import compile from 'helpers/compile-template'

export default function(to, data = {}) {
  try {
    return send({
      to,
      subject: 'Password Reset',
      html: compile(path.resolve(__dirname, './reset-email.hbs'), data)
    })
  } catch (err) {
    console.error(err)
    return false
  }
}
