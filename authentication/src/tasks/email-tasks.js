import config from 'config/config'
import sendWelcomeEmail from 'emails/signup/signup-email'

export const USER_SIGNUP_EMAIL = ({ user, token }) => {
  return sendWelcomeEmail(user.email, {
    name: user.name,
    username: user.username,
    email: user.email,
    account_verification_token: token,
    account_verification_url: `${
      config.app_url
    }/api/signup/verify?token=${token}`
  })
}
