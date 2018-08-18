export const GLOBAL_EXPIRATION = Date.now() + 3600000

// MESSAGES
export const MSG_INSUFFICIENT_BALANCE = 'Insufficient balance'
export const MSG_USER_NOTFOUND = 'User not found'
export const MSG_WALLET_NOTFOUND = 'Wallet not found'
export const MSG_TRANSACTION_NOTFOUND = 'Transaction not found'
export const MSG_TRANSACTION_FAILED = 'Transaction is already failed.'
export const MSG_TRANSACTION_ARCHIVED = 'Cannot archive a pending transaction.'

// STRINGS
export const DEBIT = 'debit'
export const CREDIT = 'credit'
export const COMPLETED = 'completed'
export const PENDING = 'pending'
export const FAILED = 'failed'
export const WITHDRAW = 'withdraw'
export const DEPOSIT = 'deposit'
export const ADJUSTMENT = 'adjustment'
export const BET = 'bet'
export const WIN = 'win'

// ENUMS
export const TYPES = [DEBIT, CREDIT]
export const CATEGORIES = [WITHDRAW, DEPOSIT, ADJUSTMENT, BET, WIN]

export const STATUSES = [PENDING, COMPLETED, FAILED]
