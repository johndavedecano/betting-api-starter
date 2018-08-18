import path from 'path'
import send from 'helpers/create-email-message'
import compile from 'helpers/compile-template'

export default function(to, data = {}) {
  try {
    return send({
      to,
      subject: 'Email Verification Required',
      html: compile(path.resolve(__dirname, './user-email.hbs'), data)
    })
  } catch (err) {
    console.error(err)
    return false
  }
}
