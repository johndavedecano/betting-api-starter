import UserWalletRepo from '../repos/user-wallet-repo'

export const USER_WALLET_CREATED = ({ user_id }) => {
  return UserWalletRepo.createWallet(user_id)
}
