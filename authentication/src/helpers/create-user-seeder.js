import createDatabase from './create-database'

import config from 'config/config'
import UserModel from 'models/user-model'

async function up() {
  await UserModel.remove({})

  await UserModel.create({
    name: 'John Dave Decano',
    email: 'johndavedecano@gmail.com',
    username: 'johndavedecano',
    password: 'password',
    is_verified: true,
    is_active: true,
    is_admin: true,
    is_otp: false
  })

  await UserModel.create({
    name: 'John Dave Decano',
    email: 'pasigweb@gmail.com',
    username: 'pasigweb',
    password: 'password',
    is_verified: true,
    is_active: true,
    is_admin: false,
    is_otp: false
  })

  console.log('Finished seeding user documents...')

  process.exit()
}

if (config.env !== 'production') {
  createDatabase({ config })

  up()
}
