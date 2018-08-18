import get from 'lodash/get'

import walletService from 'services/wallet-service'

export default async function(req, res, next) {
  try {
    const user = req.user

    const response = await walletService.getUserWallet(user._id)

    req.user.wallet = get(response, 'data.wallet', {})

    next()
  } catch (error) {
    next(error)
  }
}
