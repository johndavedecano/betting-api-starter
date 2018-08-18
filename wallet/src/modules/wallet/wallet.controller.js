import UserWalletRepo from 'repos/user-wallet-repo'

/**
 * @param req
 * @param res
 * @param next
 *
 * @returns {*}
 */
async function list(req, res, next) {
  try {
    const wallets = await UserWalletRepo.getWallets(req.query)
    return res.json({
      wallets
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @param req
 * @param res
 * @param next
 *
 * @returns {*}
 */
async function find(req, res, next) {
  try {
    const wallet = await UserWalletRepo.findWallet(req.params.user_id)
    return res.json({
      wallet
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @param req
 * @param res
 * @param next
 *
 * @returns {*}
 */
async function create(req, res, next) {
  try {
    const wallet = await UserWalletRepo.createWallet(req.params.user_id)

    return res.json({
      wallet
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @param req
 * @param res
 * @param next
 *
 * @returns {*}
 */
async function update(req, res, next) {
  try {
    const wallet = await UserWalletRepo.updateWallet(
      req.params.user_id,
      req.body
    )

    return res.json({
      wallet
    })
  } catch (error) {
    return next(error)
  }
}

/**
 * @param req
 * @param res
 * @param next
 *
 * @returns {*}
 */
async function destroy(req, res, next) {
  try {
    const wallet = await UserWalletRepo.destroyWallet(req.params.user_id)

    return res.json({
      wallet
    })
  } catch (error) {
    next(error)
  }
}

export default {
  list,
  find,
  create,
  update,
  destroy
}
